import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../../page';
import { axiosInstance } from '@/axios/axiosconfig'; // Update path


export const Teachers = () => {
    return <div>Teachers</div>;
};



export const TeachersForm = () => {

    const {getTabcontroll, isCreateSubmitBtn, setIsCreateSubmitBtn,isModalOpen, setIsModalOpen} = useContext(AdminContext);
    
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
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
        <div className="space-y-5">

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Register Teacher</h2>
                <p className="text-sm text-gray-500 mt-2">Create a new teacher account</p>
            </div>


            {/* First & Last Name Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                        First Name
                    </label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="John"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Doe"
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="john.doe@example.com"
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</p>
            </div>
        </div>
    );
};