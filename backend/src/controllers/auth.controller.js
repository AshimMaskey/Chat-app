import bcrypt from 'bcryptjs'
import {generateToken} from '../lib/utils.js'
import User from '../models/user.model.js'
export const signup=async(req,res)=>{
	const {fullName,email,password}=req.body;
	try {
		if(!fullName || !email || !password) return res.status(400).json({message: 'All fields are required'});
		if(password.length<6) return res.status(400).json({message: 'Password length should be more than 6'});
		
		const user=await User.findOne({email});
		if(user) return res.status(400).json({message: 'Email already exists'});

		//password hashing
		const salt=await bcrypt.genSalt(10);
		const hashedPassword=await bcrypt.hash(password,salt);

		const newUser=await User.create({
			email,
			fullName,
			password: hashedPassword
		});

		if(newUser){
			//generate JWT token
			generateToken(newUser._id,res);
			await newUser.save();
			res.status(201).json({
				_id:newUser._id,
				email:newUser.email,
				fullName:newUser.fullName,
				profilePic:newUser.profilePic
			})
		}else{
			return res.status(400).json({message: "Invalid user data"});
		}
	} catch (error) {
		console.log("error in signup controller", error.message);
		return res.status(500).json({message: "internal server error"});		
	}
}

export const login=async(req,res)=>{
	const {email,password}=req.body;
	try {
		const user=await User.findOne({email});
		if(!user) return res.status(400).json({message: "Invalid Credentials"});

		const isPasswordCorrect=await bcrypt.compare(password,user.password);
		if(!isPasswordCorrect) return res.status(400).json({message: " Invalid Credentials"});

		generateToken(user._id,res);

		res.status(200).json({
			_id:user._id,
			email: user.email,
			fullName: user.fullName,
			profilePic: user.profilePic
		})

	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({message:"Internal server error"});
		
	}
}

export const logout=(req,res)=>{
	try {
		res.cookie("jwt", "", {maxAge:0});
		res.status(200).json({message:"Logged out successfully"});
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({message: "Internal server error"});
	}
}

export const updateProfile=(req,res)=>{
	
}