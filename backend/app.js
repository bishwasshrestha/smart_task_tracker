const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const pool = require("./db");

pool.query(
  `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    category TEXT,
    confidence FLOAT,
    done BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW() );
  `,
  (err) => {
    if (err) console.error("Error creating table:", err);
    else console.log("Task table is ready.");
  }
);

app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

const tasks = [];

app.post("/tasks", async (req, res) => {
  const task = req.body.text; // Extract task from request body

  // Call Python service for suggestion
  try {
    const response = await axios.post("http://python-service:5000/suggest", {
      task,
    }); // Send task to Python service for suggestion

    if (response.status !== 200) {
      throw new Error("Failed to get response from Python service");
    } // Check if the response is valid

    // Extract suggestion from response data
    // Assuming the Python service returns a JSON object with a 'category' field
    const suggestion = response.data || "Unknown"; // Default to "Unknown" if no category is provided

    await pool.query(
      `INSERT INTO tasks (task, category, confidence) VALUES($1, $2, $3)`,
      [task, suggestion.category, suggestion.confidence]
    ); // Store task and suggestion in PostgreSQL database

    res.json({ task, suggestion }); // Send response back to client
    console.log("Python service response:", response.data); // Log the response from Python service
  } catch (error) {
    // Handle errors from Python service
    console.error("Python service error:", error.message);
    const fallback = { category: "Unknown", confidence: 0 }; // Fallback suggestion in case of error
    tasks.push({ task, suggestion: fallback }); // Store task and fallback suggestion in tasks array
    res.json({ task, suggestion: fallback }); // Send fallback response back to client
  }
});
app.put("/tasks/:id", (req, res) => {
  // Endpoint to update task status
  const id = req.params.id; // Extract task ID from request parameters
  const { done } = req.body; // Extract task ID and done status from request body
  pool.query(`UPDATE tasks SET done = $1 WHERE id = $2`, [done, id], (err) => {
    if (err) {
      console.error("Error updating task:", err); // Log error if any
      res.status(500).json({ error: "Failed to update task" }); // Send error response
    } else {
      res.json({ message: "Task updated successfully" }); // Send success response
    }
  });
});

app.delete("/tasks/:id", (req, res) => {
  // Endpoint to delete a task
  const taskId = req.params.id; // Extract task ID from request parameters
  pool.query(`DELETE FROM tasks WHERE id = $1`, [taskId], (err) => {
    if (err) {
      console.error("Error deleting task:", err); // Log error if any
      res.status(500).json({ error: "Failed to delete task" }); // Send error response
    } else {
      res.json({ message: "Task deleted successfully" }); // Send success response
    }
  });
});
app.get("/tasks", async (req, res) => {
  // Endpoint to get all tasks
  console.log("Fetching all tasks..."); // Log the request
  const result = await pool.query("SELECT * FROM tasks"); // Fetch all tasks from PostgreSQL database
  const tasks = result.rows.map((row) => ({
    id: row.id,
    task: row.task,
    done: row.done,
    created_at: row.created_at,
    suggestion: {
      category: row.category,
      confidence: row.confidence,
    },
  })); // Store fetched tasks in tasks array
  tasks.sort((a, b) => a.created_at - b.created_at); // Sort tasks by creation date
  res.json(tasks); // Send tasks array as JSON response
});

app.listen(3000, () => {
  // Start the server on port 3000
  console.log("Node.js backend running on port 3000"); // Log the server start
  console.log("Python service URL: http://python-service:5000/suggest"); // Log the Python service URL
});
