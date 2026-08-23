import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User created successfully"
        });
    } catch (error) {
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"))
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"))
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...others } = validUser._doc;
        res
            .cookie("access_token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
            .status(200)
            .json(others)

    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...others } = user._doc;
            res
                .cookie("access_token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
                .status(200)
                .json(others);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = await User.create({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...others } = newUser._doc;
            res
                .cookie("access_token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
                .status(200)
                .json(others);
        }
    } catch (error) {
        next(error);
    }
}

//   Sign Out User
export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("acess_token");
        res.status(200).json({
            message: "User signed out successfully"
        })
    } catch (error) {
        next(error);
    }
}
