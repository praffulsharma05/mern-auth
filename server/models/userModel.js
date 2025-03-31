// import mongoose from "mongoose";


// const userSchema = new mongoose.Schema({
//     name:{ type: String, required: true},
//     email:{type: String, required: true, unique: true},
//     password:{type: String, required: true},
//     verifyOtp: {type: String, default: ''},
//     verifyOtpExpireAt:{type: Number, default: 0},
//     isAccountVerified:{type: Boolean, default: false},
//     resetOtp: {type: String, default: ''},
//     resetOtpExpireAt:{type: Number, default: 0},
// })

// const userModel = mongoose.model.user || mongoose.model('user', userSchema);

// export default userModel;



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     verifyOtp: { type: String, default: '' },
//     verifyOtpExpireAt: { type: Number, default: 0 },
//     isAccountVerified: { type: Boolean, default: false },
//     resetOtp: { type: String, default: '' },
//     resetOtpExpireAt: { type: Number, default: 0 },
// });

// // Correct way to create the model
// const userModel = mongoose.models.User || mongoose.model('User', userSchema);

// export default userModel;



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     isAccountVerified: { type: Boolean, default: false },
//     verifyOtp: { type: String, default: "" },
//     verifyOtpExpireAt: { type: Number, default: 0 },
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAccountVerified: { type: Boolean, default: false },
    verifyOtp: { type: String, default: "" }, // Email verification OTP
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" }, // ✅ Added for Password Reset
    resetOtpExpireAt: { type: Number, default: 0 }, // ✅ OTP Expiry Time
}, { timestamps: true });

export default mongoose.model("User", userSchema);
