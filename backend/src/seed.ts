const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const { UserDb } = require('./apps/auth/user_service');
const { CollegeDb } = require('./apps/college/college_service');
const { RatingDb } = require('./apps/college/rating_service');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to Database...');

    await UserDb.deleteMany({});
    await CollegeDb.deleteMany({});
    await RatingDb.deleteMany({});
    console.log('Cleared existing data...');

    const locations = [
      { city: 'Bangalore', state: 'Karnataka' },
      { city: 'Mumbai', state: 'Maharashtra' },
      { city: 'Chennai', state: 'Tamil Nadu' },
      { city: 'Hyderabad', state: 'Telangana' },
      { city: 'New Delhi', state: 'Delhi' }
    ];
    
    const reviewTemplates = [
      { title: 'Great Campus', desc: 'Excellent faculty and placement support.', rating: 5 },
      { title: 'Good but tough', desc: 'Curriculum is very rigorous.', rating: 4 },
      { title: 'Average experience', desc: 'Needs better infrastructure.', rating: 3 },
      { title: 'Needs Improvement', desc: 'Management is slow to respond.', rating: 2 },
      { title: 'Amazing placements', desc: 'Got a great job right out of college!', rating: 5 }
    ];

    // 1. Generate 50 Colleges
    const collegeData = [];
    for (let i = 1; i <= 50; i++) {
      const loc = locations[i % locations.length];
      collegeData.push({
        aishe_code: `U-${String(i).padStart(4, '0')}`,
        college_name: `National Institute of Excellence ${i}`,
        city: loc?.city,
        state: loc?.state,
        country: 'India'
      });
    }
    
    const colleges = await CollegeDb.insertMany(collegeData);
    console.log(`Seeded ${colleges.length} colleges...`);

    // 2. Generate Users (1 Teacher, 3 Students per college)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const userData = [];
    userData.push({
      first_name: 'Super', last_name: 'Admin', email: 'admin@test.com', 
      password: hashedPassword, is_admin: true, college_id: colleges[0]._id
    });

    colleges.forEach((college:any, index:any) => {
      // 1 Teacher
      userData.push({
        first_name: 'Teacher', last_name: `${index + 1}`, email: `teacher${index + 1}@test.com`,
        password: hashedPassword, is_teacher: true, college_id: college._id
      });
      
      // 3 Students per college (so we can have 3 reviews per college)
      for(let s = 1; s <= 3; s++) {
        userData.push({
          first_name: 'Student', last_name: `${index + 1}_${s}`, 
          email: `student${index + 1}_${s}@test.com`, // e.g., student1_1@test.com
          password: hashedPassword, is_student: true, college_id: college._id
        });
      }
    });

    const users = await UserDb.insertMany(userData);
    console.log(`Seeded ${users.length} users...`);

    // 3. Generate Ratings (Each student leaves exactly 1 review)
    const ratingData: any = [];
    const students = users.filter((u:any) => u.is_student);

    colleges.forEach((college:any) => {
      // Find the 3 students assigned to this college
      const collegeStudents = students.filter((s:any) => String(s.college_id) === String(college._id));

      // Each of the 3 students leaves exactly 1 review
      collegeStudents.forEach((student:any) => {
        const randomReview = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        
        ratingData.push({
          college_id: college._id,
          user_id: student._id,
          rating: randomReview?.rating,
          overall_rating: randomReview?.rating,
          review_title: randomReview?.title,
          review_description: randomReview?.desc
        });
      });
    });

    const ratings = await RatingDb.insertMany(ratingData);
    console.log(`Seeded ${ratings.length} ratings (1 per student)...`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();