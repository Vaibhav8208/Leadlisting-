import express from 'express';
import {
  getAllCalls,
  getCallById,
  createCall,
  updateCall,
  deleteCall
} from '../controllers/callHistoryController.js';

const router = express.Router();

// GET all call records
router.get('/calls', getAllCalls);

// GET a specific call record by ID
router.get('/calls/:id', getCallById);

// POST a new call record
router.post('/calls', createCall);

// PUT (update) a specific call record
router.put('/calls/:id', updateCall);

// DELETE a call record by ID
router.delete('/calls/:id', deleteCall);

export default router;
