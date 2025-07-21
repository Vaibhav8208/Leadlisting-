// backend/src/routes/userRoutes.js
import express from 'express';
import {
  createUser, getAllLeads, updateLead
  
} from '../controllers/leadController.js';

const router = express.Router();

router.post('/leads', createUser);
router.get('/leads', getAllLeads); // ✅ Add this line

router.put('/leads/:id', updateLead);
router.post('/leads', createUser);

export default router;