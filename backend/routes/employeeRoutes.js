const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  searchEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/authMiddleware");

// Search must come before /:id or Express will treat "search" as an id
router.get("/search", protect, searchEmployees);

router.route("/")
  .get(protect, getAllEmployees)
  .post(protect, addEmployee);

router.route("/:id")
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;