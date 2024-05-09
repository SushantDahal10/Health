import React, { useState, useEffect } from 'react';
import { FaHome } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { IoIosFitness } from "react-icons/io";
import { IoFitness } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { GiHotMeal } from "react-icons/gi";
import logo from '../Images/logo.jpg';
import axios from 'axios';
import Location from './location';
import { useLocation } from 'react-router-dom';
export default function Fitness() {
  const [userData, setUserData] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null); 
  const history = useNavigate();
  const [activePage, setActivePage] = useState('fitness');
  const [muscle, setMuscle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://health-hi33.onrender.com/api/user/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      if (!muscle) {
        setError('Please fill in all fields');
        return;
      }

      setError('');

      const response = await axios.get('https://health-hi33.onrender.com/api/user/workoutplan', {
        params: {
          muscle,
        }
      });

      setWorkoutPlan(response.data);

    } catch (error) {
      console.error('Error fetching workout plan:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history('/login');
  };
  const location = useLocation();
  useEffect(() => {
    setActivePage(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const navigateTo = (path, page) => {
    history(path);
    // Remove setActivePage(page) from here
  };
  

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 h-screen font-sans">
      {/* Sidebar */}
      <div className="md:col-span-1 bg-gray-400 text-white">
        <div className="py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 mt-10">
            <img src={logo} alt="Logo" className="h-10" />
            <h1 className="text-lg font-semibold">Health - Fitness</h1>
          </div>
        </div>
        <nav className="mt-6 md:hidden"> {/* Dropdown for smaller devices */}
          <select
            value={activePage}
            onChange={(e) => navigateTo(`/dashboard/${e.target.value}`, e.target.value)}
            className="block w-full py-2 px-4 rounded transition duration-300 bg-gray-800 text-gray-200"
          >
            <option value="home">Home</option>
            <option value="diet">Meal Planner</option>
            <option value="fitness">Fitness</option>
            <option value="health">Update Info</option>
          </select>
        </nav>
        <nav className="mt-6 hidden md:block"> 
          <a onClick={() => navigateTo('/dashboard/home', 'home')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'home' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <FaHome className="inline" />
            <span className="ml-2 text-base">Home</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/diet', 'diet')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'diet' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <GiHotMeal className="inline" />
            <span className="ml-2 text-base">Meal Planner</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/fitness', 'fitness')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'fitness' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <IoIosFitness className="inline" />
            <span className="ml-2 text-base">Fitness</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/health', 'update')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'update' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <IoFitness className="inline" />
            <span className="ml-2 text-base">Update Info</span>
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="md:col-span-4 bg-gray-100">
        <header className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
          <div className="app-header-actions">
            <button className="user-profile mt-5">
              <span className="hidden md:block">{userData.fullname}</span>
              
            </button>
          </div>
        
          <button onClick={handleLogout} className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-gray-200">
            <PiSignOutBold className="inline" />
            <span className="ml-2">Sign Out</span>
          </button>
        </header>

        <div className="px-8 py-6">
            <div className="flex flex-col md:flex-row items-center mb-4">
              <label htmlFor="muscle" className="mr-2">Muscle:</label>
              <select id="muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)} className="px-2 py-1 border rounded-md">
                <option value="">Select Muscle</option>
                <option value="shoulders">Shoulders</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="lower legs">Lower Legs</option>
                <option value="cardio">Cardio</option>
                <option value="neck">Neck</option>
                <option value="upper arms">Upper Arms</option>
                <option value="lower arms">Lower Arms</option>
                <option value="waist">Waist</option>
                <option value="upper legs">Upper Legs</option>
              </select>
              <button onClick={fetchWorkoutPlan} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Fetch Exercises</button>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {workoutPlan && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Workout Plan for {muscle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutPlan.map((exercise, index) => (
                    <div key={index} className="p-2 bg-white shadow rounded-md">
                      <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                      <p className="mb-2 text-sm"><strong>Equipment:</strong> {exercise.equipment}</p>
                      <div className="h-58 overflow-hidden mb-2">
                        <img src={exercise.gifUrl} alt={exercise.name} className="w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold mt-2 text-sm">Instructions:</h4>
                        <ul className="list-disc list-inside text-sm">
                          {exercise.instructions.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className='text-2xl font-bold'>Nearby Gym:</p>
          <div>
          <Location>
 
</Location>
</div>
        <footer className="bg-gray-800 text-white py-4 px-6 col-span-12 flex justify-between items-center">
          <div className="flex flex-col">
            <h1>Health-Fitness<small>©</small></h1>
            <div>
              Health-Fitness ©<br />
              All Rights Reserved 2024
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-white text-2xl hover:text-blue-500 cursor-pointer" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-white text-2xl hover:text-blue-500 cursor-pointer" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-white text-2xl hover:text-blue-500 cursor-pointer" />
            </a>
          </div>
        </footer>
   
      </div>
   
    </div>
    
  );
}
