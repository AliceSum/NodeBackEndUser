import Employee from "../model/Employee.js";

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
// console.log("db.data!123", db.data);
db.data ||= { users: [] };
const { users } = db.data;

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  console.log(req.email);
  console.log(req.roles);
  // const post = posts.find((p) => p.id === req.params.id)
  if (!employees) return res.status(204).json({ message: "No user found." });

  res.json({ email: req.email, roles: req.roles });
};
const createNewEmployee = async (req, res) => {
  console.log("starting");
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    console.log("we did it.");
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body._id}.` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();
  res.json(result);
};
const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Employee ID required." });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body._id}.` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};
const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Employee ID required." });
  }
  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}.` });
  }
  console.log("check id post");
  res.json(employee);
};
export {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
