import os
import subprocess
import uvicorn

if __name__ == "__main__":
    print("Running database migrations...")
    subprocess.run(["alembic", "upgrade", "head"], check=True)

    port = int(os.environ.get("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)

