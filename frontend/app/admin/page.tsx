"use client"
import { useState, createContext } from "react";
import { Colleges, CollegesForm } from "./component/college/colleges";
import { Teachers, TeachersForm } from "./component/teacher/teachers";
import { useAuth } from "../context/AuthContext";

export const AdminContext = createContext<any>(null);

export default function Admin() {
    const { AuthUserData } = useAuth();
    const [getTabcontroll, setTabcontroll] = useState("colleges");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateSubmitBtn, setIsCreateSubmitBtn] = useState(false);
    
    // NEW: Store the record being edited. Null means "Create Mode"
    const [editingRecord, setEditingRecord] = useState<any>(null);

    const openCreateModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    let context_value = {
        getTabcontroll, setTabcontroll, 
        setIsModalOpen, isModalOpen, 
        isCreateSubmitBtn, setIsCreateSubmitBtn,
        editingRecord, setEditingRecord
    };

    return (
        <AdminContext.Provider value={context_value}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        <button
                            onClick={openCreateModal}
                            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto shadow-sm"
                        >
                            + Add {getTabcontroll === "colleges" ? "College" : "Teacher"}
                        </button>
                    </div>

                    <div className="mb-6 inline-flex w-full rounded-lg bg-gray-200/80 p-1 sm:w-auto">
                        <button
                            onClick={() => setTabcontroll("colleges")}
                            className={`flex-1 rounded-md px-6 py-2 text-sm font-medium ${getTabcontroll === "colleges" ? "bg-white shadow-sm" : "text-gray-500"}`}
                        >
                            Colleges
                        </button>
                        <button
                            onClick={() => setTabcontroll("teachers")}
                            className={`flex-1 rounded-md px-6 py-2 text-sm font-medium ${getTabcontroll === "teachers" ? "bg-white shadow-sm" : "text-gray-500"}`}
                        >
                            Teachers
                        </button>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
                        {getTabcontroll === "colleges" && <Colleges />}
                        {getTabcontroll === "teachers" && <Teachers />}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingRecord ? "Edit" : "Add New"} {getTabcontroll === "colleges" ? "College" : "Teacher"}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                            </div>
                            <div className="p-6 text-gray-600">
                                {getTabcontroll === "colleges" ? <CollegesForm /> : <TeachersForm />}
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
                                <button 
                                    disabled={isCreateSubmitBtn} 
                                    onClick={() => setIsCreateSubmitBtn(true)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    {isCreateSubmitBtn ? "Saving..." : "Save"}
                                </button>
                                <button 
                                    disabled={isCreateSubmitBtn}
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>            
        </AdminContext.Provider>
    );
}