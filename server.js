const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// MongoDB connection string
const mongoURI =
	"mongodb+srv://aadilrehmandevelopment:3hK8SDAXtTJmlsrL@cluster0.uhb2epg.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const port = 3001; // This port is for local development

// Middleware
app.use(bodyParser.json());
app.use(cors());

let isConnected = false;

const connectToDatabase = async () => {
	if (isConnected) {
		console.log("Using existing database connection");
		return;
	}
	try {
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		isConnected = true;
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}
};

// Ensure database connection before handling any request
app.use(async (req, res, next) => {
	await connectToDatabase();
	next();
});

// Define a schema for activities
const activitySchema = new mongoose.Schema({
	timestamp: String,
	id: String,
	activity: String,
	date: String,
	districtName: String,
	location: String,
	districtHead: String,
	teamHead: String,
	teamMembers: [String],
	noOfFW: Number,
	audience: String,
	orators: [String],
	noOfPostersPasted: Number,
});

// Create a model for activities
const Activity = mongoose.model("Activity", activitySchema);

// Handle POST requests to /api/endpoint
app.post("/api/endpoint", async (req, res) => {
	const data = req.body;
	console.log("Received data:", data); // Debugging statement
	const activity = new Activity(data);
	try {
		const savedActivity = await activity.save();
		console.log("Saved activity:", savedActivity); // Debugging statement
		res.status(200).json({ message: "Data received successfully" });
	} catch (error) {
		console.error("Failed to save data:", error); // Debugging statement
		res.status(500).json({ error: "Failed to save data" });
	}
});

// Handle GET requests to /api/endpoint
app.get("/api/endpoint", async (req, res) => {
	try {
		const activities = await Activity.find();
		console.log("Fetched activities:", activities); // Debugging statement
		res.status(200).json(activities);
	} catch (error) {
		console.error("Failed to fetch data:", error); // Debugging statement
		res.status(500).json({ error: "Failed to fetch data" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Export the app for Vercel
