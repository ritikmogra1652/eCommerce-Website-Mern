import express from 'express';
import validationRequest from '../../auth/middleware/validationRequest';
import reviewValidationSchema from '../schema/schema';
import HandleErrors from '../../auth/middleware/handleErrors';
import { addReview, getReviews } from '../controller/reviewController';
import authorization from '../../auth/middleware/authorization';


const reviewRoutes = express.Router();


reviewRoutes.post("/add-review/:productId", authorization,  HandleErrors(addReview));
reviewRoutes.get("/get-reviews/:productId",authorization, HandleErrors(getReviews));

export { reviewRoutes };
