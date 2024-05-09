    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const User = require('../Schema/userschema.js');
    const axios = require('axios');
    const userController = {};
    let cachedMealData = null;
    let lastFetchedTimestamp = null;
    const userMealDataCache = {};

    userController.login = async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            age: user.age,
            height: user.height,
            weight: user.weight,
            gender: user.gender,
       
          },
          process.env.JWT_SECRET,
          { expiresIn: '3h' }
        );

        // Fetch meal plan data on login
        const mealData = await generateRandomMealData();

        return res.status(200).json({ token, mealData });
      } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    userController.signup = async (req, res) => {
      const { fullname, email, password, age, height, weight, gender, pregnancy } = req.body;
console.log(fullname)
      try {
        const preuser = await User.findOne({ email });

        if (preuser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          fullname,
          email,
          password: hashedPassword,
          age,
          height,
          weight,
          gender,
          pregnancy
        });

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            age: user.age,
            height: user.height,
            weight: user.weight,
            gender: user.gender,
            pregnancy: user.pregnancy
           
          },
          process.env.JWT_SECRET,
          { expiresIn: '3h' }
        );

        await user.save();

        return res.status(201).json({ token, message: 'User created successfully' });
      } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    const generateRandomMealData = async () => {
      try {
        const response = await axios.get('https://api.spoonacular.com/mealplanner/generate?timeFrame=day&apiKey=650d2b08145c40a681f93d5729334591');
        if (!response.data) {
          throw new Error('Failed to fetch meal data');
        }
        return response.data;
      } catch (error) {
        console.error('Error generating random meal data:', error);
        throw error;
      }
    };

    userController.getMealPlan = async (req, res) => {
      try {
        const currentTime = new Date().getTime();
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        if (
          userMealDataCache[decoded.email] &&
          userMealDataCache[decoded.email].data &&
          userMealDataCache[decoded.email].timestamp &&
          currentTime - userMealDataCache[decoded.email].timestamp < 24 * 60 * 60 * 1000
        ) {
          return res.status(200).json(userMealDataCache[decoded.email].data);
        }

        // Fetch user data based on decoded token
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Generate random meal data for the user
        const mealData = await generateRandomMealData();

        // Cache the fetched meal data and timestamp per user
        userMealDataCache[decoded.email] = {
          data: mealData,
          timestamp: currentTime,
        };

        return res.status(200).json(mealData);
      } catch (err) {
        console.error('Error getting meal plan data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    userController.getDashboardData = async (req, res) => {
      try {
        if (req.headers.authorization && typeof req.headers.authorization === 'string') {
          const token = req.headers.authorization.split(' ')[1];

          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          return res.status(200).json(decoded);
        } else {
          throw new Error('Authorization header is missing or invalid');
        }
      } catch (err) {
        console.error('Error getting dashboard data:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    // userController.getImage = async (req, res) => {
    //   try {
    //     if (req.headers.authorization && typeof req.headers.authorization === 'string') {
    //       const token = req.headers.authorization.split(' ')[1];
    //       const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //       const user = await User.findOne({ email: decoded.email });

    //       if (user) {
    //         if (user.image) {
    //           return res.status(200).json({ imageData: user.image });
    //         } else {
    //           return res.status(404).json({ error: 'Image not found for the user' });
    //         }
    //       } else {
    //         return res.status(404).json({ error: 'User not found' });
    //       }
    //     } else {
    //       throw new Error('Authorization header is missing or invalid');
    //     }
    //   } catch (err) {
    //     console.error('Error getting image data:', err);
    //     return res.status(500).json({ error: 'Internal Server Error' });
    //   }
    // };

    userController.getWorkoutPlan = async (req, res) => {
      try {
        const { muscle } = req.query;


        const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises/bodyPart/' + muscle,
          params: { limit: '10' },
          headers: {
            'X-RapidAPI-Key': '66d7629d69mshc0a9f88ee2b028cp1c2fdajsn2d27fefab8ff',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Error fetching workout plan:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };

    userController.getNutrientSuggestions = async (req, res) => {
      try {
        if (req.headers.authorization && typeof req.headers.authorization === 'string') {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Fetch user based on decoded token
          const user = await User.findOne({ email: decoded.email });

          if (!user) {
            
            return res.status(404).json({ error: 'User not found' });
          }

          // Make API request to fetch nutrient suggestions
          const options = {
            method: 'GET',
            url: 'https://nutrition-calculator.p.rapidapi.com/api/nutrition-info',
            params: {
              measurement_units: 'met',
              sex: user.gender === 'male' ? 'male' : 'female',
              age_value: user.age,
              age_type: 'yrs',
              cm: user.height,
              kilos: user.weight,
              'pregnancy-lactating': user.pregnancy,
              activity_level: 'Active'
            },
            headers: {
              'X-RapidAPI-Key': '66d7629d69mshc0a9f88ee2b028cp1c2fdajsn2d27fefab8ff',
              'X-RapidAPI-Host': 'nutrition-calculator.p.rapidapi.com'
            }
          };

          const response = await axios.request(options);

          if (!response.data) {
            throw new Error('Failed to fetch nutrient suggestions');
          }

          return res.status(200).json(response.data);
        } else {
          throw new Error('Authorization header is missing or invalid');
        }
      } catch (error) {
        console.error('Error getting nutrient suggestions:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };


    // Update user data partially using PATCH method
    // Update user data using POST method
    // Update user data using POST method
    userController.updateUser = async (req, res) => {
      try {
        // Extract user data from the request body
        const {  email, age, height, weight, gender, pregnancy, password } = req.body;
    
        // Inside updateUser controller function
        console.log(req.body);
    
        // Find the user in the database by email
        const user = await User.findOne({ email });
    
        // If user not found, return an error response
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Update the user data
   
        user.age = age || user.age;
        user.height = height || user.height;
        user.weight = weight || user.weight;
        user.gender = gender || user.gender;
        user.pregnancy = pregnancy || user.pregnancy;
    
        // Encrypt the password if it's provided in the request body
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
    
        // Save the updated user data to the database
        await user.save();
    
        // Respond with a success message
        return res.status(200).json({ message: 'User data updated successfully', user });
      } catch (error) {
        console.error('Error updating user data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };







    module.exports = userController;
