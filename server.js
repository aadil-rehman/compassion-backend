const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// MongoDB connection string
const mongoURI =
	"mongodb+srv://aadilrehmandevelopment:3hK8SDAXtTJmlsrL@cluster0.uhb2epg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
	console.log("Connected to MongoDB");
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
	const activity = new Activity(data);
	try {
		await activity.save();
		res.status(200).json({ message: "Data received successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to save data" });
	}
});

// Handle GET requests to /api/endpoint
app.get("/api/endpoint", async (req, res) => {
	try {
		const activities = await Activity.find();
		res.status(200).json(activities);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch data" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
