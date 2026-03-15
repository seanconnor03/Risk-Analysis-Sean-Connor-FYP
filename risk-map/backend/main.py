
from flask import Flask, request, jsonify, send_file # flask and add ons
from flask_cors import CORS    ##Import cors
import openrouteservice   ##ORS import
from openrouteservice.directions import directions   
import folium #Import folium to create map and marks
import csv  # Import csv 
import pandas as pd # Pandas
from dotenv import load_dotenv
import os

load_dotenv('.env') # loads API from envirnoment 

client = openrouteservice.Client(key=os.getenv("ORS_API_KEY")) # API key

app = Flask(__name__)  # Flask server

CORS(app, resources={r"/*": {"origins": "*"}})   # Cross-Origin Resource Sharing, allows interaction between resources 
@app.route("/map") # Map

def serve_map():
    
    return send_file("map.html")  #sends map, so map wont appear on page unless the backend server  is running



Age_gender = { # More straight forward to store the Age and Gender data here and access it based on the inputs
    'Female': pd.Series([1.58, 2.22, 4.75, 2.59, 3.01, 2.32, 5.44],
                        index=['18-20 years','21-24 years','25-34 years','35-44 years','45-54 years','55-64 years','65 years and over']),
    'Male': pd.Series([8.71, 11.88, 20.12, 13.36, 7.18, 5.12, 11.72],
                        index=['18-20 years','21-24 years','25-34 years','35-44 years','45-54 years','55-64 years','65 years and over'])
}

df = pd.DataFrame(Age_gender) # stored as dataframe.

#print(df) #printing  dataframe

day_risk = { 'Day':1, 'Night':4.624} # Dictionary to store the Night and Day values, if input is day the value used in calculation is 1 and vice versa.

#print(day_risk) #  print dictionary time of day

@app.route('/handle/post', methods=['POST']) ##post end point for inputs 
def handle_post():  #handling https requests 
    
    if request.method == 'POST': # If the server receives a HTTP POST request. do this...
          data = request.get_json() # Saves the received inputs as data
          print('Received json data',data)    
          start_loc = data.get('start') # Start Location  
          end_loc = data.get('end') # End location
          input_age = data.get('age') # Age group
          input_gender = data.get('gender') # Gender
          input_day = data.get('day') # Time of Day
          
    startRes= client.pelias_search(text=start_loc, size =1, country="IRL") # combines full text search, takes the top result in ireland corresponding to the inputted location. 
    endRes= client.pelias_search(text=end_loc, size =1, country="IRL") # combines full text search, takes the top result in ireland corresponding to the inputted location. 
    
    #print(startRes) # printing returned JSON start object, making sure it works 
    
    #print(endRes) # printing returned JSON end object, making sure it works
    
    startfeat= startRes["features"][0] # Extracts the first start feature.
    endfeat= endRes["features"][0] # Extracts the first end feature.
    
    #print(startfeat) # print features, remove comment if want features printed 
    
    s_lon, s_lat=startfeat["geometry"]["coordinates"] # Extracting longitude and latitude from geometry of start feature.
    e_lon, e_lat=endfeat["geometry"]["coordinates"] # Extracting longitude and latitude from geometry of end feature.
    
    print(F"Start : longitude {s_lon} ,  latitude {s_lat} ")
    print(F"Start : latitude {s_lat} ,  longitude {s_lon} ")
    s_latlon = (s_lat, s_lon) # Coordinates needed to be switched to be used with a folium map, Storing latitude and longitude in variable in form [latitude, longitude].
    e_latlon = (e_lat, e_lon)
    
    
    print("Start: ",start_loc,"to End: ",end_loc) # Printing start and end location to terminal.
    
    print(F"Start: {s_latlon} End: {e_latlon}") # Printing start and end coordinates to terminal.
   
    c_lat=(s_latlon[0]+e_latlon[0])/2 # Takes the average between latitudes and longitudes, this is used to set the map.
    c_lon=(s_latlon[1]+e_latlon[1])/2
    
    m = folium.Map(location=[c_lat,c_lon],zoom_start=10) # Creates a folium map, between the two destinations and set a zoom of 10.
    
       
    folium.Marker( # Location marker.
                  
        location=s_latlon, # Start coordinates     
         
        tooltip=start_loc # Displays location on hover.
    
    ).add_to(m) # Add to m, m is the display map
    
    folium.Marker( # Location marker.
                  
        location=e_latlon, # End coordinates.    
            
        tooltip=end_loc # Displays location on hover.
    
    ).add_to(m) # Add to m, m is the display map.
    
    coords = [ # provides coordinates for obtaining the route, connecting to ORS API the coordinates need to be flipped again.
              
        (s_latlon[1],s_latlon[0]), # To be flipped [1] = longitude, [0] = latitude, this is valid for ORS which accepts format [longitude , latitude].
        (e_latlon[1],e_latlon[0])
        
    ]
    
    route = client.directions(coordinates=coords, # calls the ORS API and returns a driving route based off the coordinates in a JSON object.
                         profile='driving-car',  
                         format='geojson')
    #print(route), Remove comment if want route printed
    
    line_coords = [ # Coordinates of the line from point A to point B
                   
        [lat,lon]    
        
        for lon, lat in 
        
        route['features'][0]['geometry']['coordinates'] # ORS returns [longitude, latitude] but folium accepts [latitude, longitude], so the coordinates are swapped.
    ]
    folium.PolyLine(locations=line_coords, color="blue").add_to(m) # Adds a blue line to the route between start and end, then adds it to the map.
    
    
    Distance = route['features'][0]['properties']['summary']['distance'] # Extracting distance from route response [0] means select the first value.
    Time = route['features'][0]['properties']['summary']['duration']   # Extracting duration from route response.
    steps = route['features'][0]['properties']['segments'][0]['steps']   # Extracts the travel steps from route response [0] grabbing first element i.e. steps
    
    total_seconds=int(Time) # Setting Time to an integer as it was extracted as a string. In the form seconds.
    
    hours = total_seconds//3600 # Converting seconds to hours .  
    
    minutes=((total_seconds%3600)//60) # Converting seconds to minutes, "//" is used as a floor operator, divides the first term by the second term and rounds result to nearest whole number.
    
    with open("roads.csv", mode="w", newline="") as file: # Saving the route to a CSV file
                                                                          
            writer = csv.writer(file)   
                                         
            writer.writerow(["Road","Distance Meters","START","END"] ) 
               
            for step in steps: # Looking at each travel step and printing the road and distance.                            
                 road = step["name"]           
                 dist = step["distance"]
                 
                 if road =="" or road == "-" : # If a road name is empty, rename it to undefined.
                     
                     road = "Undefined road"       
                     
                 writer.writerow([road, dist])       
            writer.writerow([start_loc,end_loc])  
    
    for step in steps: # Steps is within features -> properties -> segments. Think of it as the steps to get from destination A to destination B
        
        road = step["name"] # Name of the road to take.                
        dist = step["distance"] # How far the driver needs to travel on this road.
        
        if road =="" or road == "-" :  # If a road name is empty, rename it to undefined.
            
            road = "Undefined road" 
            
        print("Road Description : "+str(road)+ "   Road distance:"+ str(dist)+" Meters" )   # Printing route to the terminal, i.e. name of road and its length. 
        
        
      
    #Calculating Micromort, risk_percent is taken from the df DataFrame on line 23 
    
    TimeOfDay = day_risk[input_day] # Value is assigned to TimeOfDay whether it is 'Day' or 'Night'   
    
    AverageDeathPerGroup = 7.142 # Average probability of death between 14 groups, defined in equation (4.1).
    
    RiskPerKm = 4.90523678e-9 # Risk of death per kilometre from equation (4.18).
    
    risk_percent = df.loc[input_age, input_gender] # locates the risk percentage of the gender and age group using the DataFrame defined on line 23. 
    
    KM = round(Distance/1000,1) # Distance was returned as meters, need to be converted into kilometres.
    
    RiskMultiplier = (risk_percent)/(AverageDeathPerGroup) # Derived in chapter 4 of project report, under equation (4.2).
    
    Micromort = RiskPerKm*KM*RiskMultiplier*TimeOfDay*1000000 # Calculation, derived in chapter 4 of project report equation (4.19).
    
    
    
    
    print("Total Distance is :" + str(round(Distance/1000))+"KM") # Distance was returned as meters, need to be converted into kilometres
    
    print(f"Total time is: {hours} hours {minutes} minutes") # Time
    
    print("Chance of death is " + str(Micromort)) # Micromort
    
    print("Input Age = "+str(input_age)) # Age
    
    print("Input Gender = "+str(input_gender)) # Gender
    
    print("Input Day = "+str(input_day)) # Day
    
    
    
   
    
    m.save("map.html") # saves map, with updated changes.   
  
    return jsonify({ # Returns inputs to be displayed in the card component.
    "status":"success",                       
    "message":"WayPoints set set",
    "inputs":{
        "Start": start_loc,
        "End": end_loc,
        "Age": input_age,
        "Gender": input_gender,
        "Day":input_day
    },
    "results":{  #Returns variables to be displayed to the user, once server receives these results the app will update.
        "distance":round(Distance/1000,1),
        "duration":hours,
        "duration_mins":minutes,
        "risk":round(Micromort,4)
    }
})
    

if __name__ == "__main__":
      app.run(port=5000, debug =True) #server running on port 5000
      
      
      
    