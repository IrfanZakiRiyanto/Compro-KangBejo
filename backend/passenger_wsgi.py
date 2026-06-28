import sys
import os

# Tambahkan path ke folder backend agar python bisa meng-import main.py
sys.path.insert(0, os.path.dirname(__file__))

# Import FastAPI app dari main.py
from main import app

# Gunakan a2wsgi untuk mengubah ASGI app menjadi WSGI app (karena Passenger cPanel hanya support WSGI)
from a2wsgi import ASGIMiddleware

# Passenger mencari variabel bernama 'application'
application = ASGIMiddleware(app)
