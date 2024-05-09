const jwt = require('jsonwebtoken');
const users = require('../Schema/signupschema.js');
const bcrypt = require('bcryptjs');

const userregister = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Please enter all the input' });
  }

  try {
    const preuser = await users.findOne({ email: email });

    if (preuser) {
      return res.status(400).json({ error: 'This user already exists' });
    }

    const user = new users({
      fullname,
      email,
      password,
    });

    const storedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: storedUser._id, email: storedUser.email },
      process.env.JWT_SECRET, // Use the correct environment variable name
      {
        expiresIn: '3h',
      }
    );

    storedUser.token = token;
    storedUser.password = undefined;

    const option = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie('token', token, option).json(storedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default userregister;
