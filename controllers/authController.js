import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// File path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "model", "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();

db.data ||= { users: [] };
const { users } = db.data;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd)
    return res
      .status(400)
      .json({ message: "email and password are required." });
  const foundUser = users.find((p) => p.email === req.body.email);

  if (!foundUser) {
    return res.sendStatus(401);
  }
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // const roles = Object.values(foundUser.roles);
    // create JWTs

    //Authorized users can check their account balanc
    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "360s" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //we may not need to store the refresh token here.
    foundUser.refreshToken = refreshToken;
    //store this in http only to avoid storing it in javascript of cookie

    await db.write();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",

      maxAge: 24 * 60 * 60 * 1000,
    });
    //secure: true,
    // store this token in memory rather than local or javascript

    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};
export default handleLogin;
