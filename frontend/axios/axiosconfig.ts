import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
// const isServer = typeof window === 'undefined';
// const baseURL = isServer ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_BASE_URL;
class Axios{

    readonly axiosinstance:AxiosInstance;

    constructor(){
        this.axiosinstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        // this.initializeInterceptors();
    }

    // Extra token handling

    // private initializeInterceptors(){
    //     const a = this.axiosinstance.interceptors.request.use(
    //         (config: InternalAxiosRequestConfig) => {
    //             const token = localStorage.getItem('access_token');
    //             if (token) {
    //                 config.headers.Authorization = `Bearer ${token}`;
    //             }
    //             return config;
    //         },
    //         (error) => {
    //             // Handle request error here
    //             return Promise.reject(error);
    //         }
    //     )
    //     console.log("what is interceptors", a);
    // }

    public async Post(url:string, data:any){
        return await this.axiosinstance.post(url, data);
    }

    public async Get(url:string){        
        return await this.axiosinstance.get(url);
    }

    public async Put(url:string, data:any){
        return await this.axiosinstance.put(url, data);
    }

    public async Delete(url:string){
        return await this.axiosinstance.delete(url);
    }

    public async Patch(url:string, data:any){
        return await this.axiosinstance.patch(url, data);
    }
}

export const axiosInstance = new Axios();
