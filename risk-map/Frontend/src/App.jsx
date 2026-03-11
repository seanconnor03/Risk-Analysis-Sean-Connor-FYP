import { useState } from 'react';
import './App.css'



function App() {
  const[inputs, setInputs] = useState({
    Start:"",
    End:"",
    age:"",
    gender:"",              
    Day:"",            /* just for inputs, These might change when looking at user inputs so  ,    SUBJECT TO CHANGE */
  });
   const[result, setResult]= useState(null);

      const handleChange = (e)=> {
        const { name, value} = e.target;                /*Handel set inputs*/
        setInputs((values) => ({...values, [name]: value}));
      };
      
      const WayPoints = async () =>{
            if(!inputs.Start || !inputs.End || !inputs.age || !inputs.gender || !inputs.Day){
              alert("please submit.");           /* just to check if there is something in the placeholders, it will return an alert if not*/
              return;
            }

            try{
              const response = await fetch("http://localhost:5000/handle/post",{            /*connecting to back end looking for th epost method */
                method: "POST",
                headers: {
                  "Content-Type": "application/json",            //getting data in json 
                },
                body:JSON.stringify({
                  start: inputs.Start,     //putting in json format for start and end inputs 
                  end: inputs.End,
                  age: inputs.age,     //putting in json format for start and end inputs 
                  day: inputs.Day,
                  gender: inputs.gender,
                }),
              });
             

              const data = await response.json();            //sends data
              alert(data.message);
              

              if(data.status == "success"){              //so if data was sent its going to reload the map with the updated coordinates, IF and only IF "success" is retunred.
                document.querySelector(".MapDisplay iframe").src += "";//window.location.reload();     //just a reload the iframe/map / window 
                setResult(data);
              }
            }
            catch(error){
              console.error("Backend error", error);      //any error just return and error
              alert("Could not reach backend ");
            }
            
            
           
      
      };
  const Card = ({result}) => {
    const [page, setPage] = useState("route"|"profile"|"risk");
    return (

      <div className='Return-container'>
        <div className='Cardtabs'>
         <nav className='Navbar'> 
          
          <button 
          className = "Button-route" type="button" onClick={() => setPage("route")}>Route
          </button>
          <button 
          className = "Button-profile" type="button" onClick={() => setPage("profile")}>Profile
          </button>
          <button
          className = "Button-risk" type="button" onClick={() => setPage("risk")}>Risk
          </button>

          </nav>
        </div>
                         {page == "route" && (
                            <div className='Route'>
                              <div className='D-back'>
                              <h2 className='route'><b><u>Route</u></b></h2>
                              
                              <div className='grid-cell'><b><u>Start:</u></b> {result.inputs.Start}</div>
                              <div className='grid-cell'><b><u>End:</u></b> {result.inputs.End}  &emsp;&emsp; </div>
                              <div className='grid-cell'><b><u>Time:</u></b> {result.results.duration} hour {result.results.duration_mins} Minutes  &emsp;</div>
                              <div className='grid-cell'><b><u>Distance:</u></b> {result.results.distance}Km ,&emsp; </div> 
                              <div className='grid-cell'><b><u>Time of Day:</u></b> {result.inputs.Day}</div>
                              <p>From <b>{result.inputs.Start}</b> to <b>{result.inputs.End}</b> while travelling during the <b>{result.inputs.Day}-time</b> the driver will cover a distance of <b>{result.results.distance}Km</b> spanning <b>{result.results.duration} hour {result.results.duration_mins} Minutes</b></p>
                              </div>
                            </div> 
                            )}
                            {page == "profile" && (
                            <div className='User-profile'>
                              <div className='D-back'>
                              <h2 className='profile'><b><u>User Profile</u></b></h2>

                              <div className='gridcell'><b><u>Age:</u></b> {result.inputs.Age}, &emsp;</div>
                              <div className='gridcell'><b><u>Gender:</u></b> {result.inputs.Gender}</div>
                              <p>The driver while undertaking the journey from <b>{result.inputs.Start}</b> to <b>{result.inputs.End}</b> is between <b>{result.inputs.Age}</b> and is a <b> {result.inputs.Gender}</b></p>
                              </div>           
                              </div>           
                            )}
                            {page == "risk" && (
                            <div className='Risk-assesment'>
                              <div className='D-back'>
                              <h2 className='risk'><b><u>Risk Assesment</u></b></h2>
                              <div className='gridcell'><b><u>Risk:</u></b> {result.results.risk}<b> Micromorts</b></div>
                              <p>The value shown above is the mircormort the driver is at while undertaking the journey from <b>{result.inputs.Start}</b> to <b>{result.inputs.End}</b>. A micromort a one in a million chance of death while doing an activity. There is a <b>{result.results.risk}</b> in a million chance of death over the course of this journey </p>
                              </div>
                              </div>
                            )}
                            </div> 

    )

  };

  return (

          
           <div className='Map'>
           <div className='Data-Container'> 
            <div className='Data'>
              <h1 >Risk-Analysis</h1>
              <form className='Waypoints'>
                   <label className='Start'>Start point:
                    <input
                    type = "text"
                    name = "Start"
                    placeholder='      Enter Start Destination'
                    value={inputs.Start}
                    onChange = {handleChange}
                    />
                    </label>                      {/* input fields for planning the route    */}
                    
                    <label className='End'>Destination:
                    <input
                    type = "text"
                    name = "End"
                    placeholder='      Enter End Destination'

                    value={inputs.End}
                    onChange = {handleChange}
                    />
                    
                    
                   </label>
                   

              </form>
                <div className='UserData'>{/*   Containing user data */}
                  

                  <p className='introuser'> Input User data below into the input fields. </p>

                  <form className='User'> {/*Container to hold all user inputed data such as Age, Gender, Experience, Weather,Time of day    */}
                    <label className='Age' >Input Age :
                    <select name='age' id='age' value={inputs.age} onChange={handleChange} required >
                      <option value="">Select age group</option>
                      <option value="18-20 years"> 18-20 years </option>
                      <option value="21-24 years"> 21-24 years </option>
                      <option value="25-34 years"> 25-34 years </option>
                      <option value="35-44 years"> 35-44 years </option>
                      <option value="45-54 years"> 45-54 years </option>
                      <option value="55-64 years"> 55-64 years </option>
                      <option value="65 years and over"> 65 years and over </option>
                    </select></label>


                    <label className='Gender'>Input Gender :

                    <select name='gender' id='gender' value={inputs.gender} onChange={handleChange} required >
                      <option value="">Select gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                           </label>
              
                    
                    <label className='Day'> Time  :

                    <select  name='Day'id='Day'value={inputs.Day} onChange={handleChange} required>
                      <option value="">Select time of day</option>
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select>
                    </label>
                    
                    <p className='Note'>Risk analysis will be returned in micromorts,
                                        values will vary depending on inputs.
                    </p>
                          
                  </form>
                 
                  <button className='Set-button' 
                   type="button"
                   onClick={WayPoints}
                   >Calculate Risk</button>{/*  sets starting point and user destination  */}

                                               {/*This area is juts for returned data from the analysis. Just gives the user a bit of text saying
                                                                                                       "your risk is ..... traveling ......"    */}
                       <p className='returndata'> Analysed data will be returned below upon calculation</p>
                       
                       <div className='Boxx'>
                           {!result ? (
                            <p>Box holds returned data</p>
                           ) : (
                            <>
                             <Card result = {result} />
                            </>
                           
                           )}
                              
                       </div>

                </div>
             
            </div>      

        </div>

          <div className='MapDisplay'> <iframe  src="http://localhost:5000/map"></iframe></div>      {/*Loads map and keeps it in an iFrame */}

               


              
             </div>
      
         
  )
}


export default App
