const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // ✅ Missing import

const User = require('../model/User.model');

async function handleLogin(req, res) {
  const { email, password } = req.body;
  console.log(email)
  console.log("start")

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    // ✅ Save current user info
    const currentUser = {
      userName: user.userName,
      email: user.email,
    };

    const filePath = path.join(__dirname, '..', 'currentUser.json');

    fs.writeFile(filePath, JSON.stringify(currentUser), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ msg: 'Internal server error' });
      }

      return res.status(200).json({
        msg: 'Login successful',
        userName: user.userName,
      });
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

module.exports = {
  handleLogin,
};
