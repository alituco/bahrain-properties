import {Router} from 'express'
import {addEvent,deleteEvent,getUserEvents} from '../controllers/calendar.controller'
const router = Router()

router.post('/addEvent',addEvent)
router.delete('/deleteEvent/:event_id',deleteEvent)
router.get('/user-events', getUserEvents);
export default router;