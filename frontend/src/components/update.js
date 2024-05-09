import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "rohit@gmail.com", // Fixed email
    age:"",
    height: "",
    weight: "",
    gender: "",
    pregnancy: ""
  });
  const [showPregnancyInput, setShowPregnancyInput] = useState(false);
  const history = useNavigate();

  async function submittobackend(e) {
    e.preventDefault();
  
    try {
      const fetchdata = await fetch('http://localhost:8000/api/user/update', {
        method: 'PATCH', // Change POST to PATCH
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const datares = await fetchdata.json();
      console.log(datares);
  
      if (fetchdata.ok) {
        localStorage.setItem('token', datares.token);
        history('/login');
        setTimeout(() => {
          alert(datares.success);
        }, 100);
      } else {
        alert(datares.error);
      }
    } catch (error) {
      console.error(error);
      alert('sucessful');
      history('/login');
    }
  }
  

  function handleInputChange(event) {
    const { name, value } = event.target;
    
    // Update the data state
    setData({ ...data, [name]: value });
  
    // If gender is "Female", show the pregnancy field
    if (name === "gender" && value === "female") {
      setShowPregnancyInput(true);
    } else if (name === "gender" && value !== "female") {
      // If gender is not "Female", hide the pregnancy field
      setShowPregnancyInput(false);
      
      // If the gender is changed, reset the pregnancy field
      setData(prevData => ({ ...prevData, pregnancy: "" }));
    }
  }
  

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <div className="container mx-auto p-8">
        <div className="relative">
          <div className="bg-gray-700 bg-opacity-80 rounded-lg p-8 overflow-y-auto max-h-screen">
            <div className="text-3xl font-serif text-black mb-4">Join Us!</div>

            <p className='text-black mb-4'>Unlock a world of possibilities with your new account!</p>

            <form onSubmit={submittobackend} method='POST' className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-black">Full Name:</label>
                <input type="text" id="fullName" name="fullname" value={data.fullname} onChange={handleInputChange} className="input-style" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-black">Email:</label>
                <input type="text" id="email" name="email" value={data.email} readOnly className="input-style" />
              </div>
              <div className="space-y-2">
                <label htmlFor="age">Age:</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={data.age}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    const pattern = /[0-9\b]/;
                    if (!pattern.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="height">Height (in cm):</label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={data.height}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    const pattern = /[0-9\b]/;
                    if (!pattern.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="weight">Weight (in kg):</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={data.weight}
                  onChange={handleInputChange}
                  onKeyPress={(e) => {
                    const pattern = /[0-9\b]/;
                    if (!pattern.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="input">
                <label htmlFor="gender">Gender:</label>
                <select id="gender" name="gender" value={data.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="none">None</option>
                </select>
              </div>
              
              {showPregnancyInput && (
                <div className="space-y-2">
                  <label htmlFor="pregnancy" className="block text-black">Pregnancy:</label>
                  <select id="pregnancy" name="pregnancy" value={data.pregnancy} onChange={handleInputChange} className="input-style">
                    <option value="">Select Pregnancy</option>
                    <option value="none">none</option>
                    <option value="pregnant1st">pregnant1st</option>
                    <option value="pregnant2nd_1">pregnant2nd_1</option>
                    <option value="pregnant2nd_2">pregnant2nd_2</option>
                    <option value="pregnant3rd">pregnant3rd</option>
                    <option value="lactating1st">lactating1st</option>
                    <option value="lactating2nd">lactating2nd</option>
                  </select>
                </div>
              )}

              <button type="submit" className="button col-span-2">Sign Up</button>
             
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
