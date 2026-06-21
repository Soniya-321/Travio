import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  generateTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  regenerateDay
} from '../controllers/tripController';

const router = Router();

// Protect all routes
router.use(protect);

router.post('/generate', generateTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/:id/regenerate-day', regenerateDay);

export default router;
