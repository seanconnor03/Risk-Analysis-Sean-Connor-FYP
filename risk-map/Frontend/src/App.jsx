import { useState } from 'react'; // React Hook
import './App.css' // Importing CSS 



function App()  // Main component 
{
  const[inputs, setInputs] = useState({   //Inputs, will store inputted values
    Start:"",
    End:"",
    age:"",
    gender:"",              
    Day:"",            
  });
   const[result, setResult]= useState(null); // Stores backend returned data.

      const handleChange = (e)=> {
        const { name, value} = e.target;   // Extracts the input field field and value
        setInputs((values) => ({...values, [name]: value})); // Updates input field being changed
      };
      
      const WayPoints = async () =>{
            if(!inputs.Start || !inputs.End || !inputs.age || !inputs.gender || !inputs.Day){ // If any input field is empty, alert the user.
              alert("please fill all fields.");           
              return;
            }

            try{
              const response = await fetch("http://localhost:5000/handle/post",{   // Sends flask HTTP POST request . 
                method: "POST", // POST Method
                headers: {
                  "Content-Type": "application/json",     // JSON format
                },
                body:JSON.stringify({   // Converting to JSON string
                  start: inputs.Start,     //putting in json format for start and end inputs 
                  end: inputs.End,
                  age: inputs.age,     //putting in json format for start and end inputs 
                  day: inputs.Day,
                  gender: inputs.gender,
                }),
              });
             

              const data = await response.json(); // Converts returned response into JavaScript
              alert(data.message);
              

              if(data.status == "success"){   // Only if data is returned successfully
                document.querySelector(".MapDisplay iframe").src += ""; // Reload the iframe, this will update 
                setResult(data); // rerenders UI, showing card component with returned data
               
              }
            }
            catch(error){
              console.error("Backend error", error);       //logs error
              alert("Invalid address or could not reach backend "); // if error alert the user.
            }
            
            
           
      
      };
  const Card = ({result}) => {
    const [page, setPage] = useState(""); 
    
    return (

      <div className='Return-container'>
        <div className='Cardtabs'>
         <nav className='Navbar'> 
          
          <button className = "Button-route" type="button" onClick={() => setPage("route")}>Route </button>

          <button className = "Button-profile" type="button" onClick={() => setPage("profile")}>Profile </button>
         
          <button className = "Button-risk" type="button" onClick={() => setPage("risk")}>Risk </button>

          </nav>
        </div>
                         {page == "route" && (  // If page selcted is route. 
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
                    </label>                      {/* input fields for planning the route */}
                    
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

                  <form className='User'> {/*Container for user inputed data such as Age, Gender,Time of day    */}
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
                    </select>
                    </label>


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
                   >Calculate Risk</button>{/* sends route and user data to backend   */}

                                            
                       <p className='returndata'> Analysed data will be returned below upon calculation</p>
                       
                       <div className='Boxx'> {/*If no result is retuned keep an empty box*/}
                           {!result ? (
                            <p>Box holds returned data</p>
                           ) : (
                            <>
                            <Card result = {result} />    {/* if result is returned then set the card result = to the returned data*/}
                            </>
                           
                           )}
                              
                       </div>

                </div>
             
            </div>      

        </div>

          <div className='MapDisplay'> <iframe  src="http://localhost:5000/map"></iframe></div>      {/*loads map from flask and map is reloaded, and its display is updated when data is returned */}

                           
             </div>               
  )
}

export default App
