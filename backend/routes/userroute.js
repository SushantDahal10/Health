const express = require('express');
const userController = require('../controller/usercontroller.js');

const router = express.Router();

router.post('/login', userController.login);
router.post('/signup', userController.signup); 
router.get('/dashboard', userController.getDashboardData); 

router.get('/mealplan', userController.getMealPlan);
router.get('/workoutplan', userController.getWorkoutPlan);
router.get('/nutrient', userController.getNutrientSuggestions);
router.patch('/update', userController.updateUser);
console.log('PATCH route for updating user data registered successfully');


module.exports = router;
