const User = require("../model/User.model");
const bcrypt = require("bcrypt");

async function handleSignUp(req, res) {
  const body = req.body;

  // 1. Basic validation
  if (
    !body?.firstName ||
    !body?.lastName ||
    !body?.email ||
    !body?.userName ||
    !body?.password ||
    !body?.confirmPassword
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (body.password !== body.confirmPassword) {
    return res.status(400).json({ msg: "Passwords should match" });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const existingUserName = await User.findOne({ userName: body.userName });
    if (existingUserName) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 4. Create the user
    const newUser = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      userName: body.userName, // ✅ Added this
      email: body.email,
      password: hashedPassword,
      timeOfCreation: new Date(),
    });

    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}

module.exports = {
  handleSignUp,
};
