const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for activities
let activities = [];

// Handle POST requests to /api/endpoint
app.post("/api/endpoint", (req, res) => {
	const data = req.body;
	activities.push(data);
	res.status(200).json({ message: "Data received successfully" });
});

// Handle GET requests to /api/endpoint
app.get("/api/endpoint", (req, res) => {
	res.status(200).json(activities);
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
