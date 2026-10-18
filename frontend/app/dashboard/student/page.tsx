'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "@/axios/axiosconfig";
import { MyReviewsApi, UpdateMyReviewsApi } from "../../backendapi";

// Define the Review interface based on your Mongoose schema
interface Review {
  _id: string;
  college_name?: string; // Might need to populate this from CollegeDb on backend
  rating: number; // For the form, might use overall_rating
  overall_rating: number;
  review_title: string;
  review_description: string;
  create_at: string;
}

export default function StudentDashboard() {
  const { AuthUserData } = useAuth();
  
  // State for fetching data
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for Editing
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editFormData, setEditFormData] = useState({
    overall_rating: 1,
    review_title: "",
    review_description: "",
  });

  // --- 1. GET API Call: Fetch Student's Reviews ---
  const fetchMyReviews = async () => {
    try {
      setIsLoading(true);
      // Replace with your actual backend route to get user's reviews
      const response = await axiosInstance.Get(MyReviewsApi);

      setMyReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (AuthUserData) {
      fetchMyReviews();
    }
  }, [AuthUserData]);

  // --- 2. Open Edit Modal ---
  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditFormData({
      overall_rating: review.overall_rating || review.rating || 1,
      review_title: review.review_title || "",
      review_description: review.review_description || "",
    });
  };

  // --- 3. UPDATE API Call: Submit Edited Review ---
  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    try {
      // Use Put or Patch depending on your axios instance configuration
      // await axiosInstance.Put(`/reviews/${editingReview._id}`, editFormData);
      await axiosInstance.Put(UpdateMyReviewsApi(editingReview._id), editFormData);
      
      // Update local state so UI refreshes without a page reload
      setMyReviews((prevReviews) =>
        prevReviews.map((rev) =>
          rev._id === editingReview._id
            ? { ...rev, ...editFormData }
            : rev
        )
      );
      
      // Close modal
      setEditingReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review.");
    }
  };

  const studentName = AuthUserData?.name || "Student";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-12 font-sans relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Student Dashboard
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Welcome back, {studentName}
            </p>
          </div>
        </header>

        {/* My Reviews Section */}
        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            My Reviews
          </h2>
          
          {isLoading ? (
            <p className="text-zinc-500">Loading reviews...</p>
          ) : myReviews.length === 0 ? (
             <div className="p-8 text-center bg-white dark:bg-[#121212] rounded-xl border border-zinc-200 dark:border-zinc-800">
               <p className="text-zinc-500 mb-4">You haven't reviewed any colleges yet.</p>
               <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
                 Find a College
               </Link>
             </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myReviews.map((review) => (
                <div key={review._id} className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {review.college_name || "College Review"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                       <span className="text-amber-500 text-sm">★ {review.overall_rating}</span>
                       <span className="text-xs text-zinc-500">
                         {new Date(review.create_at).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{review.review_title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{review.review_description}</p>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="flex sm:flex-col gap-2 justify-start sm:justify-center">
                    <button 
                      onClick={() => handleEditClick(review)}
                      className="px-3 py-1.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-md text-zinc-800 dark:text-zinc-200"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --- EDIT MODAL --- */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Edit Review</h3>
            
            <form onSubmit={handleUpdateReview} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Rating (1-5)</label>
                <input 
                  type="number" 
                  min="1" max="5" 
                  required
                  value={editFormData.overall_rating}
                  onChange={(e) => setEditFormData({...editFormData, overall_rating: Number(e.target.value)})}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input 
                  type="text" 
                  maxLength={100}
                  required
                  value={editFormData.review_title}
                  onChange={(e) => setEditFormData({...editFormData, review_title: e.target.value})}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea 
                  rows={4}
                  maxLength={2000}
                  value={editFormData.review_description}
                  onChange={(e) => setEditFormData({...editFormData, review_description: e.target.value})}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}