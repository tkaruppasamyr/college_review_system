export const LoginApi = '/auth/login';
export const RegisterApi = '/auth/register';
export const CreateollegeApi =  '/college/create';
export const CollegeListApi =(currentPage: number, limit: number)=> `/college/list?page=${currentPage}&limit=${limit}`;
export const CollegeRatingAPI = (filterdata:any) => `/dashbords/list/college/rating?${filterdata}`;
export const MyReviewsApi = '/college/reviews/me';
export const UpdateMyReviewsApi = (id:string) => `/college/reviews/${id}`;
export const TeacherStudentsDetailApi = (search:any,page:any,limit:any)=>`/college/teacher/students?search=${search}&page=${page}&limit=${limit}`
export const TeacherCreateStudentApi = '/college/teacher/students';
export const TeacherUpdateStudentApi = (id:string) => `/college/teacher/students/${id}`; 
export const TeacherDeleteStudentApi = (id:string) => `/college/teacher/students/${id}`;