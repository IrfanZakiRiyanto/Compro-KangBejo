import requests

def test_upload():
    # 1. Login
    login_url = "http://localhost:8000/admin/login"
    login_data = {"username": "admin", "password": "kangbejo2024"}
    
    try:
        r_login = requests.post(login_url, json=login_data)
        print("Login Status:", r_login.status_code)
        if r_login.status_code != 200:
            print("Login failed:", r_login.text)
            return
        
        token = r_login.json()["access_token"]
        
        # 2. Upload
        upload_url = "http://localhost:8000/admin/media"
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a small dummy file
        files = {"file": ("test.png", b"dummy_content", "image/png")}
        
        r_upload = requests.post(upload_url, headers=headers, files=files)
        print("Upload Status:", r_upload.status_code)
        print("Upload Response:", r_upload.text)
        
    except Exception as e:
        print("Error during test:", e)

if __name__ == "__main__":
    test_upload()
