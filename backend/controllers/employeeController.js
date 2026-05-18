const Employee = require("../models/Employee");

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res, next) => {
  console.log("📥 Add employee hit:", req.body); // ADD THIS LINE
  const { name, email, department, skills, performanceScore, experience } = req.body;

  try {
    if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    if (performanceScore < 0 || performanceScore > 100) {
      res.status(400);
      throw new Error("Performance score must be between 0 and 100");
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      res.status(400);
      throw new Error("Employee with this email already exists");
    }

    const employee = await Employee.create({
      name, email, department, skills, performanceScore, experience,
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Search employees by department, name or skill
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res, next) => {
  const { department, name, skill, minScore, maxScore } = req.query;

  try {
    const query = {};

    if (department) {
      query.department = { $regex: department, $options: "i" };
    }

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, "i")] };
    }

    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    if (req.body.performanceScore !== undefined) {
      if (req.body.performanceScore < 0 || req.body.performanceScore > 100) {
        res.status(400);
        throw new Error("Performance score must be between 0 and 100");
      }
    }

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    await employee.deleteOne();
    res.json({ message: "Employee removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};