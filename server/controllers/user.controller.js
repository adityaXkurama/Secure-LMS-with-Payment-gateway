import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const createUserAccount = catchAsync(async(req,res)=>{
    const {name,email,password,role = 'student'} = req.body

    // TODO: validation
    const existingUser = await User.findOne({email: email.toLowerCase()})

    if(existingUser){
        throw new ApiError('User already exists',400)
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role
    })

    await user.updateLastActive()
    generateToken(res,user,'Account created successfully')
})

export const authenticateUser = catchAsync(async(req,res)=>{
    const {email,password} = req.body

    const user = User.findOne({email : email.toLowerCase()}).select('+password')

    if(!user || !(await user.comparePassword(password))){
        throw new ApiError('Invalid email or password',401)
    }

    await user.updateLastActive()
    generateToken(res,user,`Welcome back ${user.name}`)

})

export const signOutUser = catchAsync(async(_,res)=>{
    res
    .cookie('token','',{maxAge : 0})
    .status(200)
    .json({
        success:true,
        message:'Signed Out successfully'
    })
})

export const getCurrentUserProfile = catchAsync(async(req,res)=>{
    
    const user = await User.findById(req.id)
    .populate({
        path:'enrolledCourses.course',
        select:'title thumbnail description'
    })

    if(!user){
        throw new ApiError('User not found',404)
    }

    res.status(200).json({
        success:true,
        data:{
            ...user.toJSON(),
            totalEnrolledCourses: user.totalEnrolledCourses,
        }
    })

})



export const test = catchAsync(async(req,res)=>{})