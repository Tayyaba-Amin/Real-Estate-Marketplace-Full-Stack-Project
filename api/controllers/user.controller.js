import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = async (req, res) => {
    res.send("Hello World");
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You are not allowed to update this user!"));
    }

    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{
             $set:{
             username: req.body.username,
             email: req.body.email,
             password: req.body.password
            }
        },{new:true})
        const { password, ...others } = updatedUser._doc; 
        res.status(200).json(others);
    } catch (error) {
        next(error);
    }

}