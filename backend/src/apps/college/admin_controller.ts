// controllers/admin_controller.ts
import { Request, Response } from 'express';
import { CollegeDb } from '../college/college_service';
import { UserDb } from '../auth/user_service';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

class AdminCollegeController{
  async getColleges(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const matchStage: any = { is_deleted: false };
      if (search) {
        matchStage.$or = [
          { college_name: { $regex: search, $options: 'i' } },
          { aishe_code: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await CollegeDb.countDocuments(matchStage);
      const colleges = await CollegeDb.find(matchStage).skip(skip).limit(limit).sort({ create_at: -1 });

      return res.status(200).json({ data: colleges, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  async createCollege(req: Request, res: Response) {
    try {
      const college = await CollegeDb.create(req.body);
      return res.status(200).json({ message: "College created", data: college });
    } catch (error) {
      return res.status(400).json({ message: "Error creating college" });
    }
  }

  async updateCollege(req: Request, res: Response) {
    try {
      const college = await CollegeDb.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json({ message: "College updated", data: college });
    } catch (error) {
      return res.status(400).json({ message: "Error updating college" });
    }
  }

  async deleteCollege(req: Request, res: Response) {
    try {
      await CollegeDb.findByIdAndUpdate(req.params.id, { is_deleted: true, is_active: false });
      return res.status(200).json({ message: "College deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting college" });
    }
  }
};

export const adminCollegeController = new AdminCollegeController();

class AdminTeacherController {
  async getTeachers(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || '';
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const skip = (page - 1) * limit;

      const matchStage: any = { is_deleted: false, is_teacher: true };
      if (search) {
        matchStage.$or = [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await UserDb.countDocuments(matchStage);
      const teachers = await UserDb.find(matchStage)
        .populate('college_id', 'college_name aishe_code')
        .skip(skip)
        .limit(limit)
        .sort({ create_at: -1 });

      return res.status(200).json({ data: teachers, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async createTeacher(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, password, college_id } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const teacher = await UserDb.create({
        first_name, last_name, email, password: hashedPassword,
        college_id, is_teacher: true
      });
      return res.status(200).json({ message: "Teacher created", data: teacher });
    } catch (error) {
      return res.status(400).json({ message: "Error creating teacher" });
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try {
      const { first_name, last_name, email, college_id } = req.body;
      const teacher = await UserDb.findByIdAndUpdate(
        req.params.id, 
        { first_name, last_name, email, college_id }, 
        { new: true }
      );
      return res.status(200).json({ message: "Teacher updated", data: teacher });
    } catch (error) {
      return res.status(400).json({ message: "Error updating teacher" });
    }
  }

  async deleteTeacher(req: Request, res: Response) {
    try {
      await UserDb.findByIdAndUpdate(req.params.id, { is_deleted: true, is_active: false });
      return res.status(200).json({ message: "Teacher deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting teacher" });
    }
  }
};

export const adminTeacherController = new AdminTeacherController();