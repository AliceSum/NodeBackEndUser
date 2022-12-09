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

const getInfo = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "user id required." });
  }

  const foundUser = users.find((p) => p._id === req.params.id);
  if (!foundUser) {
    return res
      .status(204)
      .json({ message: `No user matches id ${req.params.id}.` });
  }

  //Authorized number is 5001,
  res.json({
    email: foundUser.email,
    roles: foundUser.roles,
    name: foundUser.name,
    balance:
      foundUser.roles.Authorized === 5001
        ? foundUser.balance
        : "not authorized",
    age: foundUser.age,
    phone: foundUser.phone,
    company: foundUser.company,
    address: foundUser.address,
    eyeColor: foundUser.eyeColor,
  });
};
const updateInfo = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "user id required." });
  }

  const foundUser = users.find((p) => p._id === req.body.id);
  if (!foundUser) {
    return res
      .status(204)
      .json({ message: `No user matches id ${req.params.id}.` });
  }
  if (req.body?.firstname) foundUser.name.first = req.body.firstname;
  if (req.body?.lastname) foundUser.name.last = req.body.lastname;
  if (req.body?.age) foundUser.age = req.body.age;
  if (req.body?.phone) foundUser.phone = req.body.phone;
  if (req.body?.company) foundUser.company = req.body.company;
  if (req.body?.address) foundUser.address = req.body.address;
  if (req.body?.eyecolor) foundUser.eyecolor = req.body.eyecolor;
  await db.write();
  res.json({
    message: "Respond from server. User Information is changed",
  });
};
export { getInfo, updateInfo };
