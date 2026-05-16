"""
test_activities.py — Test endpoint kegiatan (CRUD)
Modul 10: CI Pipeline
"""


# ──────────────────────────────────────────────────────────────
#  READ
# ──────────────────────────────────────────────────────────────

def test_list_activities_empty(client):
    """GET /activities harus return list kosong jika DB kosong."""
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] == 0


def test_list_activities_after_create(client):
    """GET /activities harus return item yang sudah dibuat."""
    client.post("/activities", json={
        "name": "Bazar Murah",
        "description": "Pasar produk lokal",
        "icon": "🛒"
    })
    response = client.get("/activities")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Bazar Murah"


# ──────────────────────────────────────────────────────────────
#  CREATE
# ──────────────────────────────────────────────────────────────

def test_create_activity_success(client):
    """POST /activities harus buat kegiatan baru dan return 201."""
    payload = {
        "name": "Tanam Kangkung",
        "description": "Pengalaman menanam kangkung",
        "icon": "🌱"
    }
    response = client.post("/activities", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Tanam Kangkung"
    assert data["icon"] == "🌱"
    assert "id" in data
    assert data["is_active"] is True


def test_create_activity_missing_name(client):
    """POST /activities tanpa name harus return 422."""
    response = client.post("/activities", json={"description": "test"})
    assert response.status_code == 422


# ──────────────────────────────────────────────────────────────
#  GET BY ID
# ──────────────────────────────────────────────────────────────

def test_get_activity_by_id(client):
    """GET /activities/{id} harus return kegiatan yang benar."""
    create_resp = client.post("/activities", json={"name": "Tari Daerah", "icon": "💃"})
    aid = create_resp.json()["id"]

    response = client.get(f"/activities/{aid}")
    assert response.status_code == 200
    assert response.json()["id"] == aid


def test_get_activity_not_found(client):
    """GET /activities/9999 harus return 404."""
    response = client.get("/activities/9999")
    assert response.status_code == 404


# ──────────────────────────────────────────────────────────────
#  UPDATE
# ──────────────────────────────────────────────────────────────

def test_update_activity(client):
    """PUT /activities/{id} harus update nama kegiatan."""
    create_resp = client.post("/activities", json={"name": "Lama"})
    aid = create_resp.json()["id"]

    update_resp = client.put(f"/activities/{aid}", json={"name": "Baru"})
    assert update_resp.status_code == 200
    assert update_resp.json()["name"] == "Baru"


# ──────────────────────────────────────────────────────────────
#  DELETE
# ──────────────────────────────────────────────────────────────

def test_delete_activity(client):
    """DELETE /activities/{id} harus hapus kegiatan dan return 204."""
    create_resp = client.post("/activities", json={"name": "Hapus"})
    aid = create_resp.json()["id"]

    del_resp = client.delete(f"/activities/{aid}")
    assert del_resp.status_code == 204

    get_resp = client.get(f"/activities/{aid}")
    assert get_resp.status_code == 404


def test_delete_activity_not_found(client):
    """DELETE /activities/9999 harus return 404."""
    response = client.delete("/activities/9999")
    assert response.status_code == 404


# ──────────────────────────────────────────────────────────────
#  STATS
# ──────────────────────────────────────────────────────────────

def test_stats_endpoint(client):
    """GET /stats harus return hitungan fasilitas dan kegiatan."""
    client.post("/facilities", json={"name": "Fasilitas 1"})
    client.post("/activities", json={"name": "Kegiatan 1"})
    client.post("/activities", json={"name": "Kegiatan 2"})

    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["facilities"]["total"] == 1
    assert data["activities"]["total"] == 2
