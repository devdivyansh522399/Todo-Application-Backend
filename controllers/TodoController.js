const User = require("../models/User");
const Todo = require("../models/Todo");

// Create Todo Controller
exports.createTodo = async (req, res) => {
    try {
        const { title, description,datetime,priority } = req.body;

        const createdBy = req.user.id;
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Create a new todo object and save it directly
        const savedTodo = await Todo.create({
            title,
            description,
            datetime,
            priority,
            createdBy,
        });

        const updatedTodo = await User.findByIdAndUpdate(createdBy,
            {
                $push:
                {
                    todos: savedTodo._id
                }
            });
        // Update the user's todos array with the new todo id

        // Respond with the saved todo object
        return res.status(201).json({
            success: true,
            message: "Todo Created Successfully",
            savedTodo,
        });
    }
    catch (error) {
        // If there's an error, respond with an error message
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};


// Update Todo Controller
exports.updateTodo = async (req, res) => {
    try {
        // Extracting Todo ID from request body
        const { todoId } = req.body;

        // Extracting updated fields from request body
        const { title, description, datetime,priority, } = req.body;

        // Check if TodoId is provided
        if(!todoId){
            return res.status(400).json({
                success: false,
                message: "Please Provide Todo ID",
            });
        }

        // Check if TodoId is Valid
        const todo = Todo.findById(todoId);
        if(!todo){
            return res.status(404).json({
                success: false,
                message: "Todo Id Is Invalid",
            });
        }

        // Create an object with the updated fields
        const updatedFields = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if(datetime) updatedFields.datetime = datetime;
        if(priority) updatedFields.priority = priority;
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedFields,
            { new: true }
        );

        // Respond with the updated Todo object
        return res.status(200).json({
            success: true,
            message: "Todo Updated Successfully",
            updatedTodo,
        });
    }
    catch (error) {
        // If there's an error, respond with an error message
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Delete a Single Todo Controller
exports.deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.body; // Extracting Todo ID from request body

        // Check if TodoId is provided
        if (!todoId) {
            return res.status(400).json({
                success: false,
                message: "Please provide Todo ID",
            });
        }

        // Find the Todo by ID and delete it
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        // Check if the Todo exists
        if (!deletedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully",
            deletedTodo,
        });
    }
    catch (error) {
        // If there's an error, respond with an error message
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Function to get all todo's of a particular user
exports.getAllUserTodos = async (req, res) => {

    try {
        const userId = req.user.id;
        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
            });
        }

        // Check if userId is valid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        // Find all todos belonging to the user
        const userTodos = await Todo.find({ createdBy: userId });

        // Respond with the todos
        return res.status(200).json({
            success: true,
            message: "All Todo's of User Fetched Successfully",
            userTodos,
        });
    }
    catch (error) {
        // If there's an error, respond with an error message
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Function to delete all todos of a specific user
exports.deleteAllUsersTodo = async (req, res) => {
    try {


        // Delete all todos belonging to the user
        await Todo.deleteMany({ });

        // Respond with a success message
        return res.status(200).json({
            success: true,
            message: "All Todo's deleted Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Function to delete all completed todos of a specific user
exports.deleteAllCompletedUserTodos = async (req, res) => {
    try {
        const userId = req.user.id;

        // Delete all completed todos belonging to the user
        await Todo.deleteMany({ createdBy: userId, completed: true });

        // Respond with a success message
        return res.status(200).json({
            success: true,
            message: "All completed Todos deleted Successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// Mark todo as complete
exports.markComplete = async (req, res) => {
    try {
        const { todoId } = req.body;

        // Check if todoId is provided
        if(!todoId) {
            return res.status(400).json({
                success: false,
                message: "Todo ID is required",
            });
        }

        // Update the todo as complete using findByIdAndUpdate
        const updatedTodo = await Todo.findByIdAndUpdate(todoId,
            { completed: true },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo marked as complete",
            todo: updatedTodo,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Mark todo as incomplete
exports.markIncomplete = async (req, res) => {
    try {
        const { todoId } = req.body;

        // Check if todoId is provided
        if (!todoId) {
            return res.status(400).json({
                success: false,
                message: "Todo ID is required",
            });
        }

        // Update the todo as incomplete using findByIdAndUpdate
        const updatedTodo = await Todo.findByIdAndUpdate(todoId,
            { completed: false },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Todo marked as incomplete",
            todo: updatedTodo,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
