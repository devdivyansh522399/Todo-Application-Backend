const express = require("express");
const router = express.Router();
const {
    createTodo,
    updateTodo,
    deleteTodo,
    getAllUserTodos,
    deleteAllUsersTodo,
    deleteAllCompletedUserTodos,
    markComplete,
    markIncomplete
} = require("../controllers/TodoController");


// Middleware - Add authentication middleware if needed
const {auth} = require("../middlewares/auth");

// Todo Routes

// Route to create a new todo
router.post("/createTodo", auth, createTodo);

// Route to update an existing todo
router.post("/updateTodo", auth, updateTodo);

// Route to delete a single todo
router.delete("/deleteTodo",auth, deleteTodo);

// Route to get all todos of a particular user
router.get("/getAllUserTodos",auth, getAllUserTodos);

// Route to delete all todos of a specific user
router.delete("/deleteAllUsersTodo",auth,  deleteAllUsersTodo);

// Route to delete all completed todos of a specific user
router.delete("/deleteAllCompletedUserTodos",auth, deleteAllCompletedUserTodos);

// Route to mark a todo as complete
router.put("/markComplete", auth, markComplete);

// Route to mark a todo as incomplete
router.put("/markIncomplete", auth, markIncomplete);

module.exports = router;