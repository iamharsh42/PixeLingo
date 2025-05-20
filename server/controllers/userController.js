// controller.js for user login, user registration, user logout

import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  dotenv from 'dotenv'


dotenv.config()

const registerUser= async(req,res)=>{
    try{
           const {name, email,password}=req.body;

        //    if any of these info is missing
           if(!name || !email || !password){
            return res.json({success:false, message:'Missing Details'})
           }

        //  if all are provided by the user we will encrypt the password
        const salt =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        
        // object to store all user data in database
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        // save info in mongodb
        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({id : user._id},process.env.JWT_SECRET)

        res.json({success: true, token, user:{name: user.name}})

    } catch(error){

        console.log(error)
        res.json({success:false, message:error.message})

    }
}

const loginUser = async (req, res)=>{
    try{
        const{email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message:'User does not exist'})
        }
        const isMatch= await bcrypt.compare(password,user.password)

        // if password matches
        if(isMatch){
               const token=jwt.sign({id: user._id}, process.env.JWT_SECRET)
               
               res.json({success:true, token, user:{name: user.name}})
        }else{
            return res.json({success:false, message: 'Invalid credentials'})
        }


    } catch(error){
         console.log(error)
        res.json({success:false, message: error.message})
    }
}


const userCredits = async (req, res)=>{
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId)
        res.json({success: true, credits : user.creditBalance, user:{name:user.name}})
    }
    catch(error){
         console.log(error.message)
         res.json({success:false, message:error.message})
    }
}
export {registerUser, loginUser, userCredits};