@echo off
REM Go to Backend
cd /d risk-map\Backend

REM Start backend in a new PowerShell window
start powershell -NoExit -Command "venv\Scripts\activate; python main.py"

REM Go to Frontend
cd /d ..\Frontend

REM Start frontend in a new PowerShell window
start powershell -NoExit -Command "npm run dev"

REM Open browser
start http://localhost:5173/
