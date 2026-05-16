"""
test_facilities.py — Test endpoint fasilitas (CRUD)
Modul 10: CI Pipeline
"""


# ──────────────────────────────────────────────────────────────
#  READ
# ──────────────────────────────────────────────────────────────

def test_list_facilities_empty(client):
    """GET /facilities harus return list kosong jika DB kosong."""
    response = client.get("/facilities")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] == 0
    assert data["items"] == []


def test_list_facilities_after_create(client):
    """GET /facilities harus return item yang sudah dibuat."""
    client.post("/facilities", json={
        "name": "Kebun Kangkung",
        "description": "Area kebun kangkung",
        "icon": "🌿"
    })
    response = client.get("/facilities")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Kebun Kangkung"


# ──────────────────────────────────────────────────────────────
#  CREATE
# ──────────────────────────────────────────────────────────────

def test_create_facility_success(client):
    """POST /facilities harus buat fasilitas baru dan return 201."""
    payload = {
        "name": "Spot Foto",
        "description": "Area foto instagramable",
        "icon": "📸"
    }
    response = client.post("/facilities", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Spot Foto"
    assert data["icon"] == "📸"
    assert "id" in data
    assert data["is_active"] is True


def test_create_facility_minimal(client):
    """POST /facilities hanya dengan nama wajib harus berhasil."""
    response = client.post("/facilities", json={"name": "Pujasera"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Pujasera"


def test_create_facility_missing_name(client):
    """POST /facilities tanpa name harus return 422."""
    response = client.post("/facilities", json={"description": "test"})
    assert response.status_code == 422


# ──────────────────────────────────────────────────────────────
#  GET BY ID
# ──────────────────────────────────────────────────────────────

def test_get_facility_by_id(client):
    """GET /facilities/{id} harus return fasilitas yang benar."""
    create_resp = client.post("/facilities", json={"name": "Edukasi", "icon": "📚"})
    fid = create_resp.json()["id"]

    response = client.get(f"/facilities/{fid}")
    assert response.status_code == 200
    assert response.json()["id"] == fid


def test_get_facility_not_found(client):
    """GET /facilities/9999 harus return 404."""
    response = client.get("/facilities/9999")
    assert response.status_code == 404


# ──────────────────────────────────────────────────────────────
#  UPDATE
# ──────────────────────────────────────────────────────────────

def test_update_facility(client):
    """PUT /facilities/{id} harus update nama fasilitas."""
    create_resp = client.post("/facilities", json={"name": "Lama"})
    fid = create_resp.json()["id"]

    update_resp = client.put(f"/facilities/{fid}", json={"name": "Baru"})
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Baru"


# ──────────────────────────────────────────────────────────────
#  DELETE
# ──────────────────────────────────────────────────────────────

def test_delete_facility(client):
    """DELETE /facilities/{id} harus hapus fasilitas dan return 204."""
    create_resp = client.post("/facilities", json={"name": "Hapus"})
    fid = create_resp.json()["id"]

    del_resp = client.delete(f"/facilities/{fid}")
    assert del_resp.status_code == 204

    # Verifikasi sudah tidak ada
    get_resp = client.get(f"/facilities/{fid}")
    assert get_resp.status_code == 404


def test_delete_facility_not_found(client):
    """DELETE /facilities/9999 harus return 404."""
    response = client.delete("/facilities/9999")
    assert response.status_code == 404
