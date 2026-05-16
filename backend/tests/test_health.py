"""
test_health.py — Test endpoint kesehatan & info umum
Modul 10: CI Pipeline
"""


def test_health_check(client):
    """GET /health harus return status healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_root_endpoint(client):
    """GET / harus return pesan selamat datang."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["status"] == "running"


def test_about_endpoint(client):
    """GET /about harus return info desa wisata."""
    response = client.get("/about")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "Kang Bejo" in data["name"]


def test_team_endpoint(client):
    """GET /team harus return data tim KKN."""
    response = client.get("/team")
    assert response.status_code == 200
    data = response.json()
    assert "members" in data
    assert isinstance(data["members"], list)
    assert len(data["members"]) > 0
