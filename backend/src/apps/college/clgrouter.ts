import { Router } from 'express';
import CollegeController  from './controller';




export const clgrouters = Router();


clgrouters.post('/create', CollegeController.setCollegeCreate);
clgrouters.get('/list', CollegeController.getCollegeList);
clgrouters.get('/reviews/me', CollegeController.getMyReviews);
clgrouters.put('/reviews/:id', CollegeController.UpdateMyReviws);


export const collegedashboardrouter = Router();

collegedashboardrouter.get('/list/college/rating', CollegeController.CollegListDashbord);