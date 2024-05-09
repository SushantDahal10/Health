import React, { useState, useEffect } from 'react';
import { FaHome } from "react-icons/fa";
import { MdFoodBank } from "react-icons/md";
import { IoIosFitness } from "react-icons/io";
import { IoFitness } from "react-icons/io";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from "react-icons/fa";
import { GiHotMeal } from "react-icons/gi";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from '../Images/logo.jpg';
import {  useLocation } from 'react-router-dom';
export default function Home() {
  const [userData, setUserData] = useState(null);
  const [nutrientData, setNutrientData] = useState(null);
  const [bmi, setBMI] = useState(null);
  const history = useNavigate();
  const [activePage, setActivePage] = useState('home');

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

        const bmi = (data.weight / ((data.height / 100) * (data.height / 100))).toFixed(2);
        setBMI(bmi);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNutrientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://health-hi33.onrender.com/api/user/nutrient', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch nutrient data');
        }

        const data = await response.json();
        setNutrientData(data);
      } catch (error) {
        console.error('Error fetching nutrient data:', error);
      }
    };

    fetchNutrientData();
  }, [userData]);

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
  

  if (!userData || !nutrientData) {
    return <div className='text-black font-2xl'>Loading...</div>;
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
          <p className='toptext text-base font-bold mt-10'>Your BMI is: {bmi}</p>
          <button onClick={handleLogout} className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-gray-200">
            <PiSignOutBold className="inline" />
            <span className="ml-2">Sign Out</span>
          </button>
        </header>

        <div className="px-8 py-8"> {/* Adjusted padding */}
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 ">
            {nutrientData && (
              <div className="bg-white rounded-lg shadow-md p-4 col-span-4 lg:col-span-2"> {/* Adjusted column span */}
                <div className="flex items-center mb-4">
                  <IoIosFitness className="text-2xl text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold">Nutrition</h3>
                </div>
                <p>Estimated Daily Caloric Needs: {nutrientData.BMI_EER["Estimated Daily Caloric Needs"]}</p>
                <table className="mt-4">
                  <tbody>
                    {nutrientData.macronutrients_table["macronutrients-table"].map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item[0]}</td>
                        <td className="py-2">{item[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
