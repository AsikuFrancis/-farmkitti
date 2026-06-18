# Farmkitti Startup Script

Write-Host "=============================================="
Write-Host "   Starting Farmkitti Platform (Local MVP)    "
Write-Host "=============================================="

# Check if Python is installed
if (-not (Get-Command "python" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

$backendDir = ".\backend"
$mobileDir = ".\mobile"

# --- Backend Setup ---
Write-Host "`n[1/3] Setting up Backend..." -ForegroundColor Cyan
Set-Location $backendDir

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
}

# Activate venv
.\venv\Scripts\Activate.ps1

Write-Host "Installing backend dependencies..."
pip install -r requirements.txt
pip install aiosqlite  # Added for local SQLite execution

Write-Host "Initializing SQLite Database..."
# Run Alembic migrations
alembic revision --autogenerate -m "init"
alembic upgrade head

Write-Host "Starting FastAPI Backend..."
# Start FastAPI in background
Start-Process -NoNewWindow -FilePath "uvicorn" -ArgumentList "app.main:app --reload --port 8000"

Set-Location ..

# --- Mobile Setup ---
Write-Host "`n[2/3] Setting up Mobile App..." -ForegroundColor Cyan
Set-Location $mobileDir

Write-Host "Installing mobile dependencies..."
npm install --legacy-peer-deps

Write-Host "Starting Expo Development Server..."
# Start Expo in a new window
Start-Process -FilePath "npx" -ArgumentList "expo start"

Set-Location ..

Write-Host "`n=============================================="
Write-Host "   Farmkitti is now running!" -ForegroundColor Green
Write-Host "   Backend API: http://localhost:8000"
Write-Host "   API Docs: http://localhost:8000/docs"
Write-Host "=============================================="
Write-Host "Note: A new terminal window has opened for the Expo bundler."
Write-Host "Press Ctrl+C to stop the backend server in this window."
