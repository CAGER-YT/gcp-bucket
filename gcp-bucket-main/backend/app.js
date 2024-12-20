const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const fileRouter = require('./routes/fetch')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use the upload route
app.use('/api', uploadRoutes);
app.use('/api', fileRouter);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
