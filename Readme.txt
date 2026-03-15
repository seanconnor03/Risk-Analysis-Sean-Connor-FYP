Final year project, interactive web application to provide an analysis on the risk of death while undertaking a journey.

Access main code is as follows:
UI code  -> /risk-map/Frontend/src/App.jsx     
Server side -> /risk-map/Backend/main.py

Calculations contains all datasets used for acquiring micromort value.

Code in report are sections from either App.jsx or main.py.

API-KEY - https://api.openrouteservice.org/ , follow link, and generate key.

Frontend (In terminal)  cd risk-map -> cd Frontend
-Navigate to frontend.
-In terminal, enter, pip install npm

(Running)
-Start APP, enter, npm run dev


Backend (In terminal) cd risk-map -> cd Backend
-Navigate to backend 
-In terminal, enter, pip install flask pandas openrouteservice folium flask-cors

(Running)
-Activate environment, enter, venv\Scripts\activate
-Run server, enter, python main.py


NB* When inputting user details, make sure the address is in Ireland, otherwise it will return an error.
E.g Start : Maynooth University, Maynooth, Kildare
    End : University College Dublin, Dublin,