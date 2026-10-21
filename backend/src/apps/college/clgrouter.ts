import { Router } from 'express';
import CollegeController  from './controller';
import TeacherController from './teacher_service';
import { adminCollegeController, adminTeacherController  } from './admin_controller';




export const clgrouters = Router();


clgrouters.post('/create', CollegeController.setCollegeCreate);
clgrouters.get('/list', CollegeController.getCollegeList);
clgrouters.get('/reviews/me', CollegeController.getMyReviews);
clgrouters.put('/reviews/:id', CollegeController.UpdateMyReviws);

clgrouters.get('/teacher/students', TeacherController.getStudents);
clgrouters.post('/teacher/students', TeacherController.addStudent);
clgrouters.put('/teacher/students/:id', TeacherController.updateStudent);
clgrouters.delete('/teacher/students/:id', TeacherController.deleteStudent);


clgrouters.get('/admin', adminCollegeController.getColleges);
clgrouters.post('/admin/create', adminCollegeController.createCollege);
clgrouters.put('/admin/update/:id', adminCollegeController.updateCollege);
clgrouters.delete('/admin/delete/:id', adminCollegeController.deleteCollege);
clgrouters.get('/admin/teachers', adminTeacherController.getTeachers);
clgrouters.post('/admin/teachers/create', adminTeacherController.createTeacher);
clgrouters.get('/admin/teachers/college/list',adminCollegeController.getColleges)
clgrouters.put('/admin/teachers/update/:id', adminTeacherController.updateTeacher);
clgrouters.delete('/admin/teachers/delete/:id', adminTeacherController.deleteTeacher);

export const collegedashboardrouter = Router();

collegedashboardrouter.get('/list/college/rating', CollegeController.CollegListDashbord);
