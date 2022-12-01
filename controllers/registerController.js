import User from "../model/User.js";
import bcrypt from "bcrypt";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "model", "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
await db.read();
// db.data ||= { posts: [] };

db.data ||= { users: [] };
const { users } = db.data;

const handleNewUser = async (req, res) => {
  const { age, eyeColor, first, last, company, email, pwd, phone, address } =
    req.body;
  console.log("Yes?");
  console.log(users);
  if (
    !age ||
    !eyeColor ||
    !first ||
    !last ||
    !company ||
    !email ||
    !pwd ||
    !phone ||
    !address
  )
    return res.status(400).json({
      message:
        "The following are required: Age, eye color, first name, last name, company, email, password, phone number, address",
    });

  const duplicate = users.find((u) => u.email === email);

  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    // bcrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user data
    console.log("console.log(users)");
    console.log(users);
    users.push({
      _id: "5410953eb0e0c0ae25608277",
      guid: "eab0324c-75ef-49a1-9c49-be2d68f50b96",
      isActive: true,
      balance: "$1,999.00",
      picture: "http://placehold.it/32x32",
      age: age,
      eyeColor: eyeColor,
      name: { first: first, last: last },
      company: company,
      email: email,
      salt: "23derd*334",
      password: hashedPwd,
      phone: phone,
      address: address,
      roles: {
        Authorized: 5001, //default should not include this.
        User: 3005,
      },
    });

    await db.write();

    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
export default handleNewUser;
