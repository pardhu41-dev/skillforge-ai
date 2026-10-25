from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

from app.api.endpoints.auth import otp_store

def test_send_and_verify_otp():
    test_email = "test.student@skillforge.ai"
    
    # 1. Send OTP
    response = client.post("/api/v1/auth/send-otp", json={"email": test_email})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "OTP sent to your email"
    assert "dev_otp" not in data

    # Get generated OTP directly from internal store for testing
    dev_otp = otp_store[test_email]["otp"]

    # 2. Verify OTP
    verify_res = client.post("/api/v1/auth/verify-otp", json={"email": test_email, "otp": dev_otp})
    assert verify_res.status_code == 200
    token_data = verify_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    token = token_data["access_token"]

    # 3. Access Protected /me Endpoint
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["authenticated"] is True
    assert me_data["student"]["email"] == test_email
