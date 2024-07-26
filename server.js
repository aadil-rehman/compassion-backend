const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const mongoURI =
	"mongodb+srv://aadilrehmandevelopment:3hK8SDAXtTJmlsrL@cluster0.uhb2epg.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

let cachedDb = null;

const connectToDatabase = async () => {
	if (cachedDb) {
		console.log("Using cached database instance");
		return cachedDb;
	}
	try {
		const db = await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		cachedDb = db;
		console.log("Connected to MongoDB");
		return db;
	} catch (error) {
		console.error("MongoDB connection error:", error);
		throw error;
	}
};

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

const Activity =
	mongoose.models.Activity || mongoose.model("Activity", activitySchema);

app.post("/api/endpoint", async (req, res) => {
	await connectToDatabase();
	const data = req.body;
	const activity = new Activity(data);
	try {
		const savedActivity = await activity.save();
		res.status(200).json({ message: "Data received successfully" });
	} catch (error) {
		console.error("Failed to save data:", error);
		res.status(500).json({ error: "Failed to save data" });
	}
});

app.get("/api/endpoint", async (req, res) => {
	await connectToDatabase();
	try {
		const activities = await Activity.find();
		res.status(200).json(activities);
	} catch (error) {
		console.error("Failed to fetch data:", error);
		res.status(500).json({ error: "Failed to fetch data" });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
