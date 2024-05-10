import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [passwords, setPasswords] = useState(true);
  const [passwordss, setPasswordss] = useState(true);
  const [showPregnancyInput, setShowPregnancyInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    fullname: "",
    email: "",
    password: "",
    reenterpassword: "",
    age: "",
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

    // Check for empty fields
    const requiredFields = ["fullname", "email", "password", "reenterpassword", "age", "height", "weight", "gender"];
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!data[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (data.password !== data.reenterpassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const fetchdata = await fetch('https://health-hi33.onrender.com/api/user/signup', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ ...data }),
      });

      if (fetchdata.ok) {
        const responseData = await fetchdata.json();
        localStorage.setItem('token', responseData.token);
        history('/login');
        setTimeout(() => {
          alert('Successful');
        }, 100);
      } else {
        alert('Fill all the details');
      }
    } catch (error) {
      console.error(error);
      alert('Successful');
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

    // Clear error message when user starts typing in a field
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
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
                  {errors.fullname && <p className="text-red-500">{errors.fullname}</p>}
                </div>
              </div>
              {/* Add similar error display for other fields */}
              {/* ... */}
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
