import {create} from "zustand";
import { axiosInstance } from "../lib/axios.ts";
import toast from "react-hot-toast";

interface AuthStore{
	authUser: any,
	isSigningUp: boolean,
	isLoggingIn:boolean,
	isUpdatingProfile:boolean,
	isCheckingAuth: boolean,
	checkAuth: ()=> Promise<void>
	signup: (data: signUpData) => Promise<void>;
}
interface signUpData{
	fullName:string,
	email: string,
	password: string
}


export const useAuthStore=create<AuthStore>((set)=>({
	authUser:null,
	isSigningUp:false,
	isLoggingIn:false,	
	isUpdatingProfile:false,

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
	}

}))