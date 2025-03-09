import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
export const signup=async(req,res)=>{
	const {fullName,email,password}=req.body;
	try {
		if(password.length<6) return res.status(400).json({message: 'Password length should be more than 6'});
		
		const user=await User.find({email});
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

		}else{
			return res.status(400).json({message: "Invalid user data"});
		}

	} catch (error) {
		
	}
}

export const login=(req,res)=>{
	res.send("login route");
}

export const logout=(req,res)=>{
	res.send("logout route");
}