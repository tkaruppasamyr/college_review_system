export default function Registration(){
    return(
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                <div className="mb-4 flex justify-center">
                    <h1 className="text-2xl font-bold">Register</h1>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text"
                        name="name" 
                        className="border border-gray-300 rounded px-3 py-1"
                        required
                    />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        name="email" 
                        className="border border-gray-300 rounded px-3 py-1"
                        required
                    />
                </div>
                
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        className="border border-gray-300 rounded px-3 py-1"
                        required
                    />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                    <label htmlFor="role">Password</label>
                    <select name="role" id="role" className="border border-gray-300 rounded px-3 py-1">
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
                >
                    Login
                </button>
            </div>
        </div>
    )
}