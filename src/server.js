const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Route files
const auth = require('./routes/authRoutes');
const jobs = require('./routes/jobRoutes');
const applications = require('./routes/applicationRoutes');
const errorHandler = require('./middleware/errorMiddleware');

// Mount routers
app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});

app.use('/api/auth', auth);
app.use('/api/jobs', jobs);
app.use('/api/applications', applications);

// Error Handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
