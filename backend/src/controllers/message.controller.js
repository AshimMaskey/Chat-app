import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar=async(req,res)=>{
	try{
		const loggedInUserId=req.user._id;
		const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

		res.status(200).json(filteredUsers);
	}catch(error){
		console.log("error in getusersforsidebar", error.message);
		res.status(500).json({message:"internal server error"});
	}
}

export const getMessages=async(req,res)=>{
	try {
	const {id:userToChatId}=req.params;
	const myId=req.user._id;

	const messages=await Message.find({
		$or:[
			{senderId: userToChatId, recieverId: myId},
			{senderId: myId, recieverId: userToChatId}
		]
	})

	res.status(200).json(messages);
	} catch (error) {
		console.log("error in getmessages controller", error.message);
		res.status(500).json({message:"internal server error"});
	}	
}

export const sendMessage=async(req,res)=>{
	try {
		const {file,text}=req.body;
		const {id: recieverId}=req.params;
		const senderId=req.user._id;

		let imageUrl;
		if(file){
			// upload base64 image to cloudinary
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl= uploadResponse.secure_url;
		}

		const newMessage=new Message({
			senderId,
			recieverId,
			text,
			image:imageUrl
		})
		await newMessage.save();
		
		//todo realtime functionlaity goes here => socket.io

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("error in sendMessage controller", error.message);
		res.status(500).json({message:"internal server error"});
	}
}