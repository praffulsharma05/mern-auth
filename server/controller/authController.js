 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";

// ✅ Register User
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending Welcome Email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Prafful.Co",
            text: `Welcome to Prafful's website. Your account has been created with email: ${email}`
        });

        return res.json({ success: true, message: "Registration successful. Email sent!" });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.json({ success: false, message: error.message });
    }
};

// ✅ Login User
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Login successful" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ✅ Logout User   
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ✅ Send Verification OTP
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            // text: `Your OTP is: ${otp}. It will expire in 24 hours.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        });

        return res.json({ success: true, message: "Verification OTP sent to email" });
    } catch (error) {
        return res.json({ success: false, message: "Error sending OTP" });
    }
};

// ✅ Verify OTP
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        return res.json({ success: false, message: "Error verifying email" });
    }
};

//Check if user is authenticated
export const isAuthenticed = async (req, res)=>{
    try{
        return res.json({success: true});
    }catch(error){
        res.json({success: false,message: error.message});

    }
}

 

 
 

// ✅ Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        console.log("Generated OTP:", otp); // Debugging - log OTP

        // Send email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",
            user.email)
        });

        return res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// ✅ Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP, and new password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        console.log("Stored OTP:", user.resetOtp);
        console.log("Received OTP:", otp);

        // Check OTP validity
        if (!user.resetOtp || user.resetOtp !== otp.trim()) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

 
