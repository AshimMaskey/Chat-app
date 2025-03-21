import {create} from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL="http://localhost:8000"

interface AuthStore{
	authUser: any,
	onlineUsers:any,
	isSigningUp: boolean,
	isLoggingIn:boolean,
	socket:any,
	isUpdatingProfile:boolean,
	isCheckingAuth: boolean,
	checkAuth: ()=> Promise<void>
	signup: (data: signUpData) => Promise<void>,
	login: (data: signInData) => Promise<void>,
	updateProfile: (data: any) => Promise<void>,
	logout:()=>Promise<void>,
	connectSocket:()=> any
	disconnectSocket:()=> any
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


export const useAuthStore=create<AuthStore>((set,get)=>({
	authUser:null,
	isSigningUp:false,
	isLoggingIn:false,	
	isUpdatingProfile:false,
	onlineUsers: [],
	isCheckingAuth:true,
	socket:null,

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
			get().connectSocket();

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
			get().disconnectSocket();
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
			get().connectSocket();
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

	  connectSocket:()=>{
		const {authUser}=get();
		if(!authUser || get().socket?.connected) return;
		const socket=io(BASE_URL, {
			query:{
				userId:authUser._id,
			}
		});
		socket.connect();
		set({socket:socket});

		socket.on("getOnlineUsers",(userIds)=>{
			set({onlineUsers:userIds}); 
		})
	  },
	  disconnectSocket:()=>{
		if(get().socket?.connected) get().socket.disconnect();
	  }
}))