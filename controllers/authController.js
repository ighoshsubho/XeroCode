const jwt = require('jsonwebtoken');
const redis = require('redis');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const keys = require('../config/keys');
const passport = require('passport');

const selectType = async (req, res) => {
  const { user1, userType } = req.body;
  try{
    const existingUser = await User.findOne({ _id: user1 });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    existingUser.userType = userType;
    await existingUser.save();
    return res.status(200).json({ message: 'User type saved successfully' });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

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

    const client = redis.createClient({ url: keys.redisURL });
    await client.connect();

    const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
    let user1 = user._id.toString()
    client.set(user1, token, 'EX', 3600);

    return res.status(200).json({ token, user1 });
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

        const client = redis.createClient({ url: keys.redisURL });
        await client.connect();
        
        const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
        let user1 = user._id.toString()
        client.set(user1, token, 'EX', 3600);
    
        return res.status(200).json({ token, user1 });
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

      const client = redis.createClient({ url: keys.redisURL });
      await client.connect();
      
      const token = jwt.sign({ userId: user._id }, keys.jwtSecret, { expiresIn: '1h' });
      let user1 = user._id.toString()
      client.set(user1, token, 'EX', 3600);
  
      return res.status(200).json({ token, user1 });
    })(req, res);
  };

const validateToken = async (req, res) => {

    const { user1, token } = req.body;
    const client = redis.createClient({ url: keys.redisURL });
  
    try {
      await client.connect();
  
      // Retrieve the stored token for the user from Redis
      const storedToken = await client.get(user1.toString());
  
      if (storedToken === token) {
        // Token is valid
        return res.status(200).json({ message: 'Token is valid' });
      } else {
        // Token is not valid
        return res.status(401).json({ message: 'Token is not valid' });
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    } finally {
      client.quit(); // Close the Redis client
    }
  };

module.exports = {
  signup,
  signin,
  googleAuthCallback,
  githubAuthCallback,
  validateToken,
  selectType,
};
