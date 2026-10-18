import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserDb } from '../auth/user_service';
import { RatingDb } from '../college/rating_service';

const bcrypt = require('bcrypt');

class TeacherController {
  
  // 1. GET: List Students with Search & Pagination (Same College Only)
  async getStudents(req: Request, res: Response) {
    try {
        console.log("authusers details : ", req.user)
        if (! req.user.is_teacher) {
            res.status(401).json({ message: "Unauthorized" });
        }
      const teacherCollegeId = req.user.college_id; 
      const search = (req.query.search as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      // Base query: Only students from the teacher's college
      const matchStage: any = {
        is_student: true,
        is_deleted: false,
        college_id: new mongoose.Types.ObjectId(teacherCollegeId)
      };

      if (search.trim()) {
        matchStage.$or = [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Aggregate to get students + count their reviews
      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: 'ratings',
            localField: '_id',
            foreignField: 'user_id',
            as: 'reviews'
          }
        },
        {
          $project: {
            first_name: 1, last_name: 1, email: 1, is_active: 1, create_at: 1,
            review_count: { $size: '$reviews' }
          }
        },
        { $sort: { create_at: -1 } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limit }]
          }
        }
      ];

      const [result] = await UserDb.aggregate(pipeline);
      const total = result.metadata[0] ? result.metadata[0].total : 0;

      return res.status(200).json({
        data: result.data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // 2. POST: Add a new student to this college
  async addStudent(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password } = req.body;
      const teacherCollegeId = req.user.college_id;

      const existingUser = await UserDb.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await UserDb.create({
        first_name, last_name, email, password: hashedPassword,
        is_student: true,
        college_id: teacherCollegeId // Force same college
      });

      return res.status(201).json({ message: "Student added", data: newStudent });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // 3. PUT: Update student
  async updateStudent(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, is_active } = req.body;
      
      // Update only if student belongs to teacher's college
      const updated = await UserDb.findOneAndUpdate(
        { _id: req.params.id, college_id: req.user.college_id, is_student: true },
        { $set: { first_name, last_name, email, is_active } },
        { new: true }
      );

      if (!updated) return res.status(404).json({ message: "Student not found or unauthorized" });
      return res.status(200).json({ message: "Student updated", data: updated });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // 4. DELETE: Soft delete student
  async deleteStudent(req: Request, res: Response) {
    try {
      const deleted = await UserDb.findOneAndUpdate(
        { _id: req.params.id, college_id: req.user.college_id, is_student: true },
        { $set: { is_deleted: true, is_active: false } }
      );
      if (!deleted) return res.status(404).json({ message: "Not found or unauthorized" });
      return res.status(200).json({ message: "Student removed" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
}
export default new TeacherController();