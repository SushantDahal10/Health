import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { FaHome, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdOutlineFitnessCenter } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { GiHotMeal } from "react-icons/gi";
import axios from 'axios';
import logo from '../Images/logo.jpg';
import { Chart, ArcElement } from 'chart.js';
import { useNavigate, useLocation } from 'react-router-dom';

Chart.register(ArcElement);

export default function Dietplan() {
  const [userData, setUserData] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [nutritionData, setNutritionData] = useState({
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  });

  const history = useNavigate();
  const location = useLocation();

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
    fetchMealPlan();
  },);

  const fetchMealPlan = async () => {
    try {
      const cachedMealPlan = localStorage.getItem('mealPlan');
      if (cachedMealPlan) {
        setMealData(JSON.parse(cachedMealPlan));
      } else {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://health-hi33.onrender.com/api/user/mealplan', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.data) {
          throw new Error('Failed to fetch meal plan data');
        }

        const mealPlanData = response.data;
        localStorage.setItem('mealPlan', JSON.stringify(mealPlanData));
        cacheMealDetails(mealPlanData);
        setMealData(mealPlanData);
      }
    } catch (error) {
      console.error('Error fetching meal plan data:', error);
    }
  };

  const cacheMealDetails = (mealPlanData) => {
    mealPlanData.meals.forEach((meal) => {
      const cachedMealImage = localStorage.getItem(`mealImage_${meal.id}`);
      if (!cachedMealImage || JSON.parse(cachedMealImage).expiry < Date.now()) {
        fetchMealImage(meal.id, meal.imageType);
      }
    });
  };

  const fetchMealImage = async (mealId, imageType) => {
    try {
      const response = await axios.get(`https://spoonacular.com/recipeImages/${mealId}-556x370.${imageType}`);

      if (!response.data) {
        throw new Error('Failed to fetch meal image');
      }

      const mealImageData = {
        url: response.data.url,
        expiry: Date.now() + 24 * 60 * 60 * 1000
      };

      localStorage.setItem(`mealImage_${mealId}`, JSON.stringify(mealImageData));
    } catch (error) {
      console.error('Error fetching meal image:', error);
    }
  };

  const markMealAsEaten = (index, nutrients) => {
    if (mealData && index >= 0 && index < mealData.meals.length) {
      const updatedMeals = [...mealData.meals];
      updatedMeals[index].eaten = true;
      setMealData({ ...mealData, meals: updatedMeals });

      const updatedNutrients = {
        protein: nutrients.protein || 0,
        carbohydrates: nutrients.carbohydrates || 0,
        fat: nutrients.fat || 0
      };

      const newNutritionData = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [{
          data: [
            nutritionData.datasets[0].data[0] + updatedNutrients.protein,
            nutritionData.datasets[0].data[1] + updatedNutrients.carbohydrates,
            nutritionData.datasets[0].data[2] + updatedNutrients.fat
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      };

      setNutritionData(newNutritionData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history('/login');
  };

  useEffect(() => {
    setActivePage(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const navigateTo = (path, page) => {
    history(path);
  };

  if (!userData || !mealData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-12 h-screen font-sans">
      <div className="sidebar col-span-12 md:col-span-2 bg-gray-400 text-white">
        <div className="py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4 mt-10">
            <img src={logo} alt="Logo" className="h-10" />
            <h1 className="text-lg font-semibold">Health - Fitness</h1>
          </div>
        </div>
        <nav className="mt-6 md:hidden">
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
            <MdOutlineFitnessCenter className="inline" />
            <span className="ml-2 text-base">Fitness</span>
          </a>
          <a onClick={() => navigateTo('/dashboard/health', 'update')}
            className={`block py-2 px-4 rounded transition duration-300 ${activePage === 'update' ? 'bg-gray-800 text-gray-200' : 'hover:bg-gray-800 hover:text-gray-200'}`}>
            <MdOutlineFitnessCenter className="inline" />
            <span className="ml-2 text-base">Update Info</span>
          </a>
        </nav>
      </div>
      <div className="md:col-span-10 bg-gray-100">
        <header className=" py-4 px-6  flex justify-between items-center">
          <div className="app-header-actions flex  flex justify-between ">
          </div>
          <button onClick={handleLogout} className="block py-2 px-4 rounded transition duration-300 hover:bg-gray-800 hover:text-gray-200">
            <PiSignOutBold className="inline" />
            <span className="ml-2 md:w-10">Sign Out</span>
          </button>
        </header>
        <div className="main col-span-12 md:col-span-16 bg-gray-100 mt-10 sm:col-span-12 lg:col-span-20 xl:col-span-24">
          <div className="grid grid-cols-12 gap-4 mt-4">
            {mealData.meals.map((meal, index) => {
              const zData = JSON.parse(localStorage.getItem('zValues')) || {};
              const mealType = meal.type || 'default';

              if (!zData[mealType] || zData[mealType].expiry < Date.now()) {
                zData[mealType] = { z: Math.floor(Math.random() * 10) + 1, expiry: Date.now() + 24 * 60 * 60 * 1000 };
                localStorage.setItem('zValues', JSON.stringify(zData));
              }

              const z = zData[mealType].z;

              const dividedCalories = (mealData.nutrients.calories / z).toFixed(2);
              const dividedFat = (mealData.nutrients.fat / z).toFixed(2);
              const dividedProtein = (mealData.nutrients.protein / z).toFixed(2);
              const dividedCarbohydrates = (mealData.nutrients.carbohydrates / z).toFixed(2);

              return (
                <div key={index} className="col-span-12 sm:col-span-6 md:col-span-4 bg-gray-100 p-4 flex flex-col justify-between">
                  <div className="flex justify-center">
                    <div className="w-64 h-40 overflow-hidden">
                      {meal.imageType && (
                        <img src={`https://spoonacular.com/recipeImages/${meal.id}-556x370.${meal.imageType}`} alt={meal.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <dl className="space-y-2">
                      <div><dt className="font-semibold">Meal Name:</dt> {meal.title}</div>
                      <div><dt className="font-semibold">Ready in Minutes:</dt> {meal.readyInMinutes}</div>
                      <div><dt className="font-semibold">Calories:</dt> {dividedCalories}</div>
                      <div><dt className="font-semibold">Protein:</dt><span style={{ color: 'red', fontSize: '16px' }}>{dividedProtein}g</span></div>
                      <div><dt className="font-semibold">Carbs:</dt><span style={{ color: 'blue', fontSize: '16px' }}> {dividedCarbohydrates}g</span></div>
                      <div><dt className="font-semibold">Fat:</dt><span style={{ color: '#DD761C', fontSize: '16px' }}> {dividedFat}g</span></div>
                      <div><a href={meal.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>View Recipe</a></div>
                    </dl>
                  </div>
                  <div className="mt-4">
                    {meal.eaten ? (
                      <span style={{ fontSize: "larger", color: "#0A6847", fontWeight: "bold" }}>Eaten</span>
                    ) : (
                      <button onClick={() => markMealAsEaten(index, mealData.nutrients)} className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">Mark as Eaten</button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="col-span-12 sm:col-span-6 md:col-span-4">
              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <div>
                  <div>
                    <div>
                      <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}>Nutrient Information:</div>
                      <div className="mx-auto" style={{ maxWidth: '300px' }}>
                        <Pie
                          data={nutritionData}
                          options={{
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  render: function (args) {
                                    const { index, dataset } = args;
                                    const label = dataset.labels[index];
                                    const value = dataset.data[index];
                                    return `${label}: ${value}g`;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="bg-gray-800 w-fulltext-white py-4 px-6 col-span-12 md:col-span-full flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row md:items-center md:flex-grow text-white">
              <h1 className="text-center md:text-left">Health-Fitness<small>©</small></h1>
              <div className="text-center md:text-left">
                Health-Fitness ©<br />
                All Rights Reserved 2024
              </div>
            </div>
            <div className="flex justify-center md:justify-end mt-4 md:mt-0 space-x-4">
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
    </div>
  );
}
