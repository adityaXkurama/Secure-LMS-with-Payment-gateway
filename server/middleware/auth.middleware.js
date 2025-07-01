import { User } from "../models/user.model.js";
import { ApiError, catchAsync } from "./error.middleware.js";
import jwt from 'jsonwebtoken';

export const isAuthenticated = catchAsync(async(req,_,next)=>{
    const token = req.cookie.token

    if(!token){
        throw new ApiError('You are not logged in',401)
    }

    try {

        const decodedToken =  jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decodedToken.userId)

        if(!user){
            throw new ApiError('Unauthorized',401)
        }

        req.id = decodedToken.userId
        next()
        
    } catch (error) {
        throw new ApiError('JWT Token error',401)
    }
})