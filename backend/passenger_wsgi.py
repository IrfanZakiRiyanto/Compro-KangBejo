import sys
import os
import asyncio
import http
from io import BytesIO

# Pindahkan working directory ke folder ini secara absolut
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Logging untuk memantau proses (bisa dinonaktifkan di local dev jika diinginkan)
def log(msg):
    try:
        with open("passenger_debug.log", "a") as f:
            f.write(msg + "\n")
    except Exception:
        pass

log("\n--- Custom WSGI Adapter Triggered ---")

try:
    from main import app
    log("Aplikasi FastAPI berhasil di-import!")
except Exception as e:
    import traceback
    log("Gagal import aplikasi:\n" + traceback.format_exc())
    raise e

def application(environ, start_response):
    path = environ.get('PATH_INFO', '')
    log(f"--> Request masuk: {path}")
    
    # 1. Bangun ASGI scope dari WSGI environ
    headers = []
    for key, value in environ.items():
        if key.startswith('HTTP_'):
            name = key[5:].lower().replace('_', '-').encode('latin-1')
            headers.append((name, value.encode('latin-1')))
        elif key in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            name = key.lower().replace('_', '-').encode('latin-1')
            headers.append((name, value.encode('latin-1')))

    query_string = environ.get('QUERY_STRING', '').encode('latin-1')
    
    scope = {
        'type': 'http',
        'asgi': {'version': '3.0', 'spec_version': '2.0'},
        'http_version': '1.1',
        'method': environ.get('REQUEST_METHOD', 'GET'),
        'path': path,
        'raw_path': path.encode('latin-1'),
        'query_string': query_string,
        'headers': headers,
        'server': (environ.get('SERVER_NAME', 'localhost'), int(environ.get('SERVER_PORT', 80))),
        'client': (environ.get('REMOTE_ADDR', '127.0.0.1'), 0),
    }

    # 2. Ambil request body
    body_io = environ.get('wsgi.input', BytesIO())
    try:
        content_length = int(environ.get('CONTENT_LENGTH', 0) or 0)
    except ValueError:
        content_length = 0
    body_bytes = body_io.read(content_length) if content_length > 0 else b''
    
    body_sent = False
    
    async def receive():
        nonlocal body_sent
        if not body_sent:
            body_sent = True
            return {
                'type': 'http.request',
                'body': body_bytes,
                'more_body': False
            }
        return {
            'type': 'http.disconnect'
        }

    response_status = '200 OK'
    response_headers = []
    response_body = []

    async def send(message):
        nonlocal response_status, response_headers
        if message['type'] == 'http.response.start':
            status_code = message['status']
            try:
                status_phrase = http.HTTPStatus(status_code).phrase
            except Exception:
                status_phrase = "OK"
            response_status = f"{status_code} {status_phrase}"
            response_headers = [
                (k.decode('latin-1'), v.decode('latin-1'))
                for k, v in message.get('headers', [])
            ]
        elif message['type'] == 'http.response.body':
            body_chunk = message.get('body', b'')
            if body_chunk:
                response_body.append(body_chunk)

    # 3. Jalankan loop secara sinkron di main thread tanpa thread tambahan
    loop = asyncio.new_event_loop()
    try:
        asyncio.set_event_loop(loop)
        loop.run_until_complete(app(scope, receive, send))
        log(f"<-- Request selesai dengan status {response_status}")
    except Exception as ex:
        import traceback
        log(f"[ERROR] Request gagal:\n{traceback.format_exc()}")
        response_status = '500 Internal Server Error'
        response_headers = [('Content-Type', 'text/plain')]
        response_body = [traceback.format_exc().encode('utf-8')]
    finally:
        loop.close()

    start_response(response_status, response_headers)
    return response_body

