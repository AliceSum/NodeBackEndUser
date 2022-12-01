const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};
const createNewEmployee = (req, res) => {
  console.log("req.body:");
  console.log(req.body);

  //creating new employee at post auth route
  const newEmployee = {
    _id: data.employees[data.employees.length - 1]._id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required." });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  console.log(req.body);
  const employee = data.employees.find(
    // (emp) => emp._id === parseInt(req.body._id)
    (emp) => emp._id === req.body._id
  );
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee _id ${req.body._id} not found` });
  }
  if (req.body.firstname) employee.firstname = req.body.firstname;
  if (req.body.lastname) employee.lastname = req.body.lastname;
  const filteredArray = data.employees.filter(
    // (emp) => emp._id !== parseInt(req.body._id)
    (emp) => emp._id !== req.body._id
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a._id > b._id ? 1 : a._id < b._id ? -1 : 0))
  );
  res.json(data.employees);
};
const deleteEmployee = (req, res) => {
  const employee = data.employees.find(
    // (emp) => emp._id === parseInt(req.body._id)
    (emp) => emp._id === req.body._id
  );
  console.log(data.employees);
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee _id ${req.body._id} not found` });
  }
  const filteredArray = data.employees.filter(
    // (emp) => emp._id != parseInt(req.body._id)
    (emp) => emp._id != req.body._id
  );
  data.setEmployees([...filteredArray]);
  res.json(data.employees);
};
const getEmployee = (req, res) => {
  const employee = data.employees.find((emp) => emp._id === req.params.id);
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee _id ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
