import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { v1 as uuidv1 } from "uuid";
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
  const {
    age,
    eyeColor,
    first,
    last,
    pic_link,
    company,
    email,
    pwd,
    phone,
    address,
    balance,
  } = req.body;
  if (
    !age ||
    !eyeColor ||
    !first ||
    !last ||
    !pic_link ||
    !company ||
    !email ||
    !pwd ||
    !phone ||
    !address ||
    !balance
  )
    return res.status(400).json({
      message:
        "The following are required: Age, eye color, first name, last name, picture link, company, email, password, phone number, address, Balance",
    });
  //case doesn't mater to email, so we need to check it
  const duplicate = users.find((u) => u.email === email.toLowerCase());

  if (duplicate) return res.sendStatus(409); //Conflict
  try {
    // bcrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user data

    const first_id = uuidv1();
    const second_id = uuidv4();
    users.push({
      _id: first_id,
      guid: second_id,
      isActive: true, //new user means active
      balance: balance,
      picture: pic_link,
      age: age,
      eyeColor: eyeColor,
      name: { first: first, last: last },
      company: company,
      email: email,
      password: hashedPwd,
      phone: phone,
      address: address,
      //I don't allow the front end to control the role because it is not secuity.
      //Without Authorized: 5001, it will be unauthorized.
      roles: {
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
