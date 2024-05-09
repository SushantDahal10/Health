const jwt = require('jsonwebtoken');
const users = require('./Schema/userschema.js');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const logincontroller = express();
logincontroller.use(cookieParser());

const loginuser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password' });
  }

  try {
    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET, // Use the correct environment variable name
        {
          expiresIn: '3h',
        }
      );

      user.token = token;
      user.password = undefined;

      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res
        .status(200)
        .cookie('token', token, option)
        .json({
          success: true,
          token,
        });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default loginuser;
