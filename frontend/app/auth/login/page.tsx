'use client';

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { cache, useState } from "react";
import { axiosInstance } from "@/axios/axiosconfig";
import { LoginApi } from "../../backendapi"
import axios, { AxiosError } from "axios"; 


export default function Login(){
    const router = useRouter();
    const {login} = useAuth();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try{
            const response = await axiosInstance.Post(LoginApi,{email: userName, password: password});
            if (response.status === 400) {
                setError(response.data.message);
                return;
            }
            const data = response.data;
                console.log("very good morning", data.user);
                
                if(data.user.is_admin){
                    router.push("/admin");
                }else if(data.user.is_student){
                    router.push("/dashboard/student");
                }else if(data.user.is_teacher){
                    router.push("/dashboard/teacher");
                }
                login(data.user);
                // router.push("/");
       }
       catch (error) {
            if (axios.isAxiosError(error) && error.response) {
            
                if (error.response.status === 400) {
                    setError(error.response.data.message || "Invalid email or password.");
                    setUserName("");
                    setPassword("");
                } else {
                    setError("Server error. Please try again later.");
                }
                
            } else {
                setError("Cannot connect to the server.");
            }
       }
        
    }

    return(
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <div className="mb-4 flex justify-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                </div>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
                        {error}
                    </div>
                )}
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        value={userName}
                        onChange={(e)=>setUserName(e.target.value)}
                        required
                        className="border border-gray-300 rounded px-3 py-1"
                    />
                </div>
                
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input 
                        required
                        type="password"  
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
                >
                    Login
                </button>
            </form>
        </div>
    )
}