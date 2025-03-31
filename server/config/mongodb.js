// import mongoose from "mongoose";

// const connectDB = async () => {
//     mongoose.connection.on('connected', ()=> console.log('Database Connected'));
//     await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);

// };
// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Database Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
