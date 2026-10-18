import { Router } from 'express';
import CollegeController  from './controller';
import TeacherController from './teacher_service';




export const clgrouters = Router();


clgrouters.post('/create', CollegeController.setCollegeCreate);
clgrouters.get('/list', CollegeController.getCollegeList);
clgrouters.get('/reviews/me', CollegeController.getMyReviews);
clgrouters.put('/reviews/:id', CollegeController.UpdateMyReviws);

clgrouters.get('/teacher/students', TeacherController.getStudents);
clgrouters.post('/teacher/students', TeacherController.addStudent);
clgrouters.put('/teacher/students/:id', TeacherController.updateStudent);
clgrouters.delete('/teacher/students/:id', TeacherController.deleteStudent);


export const collegedashboardrouter = Router();

collegedashboardrouter.get('/list/college/rating', CollegeController.CollegListDashbord);