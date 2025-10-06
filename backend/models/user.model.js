import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String
    },
    assistantImage: {
        type: String
    },
    history: [
        {
            user: { type: String, required: true },
            assistant: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        } 
    ]

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
export default User;