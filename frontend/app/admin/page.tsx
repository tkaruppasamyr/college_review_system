"use client"

import { useState,createContext,useEffect } from "react";
import { Colleges, CollegesForm} from "./component/college/colleges";
import { Teachers, TeachersForm} from "./component/teacher/teachers";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";


export const AdminContext = createContext<any>(null);


export default function Admin(){
    const {AuthUserData} = useAuth();
    const router = useRouter();

    const[getTabcontroll, setTabcontroll] = useState("colleges");
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[isCreateSubmitBtn, setIsCreateSubmitBtn] = useState(false);

    let context_value = {getTabcontroll,setTabcontroll,setIsModalOpen,isModalOpen,isCreateSubmitBtn, setIsCreateSubmitBtn};

    const submittenBtnHandle = () => {
        setIsCreateSubmitBtn(true);
    }

    return (
        <AdminContext.Provider value={context_value}>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="mx-auto max-w-5xl">
                    {/* Header Section */}
                    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                        
                        <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto shadow-sm"
                        >
                        {/* Plus Icon */}
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add {getTabcontroll === "colleges" ? "College" : "Teacher"}
                        </button>
                    </div>

                    {/* Toggle Switch */}
                    <div className="mb-6 inline-flex w-full rounded-lg bg-gray-200/80 p-1 sm:w-auto">
                        <button
                        onClick={() => setTabcontroll("colleges")}
                        className={`flex-1 rounded-md px-6 py-2 text-sm font-medium transition-all sm:flex-none ${
                            getTabcontroll === "colleges"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        >
                        Colleges
                        </button>
                        <button
                        onClick={() => setTabcontroll("teachers")}
                        className={`flex-1 rounded-md px-6 py-2 text-sm font-medium transition-all sm:flex-none ${
                            getTabcontroll === "teachers"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        >
                        Teachers
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-6">
                        {getTabcontroll === "colleges" && <Colleges />}
                        {getTabcontroll === "teachers" && <Teachers />}
                    </div>
                </div>

                {/* Modal Overlay */}
                {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
                    
                    {/* Modal Container */}
                    <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                        {getTabcontroll === "colleges" ? "Add New College" : "Add New Teacher"}
                        </h3>
                        <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        >
                        {/* Close (X) Icon */}
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 text-gray-600">
                        {getTabcontroll === "colleges" ? (
                        <CollegesForm />
                        ) : (
                        <TeachersForm />
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                        <button disabled={isCreateSubmitBtn} type="submit"
                            className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto"
                            onClick={() => submittenBtnHandle()} >
                            {isCreateSubmitBtn && 
                            <svg className="mr-3 size-5 animate-spin bg-white fill-blue-600" xmlns="http://www.w3.org/2000/svg" height="1em"  viewBox="0 0 24 24"></svg>
                            }
                            Save
                        </button>

                        <button type="button" disabled={isCreateSubmitBtn}
                            className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => setIsModalOpen(false)} >
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