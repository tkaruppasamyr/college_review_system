import { Request, Response } from 'express';
import { CreateCollegeSchema } from './schema';
import { collegeservice } from './college_service';
import { RatingDb } from './rating_service';
import { TokenClear } from '../auth/authhandler';


class CollegeController{
  
  async setCollegeCreate(req: Request, res: Response) {
    try {
      if(!req.user.is_admin){
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
      const { error, value} = CreateCollegeSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const result = await collegeservice.get_aishe_by(value.aishe_code);
      if(result){
        return res.status(400).json({ message: 'College already exists' });
      }
      const create_clg = await collegeservice.create_clg(value);
      return res.status(200).json(create_clg);
    } catch (err) {
      console.error("Debit Charts Error:", err);
      res.status(500).json({
        success: false,
        error: "SERVER_ERROR",
        message: "Unexpected server error",
      });
    }
  }


  async getCollegeList(req: Request, res: Response) {
    try {
        // Extract pagination params from query, defaulting to page 1 and limit 10
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        // Prevent negative or zero values
        const safePage = Math.max(1, page);
        const safeLimit = Math.max(1, limit);

        // Fetch data from service
        const paginationResult = await collegeservice.getPaginatedColleges(safePage, safeLimit);

        return res.status(200).json({
            message: "College list retrieved successfully",
            data: paginationResult.colleges,
            meta: {
                total: paginationResult.totalDocuments,
                page: paginationResult.currentPage,
                limit: safeLimit,
                totalPages: paginationResult.totalPages
            }
        });

    } catch (error) {
        console.error("Error fetching college list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }
  
  async CollegListDashbord(req: Request, res: Response) {

    try {
        // Extract search and pagination params
        const search = (req.query.search as string) || '';
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        // Prevent negative or zero values
        const safePage = Math.max(1, page);
        const safeLimit = Math.max(1, limit);

        // Fetch data from service
        const paginationResult = await collegeservice.getCollegeRatings(search, safePage, safeLimit);

        return res.status(200).json({
            message: "College list retrieved successfully",
            data: paginationResult.colleges,
            meta: {
                total: paginationResult.totalDocuments,
                page: paginationResult.currentPage,
                limit: safeLimit,
                totalPages: paginationResult.totalPages
            }
        });

    } catch (error) {
        console.error("Error fetching college list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    
  }

  async getMyReviews(req: Request, res: Response) {
    try {
          const userId = req.user._id;  

          if(!req.user.is_student){
            TokenClear(req, res);
            return res.status(403).json({ "is_permission": false, "message": "Unauthorized" });
          }
          
          const reviews = await RatingDb.find({ user_id: userId })
            .populate('college_id', 'college_name') 
            .sort({ create_at: -1 });
    
            const formattedReviews = reviews.map((rev:any) => ({
                ...rev.toObject(),
                college_name: rev.college_id?.college_name || 'Unknown College'
            }));

            return res.status(200).json({ data: formattedReviews });
        } catch (error) {
            return res.status(500).json({ message: "Server error" });
          }
  }

  async UpdateMyReviws(req:Request, res:Response){
    try {
      const reviewId = req.params.id;
      const userId = req.user._id;
      const { overall_rating, review_title, review_description } = req.body;

      const review = await RatingDb.findOne({ _id: reviewId, user_id: userId });

      if (!review) {
        return res.status(404).json({ message: "Review not found or unauthorized" });
      }
      review.overall_rating = overall_rating;
      review.rating = overall_rating;
      review.review_title = review_title;
      review.review_description = review_description;

      await review.save();

      return res.status(200).json({ message: "Review updated", data: review });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }


}

export default new CollegeController();
