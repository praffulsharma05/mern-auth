// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import cookieParser from 'cookie-parser';
// import connectDB from './config/mongodb.js';
// import authRouter from './routes/authRoutes.js'
    

// const app = express();
// const port = process.env.PORT || 5000
// connectDB();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({credentials: true}))


// app.get('/', (req, res)=> res.send("API Working"));
// app.use('/api/auth/', authRouter )


// app.listen(port, ()=> console.log(`Server started on PORT: ${port}`));

//mongodb+srv://prafful:<db_password>@cluster0.yy1nz.mongodb.net/


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
const app = express();
const port = process.env.PORT || 5000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(express.json({ limit: "10mb" })); // ✅ Ensure JSON parsing
app.use(express.urlencoded({ extended: true })); // ✅ Parse URL-encoded data
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true }));


app.get('/', (req, res) => res.send("API Working"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
