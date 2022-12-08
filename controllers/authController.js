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
    // create JWTs

    //Authorized users can check their account balanc
    //A trick to filter the boolean
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const id = foundUser._id;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles: roles,
          id: id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //store the refresh token.
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

    res.json({ id, roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};
export default handleLogin;
