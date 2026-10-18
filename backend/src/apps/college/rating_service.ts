const mongoose = require('mongoose');


const RatingSchema = new mongoose.Schema({

  college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'college', required: true },
  rating: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  create_at: { type: Date, default: Date.now },
  overall_rating: { 
    type: Number, 
    required: true, 
    min: [1, 'Rating must be at least 1'], 
    max: [5, 'Rating cannot be more than 5'] 
  },
  review_title: { 
    type: String, 
    trim: true,
    maxLength: 100 
  },
  review_description: { 
    type: String, 
    trim: true,
    maxLength: 2000 
  },
  
})
RatingSchema.index({ college_id: 1, user_id: 1 }, { unique: true });
export const RatingDb = mongoose.models.rating || mongoose.model('rating', RatingSchema);