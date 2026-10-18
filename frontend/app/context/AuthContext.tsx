"use client"; // Required for Context and State

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Create the Context
const AuthContext = createContext<any>(null);

// 2. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [AuthUserData, setUser] = useState({first_name: "",last_name: "",email: "",is_admin: false,is_teacher: false,
        is_student: false,is_login: false}); // null means not logged in

  const login = (userData: any) => setUser((prev:any) => ({...prev,...userData,is_login: true}));
  const logout = () => setUser({first_name: "",last_name: "",email: "",is_admin: false,is_teacher: false,
        is_student: false,is_login: false});

  return (
    <AuthContext.Provider value={{ AuthUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Export a hook to use this context easily
export function useAuth() {
  return useContext(AuthContext);
}