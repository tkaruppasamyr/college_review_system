'use client';
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { axiosInstance } from "@/axios/axiosconfig";
import { TeacherStudentsDetailApi,TeacherCreateStudentApi,TeacherUpdateStudentApi,TeacherDeleteStudentApi  } from "../../backendapi";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  review_count: number;
}

export default function TeacherDashboard() {
  const { AuthUserData } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [limite,setlimite] = useState(10)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "", password: "", is_active: true });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.Get(TeacherStudentsDetailApi(search, page, limite));
      setStudents(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Basic debounce for search
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({ first_name: student.first_name, last_name: student.last_name, email: student.email, password: "", is_active: student.is_active });
    } else {
      setEditingStudent(null);
      setFormData({ first_name: "", last_name: "", email: "", password: "", is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await axiosInstance.Put(TeacherUpdateStudentApi(editingStudent._id), formData);
      } else {
        await axiosInstance.Post(TeacherCreateStudentApi, formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      alert("Error saving student");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this student?")) return;
    try {
      await axiosInstance.Delete(TeacherDeleteStudentApi(id));
      fetchStudents();
    } catch (error) {
      alert("Error deleting student");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        <header className="flex flex-wrap justify-between items-end border-b border-zinc-200 dark:border-zinc-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Teacher Dashboard</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">Manage students for {AuthUserData?.college_name || 'your college'}</p>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            + Add New Student
          </button>
        </header>

        {/* Controls: Search & Pagination */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <input 
            type="text" 
            placeholder="Search students by name or email..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
          />
          
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-sm dark:border-zinc-700 dark:text-zinc-200">Prev</button>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-sm dark:border-zinc-700 dark:text-zinc-200">Next</button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Name</th>
                <th className="p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email</th>
                <th className="p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Reviews</th>
                <th className="p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                <th className="p-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No students found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">{student.first_name} {student.last_name}</td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{student.email}</td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-0.5 px-2 rounded-full text-xs font-bold">{student.review_count}</span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`py-1 px-2 rounded text-xs font-medium ${student.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-right flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(student)} className="text-blue-600 hover:underline dark:text-blue-400">Edit</button>
                      <button onClick={() => handleDelete(student._id)} className="text-red-600 hover:underline dark:text-red-400">Remove</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">First Name</label>
                  <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Last Name</label>
                  <input required type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100" />
              </div>

              {!editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 p-2 text-sm text-zinc-900 dark:text-zinc-100" />
                </div>
              )}

              {editingStudent && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} id="isActive" />
                  <label htmlFor="isActive" className="text-sm text-zinc-700 dark:text-zinc-300">Account is Active</label>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}