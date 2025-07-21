// backend/src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import callRoutes from './src/routes/callRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import leadRoutes from './src/routes/leadRoutes.js';
import callLogsRouter from './src/routes/callLogsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the request body
app.use(express.urlencoded({ extended: true })); // Allow the server to accept URL-encoded forms

// API Routes
app.use('/api', userRoutes);
app.use('/api', leadRoutes);
app.use('/api', callRoutes);
app.use('/api/call-logs', callLogsRouter);

// Simple root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// app.get('/api/leads', async (req, res) => {
//   const leads = await getAllLeads();
//   res.json(leads);
// });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});