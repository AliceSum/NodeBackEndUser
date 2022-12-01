//const express = require("express");
// import { Low } from "lowdb";
// import { JSONFile } from "lowdb";
const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  console.log(req.body);
  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  const foundUser = usersDB.users.find((person) => person.email === email);
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          // roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const otherUsers = usersDB.users.filter(
      (person) => person.email !== foundUser.email
    );
    // Saving refreshToken with current user
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    //store this in http only to avoid storing it in javascript of cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // store this token in memory rather than local or javascript
    res.json({ accessToken });
  } else {
    console.log("unmatch");
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
