"use client";
import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../page';
import { axiosInstance } from '@/axios/axiosconfig'; 
import { AdminTecherGetApi,AdminTecherPostApi,AdminGetCollegeAssignedTeaher,AdminUpdateTeaherDetails,
    AdminDeleteTeaherDetails
 } from '../../../backendapi';

export const Teachers = () => {
    const { setEditingRecord, setIsModalOpen } = useContext(AdminContext);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.Get(AdminTecherGetApi(search, page));
            setTeachers(res.data.data);
            setTotalPages(res.data.meta.totalPages);
        } catch (err) {
            console.error("Failed to fetch teachers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchTeachers(), 300);
        return () => clearTimeout(timer);
    }, [page, search]); // Re-fetch on context change

    const handleEdit = (teacher: any) => {
        setEditingRecord(teacher);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this teacher?")) return;
        await axiosInstance.Delete(AdminDeleteTeaherDetails(id));
        fetchTeachers();
    };

    return (
        <div className="flex flex-col gap-4">
            <input 
                type="text" 
                placeholder="Search teachers by name or email..." 
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full max-w-sm rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : 
                         teachers.map(t => (
                            <tr key={t._id}>
                                <td className="px-6 py-4 text-sm text-gray-900">{t.first_name} {t.last_name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{t.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{t.college_id?.college_name || 'N/A'}</td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleEdit(t)} className="text-blue-600 mr-3 text-sm">Edit</button>
                                    <button onClick={() => handleDelete(t._id)} className="text-red-600 text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Prev</button>
                <span className="text-sm">Page {page} of {totalPages || 1}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm">Next</button>
            </div>
        </div>
    );
};

export const TeachersForm = () => {
    const { isCreateSubmitBtn, setIsCreateSubmitBtn, setIsModalOpen, editingRecord, getTabcontroll } = useContext(AdminContext);
    const [colleges, setColleges] = useState<any[]>([]);
    
    const [formData, setFormData] = useState({
        first_name: editingRecord?.first_name || '',
        last_name: editingRecord?.last_name || '',
        email: editingRecord?.email || '',
        password: '',
        college_id: editingRecord?.college_id?._id || ''
    });

    useEffect(() => {
        // Fetch colleges for the dropdown
        axiosInstance.Get(AdminGetCollegeAssignedTeaher).then(res => setColleges(res.data.data));
    }, []);

    useEffect(() => {
        if (isCreateSubmitBtn && getTabcontroll === "teachers") {
            const saveTeacher = async () => {
                try {
                    if (editingRecord) {
                        await axiosInstance.Put(AdminUpdateTeaherDetails(editingRecord._id), formData);
                    } else {
                        await axiosInstance.Post(AdminTecherPostApi, formData);
                    }
                    setIsModalOpen(false);
                    // A proper implementation would trigger a refresh in the table here
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsCreateSubmitBtn(false);
                }
            };
            saveTeacher();
        }
    }, [isCreateSubmitBtn]);
    
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full border rounded-md p-2 text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full border rounded-md p-2 text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-md p-2 text-sm" />
            </div>
            
            {!editingRecord && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border rounded-md p-2 text-sm" />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign College</label>
                <select 
                    value={formData.college_id} 
                    onChange={e => setFormData({...formData, college_id: e.target.value})} 
                    className="w-full border rounded-md p-2 text-sm"
                >
                    <option value="">Select a college...</option>
                    {colleges.map(c => (
                        <option key={c._id} value={c._id}>{c.college_name} ({c.aishe_code})</option>
                    ))}
                </select>
            </div>
        </div>
    );
};