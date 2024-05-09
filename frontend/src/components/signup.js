import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { ImagetoBase64 } from './imagetobase64';

const Signup = () => {
  const [passwords, setPasswords] = useState(true);
  const [passwordss, setPasswordss] = useState(true);
  const [showPregnancyInput, setShowPregnancyInput] = useState(false);
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    reenterpassword: "",
    age:"",
    height: "",
    weight: "",
    gender: "",
    pregnancy: ""
  });

  const history = useNavigate();

  function togglePasswordVisibility() {
    setPasswords(!passwords);
  }

  function toggle() {
    setPasswordss(!passwordss);
  }

  async function submittobackend(e) {
    e.preventDefault();
    if (data.password !== data.reenterpassword) {
      alert("Passwords don't match");
      return;
    }
    try {
    

      const fetchdata = await fetch('https://backendhealth.onrender.com/api/user/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      });

      const datares = await fetchdata.json();
      console.log(datares);

      if (fetchdata.ok) {
        localStorage.setItem('token', datares.token);
        history('/login');
        setTimeout(() => {
          alert('sucessful');
        }, 100);
      } else {
        alert('fill all the details');
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
    <div className='justify-center items-center min-h-screen bg-gray-4  mt-10'>
      <div className="mx-auto p-8 max-w-md md:max-w-4xl">
        <div className="relative">
          <div className="bg-gray-300 bg-opacity-80 rounded-lg p-8 overflow-y-auto max-h-screen">
            <div className="text-3xl font-serif text-black mb-4">Join Us!</div>

            <p className='text-black mb-4'>Unlock a world of possibilities with your new account!</p>

            <form onSubmit={submittobackend} method='POST' className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg mt-8">
            <div className="col-span-2 md:col-span-1">
              <div className="space-y-2 mt-6">
                <label htmlFor="fullName" className="block text-black">Full Name:</label>
                <input type="text" id="fullName" name="fullname" value={data.fullname} onChange={handleInputChange} className="input-style" />
              </div>
              </div>
              <div className="col-span-2 md:col-span-1">
              <div className="space-y-2 mt-6">
                <label htmlFor="email" className="block text-black">Email:</label>
                <input type="email" id="email" name="email" value={data.email} onChange={handleInputChange} className="input-style" />
              </div>
              </div>
              <div className="col-span-2 md:col-span-1">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-black">Password:</label>
                <div className="flex items-center">
                  <input type={passwords ? "password" : "text"} id="password" name='password' value={data.password} onChange={handleInputChange} className="input-style" />
                  <span className='eye ml-2' onClick={togglePasswordVisibility}>
                    {passwords ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                  </span>
                </div>
              </div>
              </div>
              <div className="col-span-2 md:col-span-1">
              <div className="space-y-2">
                <label htmlFor="password1" className="block text-black">Re-enter Password:</label>
                <div className="flex items-center">
                  <input type={passwordss ? 'password' : 'text'} id="password1" name='reenterpassword' value={data.reenterpassword} onChange={handleInputChange} className="input-style" />
                  <span className='eye ml-2' onClick={toggle}>
                    {passwordss ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                  </span>
                </div>
              </div>
              </div>
              <div className="col-span-2 md:col-span-1">
     
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
              </div>
              <div className="col-span-2 md:col-span-1">
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
              </div>
              <div className="col-span-2 md:col-span-1">
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
              </div>
              <div className="col-span-2 md:col-span-1">
              <div className="input">
                <label htmlFor="gender">Gender:</label>
                <select id="gender" name="gender" value={data.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="none">None</option>
                </select>
              </div>
              </div>
             

              {showPregnancyInput && (
                <div className="col-span-2 md:col-span-1">
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
  </div>
)}

<button type="submit" className="button col-span-2 hover:bg-red-700">Sign Up</button>
              <div className="text-center col-span-2 mt-4 md:mt-0">
  <p className="text-black">Already Have an account? <a href="/login" className="text-blue-500 underline">Login</a></p>
</div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;