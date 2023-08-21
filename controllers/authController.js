const jwt = require('jsonwebtoken');
const redis = require('redis');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const keys = require('../config/keys');

const client = redis.createClient({ url: keys.redisURL });

const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
    client.set(user._id.toString(), 3600, token);

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const googleAuthCallback = async (req, res) => {
    passport.authenticate('google', { failureRedirect: '/signin' }, async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (!user) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
        
        const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
        client.setex(user._id.toString(), 3600, token);
    
        return res.status(200).json({ token });
      })(req, res);
};

const githubAuthCallback = async (req, res) => {
    passport.authenticate('github', { failureRedirect: '/signin' }, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      
      const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
      client.setex(user._id.toString(), 3600, token);
  
      return res.status(200).json({ token });
    })(req, res);
  };

module.exports = {
  signup,
  signin,
  googleAuthCallback,
  githubAuthCallback,
};
