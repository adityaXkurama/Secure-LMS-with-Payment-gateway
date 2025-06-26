import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Course title is required'],
        trim:true,
        maxlength:[100,'Course title cannot exceed 100 characters']
    },
    subTitle:{
        type:String,
        trim:true,
        maxlength:[200,'Course subtitle cannot exceed 200 characters']
    },
    description:{
        type:String,
        trim:true,
    },
    category:{
        type:String,
        required:[true,"Course category is required"],
        trim:true,
    },
    level:{
        type:String,
        enum:{
            values:['beginner','intermediate','advanced'],
            message:'Please select a valid course level'
        },
        default:'beginner'
    },
    price:{
        type:Number,
        required:[true,'Course price is required'],
        min:[0,'Course price cannot be negative']
    },
    thumbnail:{
        type:String,
        required:[true,'Course thumbnail is required'],
    },
    enrolledStudents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Lecture'
        }
    ],
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'Instructor is required']
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    totalDuration:{
        type:Number,
        default:0
    },
    totalLectures:{
        type:Number,
        default:0
    },
    rating:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
            rating:{
                type:Number,
                required:true,
                min:1,
                max:5
            },
            comment:{
                type:String,
                maxlength:[500,'500 max characters']
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }
    ]

},{
    timestamps:true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
})

courseSchema.virtual('averageRating').get(function(){
    if(this.rating.length === 0) return 0

    const sum = this.rating.reduce((acc,entry)=> acc+entry.rating,0);
    return (sum/this.rating.length).toFixed(1)
})

courseSchema.pre('save', function(next){
    if(this.Lectures){
        this.totalLectures = this.lectures.length
    }

    next()
})


export const Course = mongoose.model('Course',courseSchema)