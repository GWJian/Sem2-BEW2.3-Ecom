const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Helper function to validate email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//==========REGISTER===========

router.post("/register", async (req, res) => {
  try {
    const { email, name, username, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    let userFound = await User.findOne({ username });
    let userFoundByEmail = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({ msg: "User already exists" });
    }

    if (userFoundByEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    if (name.length < 3) {
      return res
        .status(400)
        .json({ msg: "Name should be atleast 3 characters" });
    }

    if (email.length < 5) {
      return res
        .status(400)
        .json({ msg: "email should be atleast 5 characters" });
    }

    if (username.length < 8) {
      return res
        .status(400)
        .json({ msg: "Username should be atleast 3 characters" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Password should be atleast 3 characters" });
    }

    let user = new User(req.body);
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.save();
    return res.json({ user, msg: "Registered successfully" });
  } catch (e) {
    return res.status(400).json({ e, msg: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    let userFound = await User.findOne({ username });

    if (!userFound) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }

    let isMatch = bcrypt.compareSync(password, userFound.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    jwt.sign(
      { data: userFound },
      process.env.SECRET_KEY,
      { expiresIn: "720h" },
      (err, token) => {
        if (err) res.status(400).json({ err, msg: "Unable to login" });
        return res.send(token);
      }
    );
  } catch (e) {
    return res.status(400).json({ e, msg: "Invalid Credentials" });
  }
});

module.exports = router;
