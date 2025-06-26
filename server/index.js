import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize  from 'express-mongo-sanitize';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit:100 ,
    message:"Too may requests from this IP, Please try again later"
})


//logging middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(hpp())
app.use('/api',limiter)


//logging middleware
if(process.env.NODE_ENV === 'development') {    
app.use(morgan('dev'))
}



//Body parser middleware
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true,limit:'10kb'}));
app.use(cookieParser())


//Global Errors Handler
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({
        status:"error",
        message:err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === 'development' && {stack:err.stack})
    })
})

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials:true,
    methods:['GET','POST','PUT','DELETE','PATCH','HEAD','OPTIONS'],
    allowedHeaders:[
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
    ]
}))

//API routes


//404 handler
app.use((req, res, next) => {
    res.status(404).json({
        status:"error",
        message:"Route not found !!"
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
})