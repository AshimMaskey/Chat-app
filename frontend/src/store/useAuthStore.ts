import {create} from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import toast from "react-hot-toast";

interface AuthStore{
	authUser: any,
	onlineUsers:any,
	isSigningUp: boolean,
	isLoggingIn:boolean,
	isUpdatingProfile:boolean,
	isCheckingAuth: boolean,
	checkAuth: ()=> Promise<void>
	signup: (data: signUpData) => Promise<void>,
	login: (data: signInData) => Promise<void>,
	updateProfile: (data: any) => Promise<void>,
	logout:()=>Promise<void>
}
interface signUpData{
	fullName:string,
	email: string,
	password: string
}
interface signInData{
	email:string,
	password:string
}


export const useAuthStore=create<AuthStore>((set)=>({
	authUser:null,
	isSigningUp:false,
	isLoggingIn:false,	
	isUpdatingProfile:false,
	onlineUsers: [],
	isCheckingAuth:true,

	checkAuth:async()=>{
		try {
			const res=await axiosInstance.get('/auth/check');
			set({authUser:res.data});
		} catch (error) {
			console.log("error in check auth" , error);
			set({authUser:null});
		}finally{
			set({isCheckingAuth:false});
		}
	},

	signup:async(data)=>{
		set({isSigningUp:true});
		try{
			const res= await axiosInstance.post('/auth/signup',data);
			set({authUser:res.data});
			toast.success("Account created successfully");

		}catch(error:any){
			toast.error(error.response.data.message);
		}finally{
			set({isSigningUp:false});
		}
	},

	logout: async()=>{
		try{
			await axiosInstance.post("/auth/logout");
			set({authUser:null});
			toast.success("Logged out Successfully");
		}catch(error:any){
			toast.error(error.response.data.message);
		}
	},

	login: async(data)=>{
		set({isLoggingIn:true});
		try {
			const res=await axiosInstance.post("/auth/login",data);
			set({authUser:res.data});
			toast.success("Logged in Successfully");
		} catch (error:any) {
			toast.error(error.response.data.message);
		}finally{
			set({isLoggingIn:false});
		}
	},
	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
		  const res = await axiosInstance.put("/auth/update-profile", data);
		  set({ authUser: res.data });
		  toast.success("Profile updated successfully");
		} catch (error:any) {
		  console.log("error in update profile:", error);
		  toast.error(error.response.data.message);
		} finally {
		  set({ isUpdatingProfile: false });
		}
	  },

}))