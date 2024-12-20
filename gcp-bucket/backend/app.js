const express = require("express");
const cors = require("cors");
const uploadRoute = require("./routes/uploadRoute");
const fetchRoute = require("./routes/fetchRoute");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoute);
app.use("/api/fetch", fetchRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
