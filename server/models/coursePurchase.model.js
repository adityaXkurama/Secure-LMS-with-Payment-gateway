import mongoose from "mongoose";



const coursePurchaseSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:[true,'Course reference is required']
    },
    user:{
         type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'User reference is required']
    },
    amount:{
        type:Number,
        required:[true,'Purchase amount is required'],
        min:[0,'Amount must be a non-negative number']
    },
    currency:{
        type:String,
        required:[true,'Currency is required']
    },
    status:{
        type:String,
        enum:{
            valus:['pending','completed','failed','refunded'],
            message:'Please select a valid status'
        },
        default:'pending'
    },
    paymentMethod:{
        type:String,
        required:[true,'Payment method is required']
    },
    paymentId:{
        type:String,
        required:[true,'Payment ID is required']
    },
    refundtId:{
        type:String
    },
    refundtAmount:{
        type:Number,
        min:[0,'Refund amount must be non-negative']
    },
    refundReason:{
        type:String
    },
    metadata:{
        type:Map,
        of:String
    },
},
{
    timestamps:true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})