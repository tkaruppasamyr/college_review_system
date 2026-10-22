"use client";
import { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../page";
import { axiosInstance } from "@/axios/axiosconfig";
import { CollegeGetApi,CollegePostApi,CollegeUpdateApi,CollegeDeleteApi } from "../../../backendapi";
import axios from "axios";
import { useRouter } from "next/router";


export const Colleges = () => {
    const router = useRouter();
    const { setEditingRecord, setIsModalOpen } = useContext(AdminContext);
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchColleges = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.Get(CollegeGetApi(search, page));
            setColleges(response.data.data);
            setTotalPages(response.data.meta.totalPages);
        } catch (err) {
            if(axios.isAxiosError(err)){
                const status = err.response?.status;
                if(status === 401){
                router.push("/auth/login");     
                }
                if(status === 403){
                router.push("/auth/login");     
                }
            }
            console.error("Failed to fetch colleges", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchColleges(), 300);
        return () => clearTimeout(timer);
    }, [page, search]);

    const handleEdit = (college: any) => {
        setEditingRecord(college);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this college?")) return;
        await axiosInstance.Delete(CollegeDeleteApi(id));
        fetchColleges();
    };

    return (
        <div className="flex flex-col gap-4 mt-4">
            <input 
                type="text" 
                placeholder="Search colleges by name or AISHE code..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full max-w-sm rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            
            <div className="overflow-x-auto border rounded-lg max-h-[50vh]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AISHE Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City/State</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : 
                         colleges.map((c) => (
                            <tr key={c._id}>
                                <td className="px-6 py-4 text-sm text-gray-900">{c.aishe_code}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{c.college_name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{c.city}, {c.state}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleEdit(c)} className="text-blue-600 mr-3 text-sm">Edit</button>
                                    <button onClick={() => handleDelete(c._id)} className="text-red-600 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Prev</button>
                <span className="text-sm">Page {page} of {totalPages || 1}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Next</button>
            </div>
        </div>
    );
};

export const CollegesForm = () => {
    const { getTabcontroll, isCreateSubmitBtn, setIsCreateSubmitBtn, setIsModalOpen, editingRecord } = useContext(AdminContext);
    const [formData, setFormData] = useState({
        aishe_code: editingRecord?.aishe_code || "",
        college_name: editingRecord?.college_name || "",
        clg_loc_name: editingRecord?.clg_loc_name || "",
        city: editingRecord?.city || "",
        state: editingRecord?.state || "",
        country: editingRecord?.country || "India",
    });

    useEffect(() => {
        if (isCreateSubmitBtn && getTabcontroll === "colleges") {
            const saveCollege = async () => {
                try {
                    if (editingRecord) {
                        await axiosInstance.Put(CollegeUpdateApi(editingRecord._id), formData);
                    } else {
                        await axiosInstance.Post(CollegePostApi, formData);
                    }
                    setIsModalOpen(false);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsCreateSubmitBtn(false);
                }
            };
            saveCollege();
        }
    }, [isCreateSubmitBtn]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">AISHE Code</label>
                <input type="text" name="aishe_code" value={formData.aishe_code} onChange={handleChange} required className="w-full border rounded-lg p-2.5 text-sm uppercase" />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">College Name</label>
                <input type="text" name="college_name" value={formData.college_name} onChange={handleChange} required className="w-full border rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Location Area</label>
                <input type="text" name="clg_loc_name" value={formData.clg_loc_name} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border rounded-lg p-2.5 text-sm" />
            </div>
        </div>
    );
};