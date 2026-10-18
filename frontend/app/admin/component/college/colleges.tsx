"use client";
import { useContext,useState,useEffect } from "react";
import {AdminContext } from "../../page";
import { axiosInstance } from "@/axios/axiosconfig";
import { CreateollegeApi,CollegeListApi } from "../../../backendapi";


interface College {
    _id: string;
    aishe_code: string;
    college_name: string;
    clg_loc_name?: string;
    city?: string;
    state?: string;
}

export const Colleges = () => {
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItems, setTotalItems] = useState<number>(0);

    const fetchColleges = async (currentPage: number) => {
        try {
            setLoading(true);
            const response = await axiosInstance.Get(CollegeListApi(currentPage, limit));
            setColleges(response.data.data);
            setTotalPages(response.data.meta.totalPages);
            setTotalItems(response.data.meta.total);
        } catch (err) {
            console.error("Failed to fetch colleges", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColleges(page);
    }, [page]);

    const handleEdit = (college: College) => {
        console.log("Edit clicked for:", college._id);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this college?")) return;
        try {
            await axiosInstance.Delete(`/college/${id}`);
            fetchColleges(page);
        } catch (err) {
            console.error("Failed to delete college", err);
        }
    };

    return (
        <div className="mt-8 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            {/* Header - Fixed at top of card */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0">
                <h2 className="text-lg font-semibold text-gray-800 m-0">Colleges List</h2>
            </div>
            
            {/* Table Wrapper - Scrollable area (max-h-[50vh] controls the height) */}
            <div className="overflow-x-auto overflow-y-auto max-h-[50vh] flex-1">
                <table className="min-w-full divide-y divide-gray-200 relative">
                    {/* Sticky Header - Stays visible when scrolling down */}
                    <thead className="bg-gray-50 sticky top-0 z-10 outline outline-1 outline-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                AISHE Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                College Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                City/State
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : colleges.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No colleges found.
                                </td>
                            </tr>
                        ) : (
                            colleges.map((college) => (
                                <tr key={college._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {college.aishe_code}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {college.college_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {college.clg_loc_name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {[college.city, college.state].filter(Boolean).join(', ') || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <button 
                                            onClick={() => handleEdit(college)}
                                            className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(college._id)}
                                            className="inline-flex items-center px-3 py-1.5 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer - Fixed at bottom of card */}
            {!loading && totalItems > 0 && (
                <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(page * limit, totalItems)}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> entries
                    </div>
                    
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button 
                            onClick={() => setPage(p => Math.max(p - 1, 1))} 
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700"
                        >
                            Previous
                        </button>
                        <button 
                            disabled
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border-t border-b border-gray-300 cursor-default"
                        >
                            Page {page} of {totalPages}
                        </button>
                        <button 
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export const CollegesForm = () => {
  
  const {getTabcontroll, isCreateSubmitBtn, setIsCreateSubmitBtn,isModalOpen, setIsModalOpen} = useContext(AdminContext);
  const [formData, setFormData] = useState({
    aishe_code: "",
    college_name: "",
    clg_loc_name: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (isCreateSubmitBtn && getTabcontroll === "colleges" && isModalOpen) {
      
      const result:any = axiosInstance.Post(CreateollegeApi, formData);
      if (result.status === 200) {
        console.log(result.data);
      }
      setIsModalOpen(false);
      setIsCreateSubmitBtn(false);
    }
  }, [isCreateSubmitBtn, setIsCreateSubmitBtn,setIsModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-4">Enter the college details below.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* AISHE Code (Required) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            AISHE Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aishe_code"
            value={formData.aishe_code}
            onChange={handleChange}
            required
            pattern="^[CUS]-\d{4,6}$"
            minLength={6}
            maxLength={8}
            placeholder="e.g., C-12345"
            title="Format must be like C-12345, U-1234, or S-123456"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
          />
        </div>

        {/* College Name (Required) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            College Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="college_name"
            value={formData.college_name}
            onChange={handleChange}
            required
            placeholder="e.g., National Institute of Technology"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Location Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location Area
          </label>
          <input
            type="text"
            name="clg_loc_name"
            value={formData.clg_loc_name}
            onChange={handleChange}
            placeholder="e.g., South Campus"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Mumbai"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g., Maharashtra"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., India"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

