export const LoginApi = '/auth/login';
export const RegisterApi = '/auth/register';
export const CreateollegeApi =  '/college/create';
export const CollegeListApi =(currentPage: number, limit: number)=> `/college/list?page=${currentPage}&limit=${limit}`;
export const CollegeRatingAPI = (filterdata:any) => `/dashbords/list/college/rating?${filterdata}`;
export const MyReviewsApi = '/college/reviews/me';
export const UpdateMyReviewsApi = (id:string) => `/college/reviews/${id}`;