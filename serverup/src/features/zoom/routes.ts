import express from 'express';
import meetingValidationSchema from './schema';

import validateRequest from '../auth/middleware/validationRequest';
import HandleErrors from '../auth/middleware/handleErrors';
import authorization from '../auth/middleware/authorization';
import { approveMeetings, getMeetings, requestMeeting, zoomOauth } from './controller';
import { adminValidation } from '../product/middleware/adminValidation';
const zoomRoutes = express.Router();

zoomRoutes.post('/requestMeet', validateRequest(meetingValidationSchema),authorization, HandleErrors(requestMeeting) );
zoomRoutes.get('/get-meetings', adminValidation, HandleErrors(getMeetings));
zoomRoutes.post('/approve-meetings/:id', HandleErrors(approveMeetings));
zoomRoutes.get("/oauth/callback", adminValidation, HandleErrors(zoomOauth));
export { zoomRoutes };