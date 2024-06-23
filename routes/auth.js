const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

var ObjectId = require("mongodb").ObjectId;

const users = require("../models/Users");
const verifyToken = require("../middleware/authMiddle");

router.get("/", (req, res) => res.send("USER ROUTE"));

router.post("/register", async (req, res) => {
  const { email, password, firstname, lastname, address } = req.body;

  //Simple validation

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  }

  try {
    const user = await users.findOne({ email: email });

    if (user) {
      return res.status(400).json({ success: false, message: "Email taken" });
    }

    //All good

    const hashedPassword = await argon2.hash(password);
    const newUser = new users({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      address,
    });
    await newUser.save();

    //Return token
    const tokens = generateTokens({ userId: newUser._id });

    let updateRefreshToken = {
      $set: {
        refreshToken: tokens.refreshToken,
      },
    };

    const refreshTokenUpdateCondition = { _id: newUser._id };

    const result = await users.updateOne(
      refreshTokenUpdateCondition,
      updateRefreshToken
    );

    return res.json({
      success: true,
      message: "User created successfully",
      tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username and/or password" });
  }

  try {
    //Check for existing user
    const user = await users.findOne({ email : email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username/password" });
    }
    //Username found
    // console.log(user);
    const passwordValid = await argon2.verify(user.password, password);

    if (!passwordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect username/password" });
    }

    //All good
    const tokens = generateTokens({ userId: user._id });

    let updateRefreshToken = {
      $set :{
        refreshToken: tokens.refreshToken,
      },
    };

    const refreshTokenUpdateCondition = { _id: user._id };

    const result = await users.updateOne(
        refreshTokenUpdateCondition,
        updateRefreshToken
    );
  
    return res.json({
        success: true,
        message: "User login successfully",
        tokens,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
});

router.post('/token', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if(!refreshToken){
    return res.sendStatus(401);
  }

  const user = await users.findOne({refreshToken : refreshToken});
  if(!user) return res.sendStatus(403);

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const tokens = generateTokens({ userId: user._id });

    let updateRefreshToken = {
      $set :{
        refreshToken: tokens.refreshToken,
      },
    };

    const refreshTokenUpdateCondition = { _id: user._id };

    const result = await users.updateOne(
        refreshTokenUpdateCondition,
        updateRefreshToken
    );
  
    return res.json({
        success: true,
        message: "Token updated successfully",
        tokens,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
})


router.delete('/logout', verifyToken, async (req, res) => {
  const user = await users.findOne({_id : req.userId});

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "cant logout" });
  }

  try {
    let updateRefreshToken = {
      $set :{
        refreshToken: null,
      },
    };

    const refreshTokenUpdateCondition = { _id: user._id };

    const result = await users.updateOne(
        refreshTokenUpdateCondition,
        updateRefreshToken
    );
  
    return res.json({
        success: true,
        message: "Log out successfully",
      
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internel server error" });
  }
})

const generateTokens = (payload) => {
  //create jwt
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });

  return { accessToken, refreshToken };
};

module.exports = router;
