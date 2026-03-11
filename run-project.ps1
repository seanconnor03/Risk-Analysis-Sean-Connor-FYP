cd risk-map\Backend
start powershell {venv\Scripts\activate; python main.py}
cd ..\
cd Frontend 
start powershell {npm run dev}
Start-Process "http://localhost:5173/"

