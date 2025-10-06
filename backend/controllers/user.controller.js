import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({ message: "get current user error" });
    }
}


export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName,
            assistantImage
        }, { new: true }).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ message: "updateAssistant error" });
    }
}




export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ response: "User not found." });
        }

        const userName = user.name;
        const assistantName = user.assistantName;
        const result = await geminiResponse(command, assistantName, userName);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I am unable to process your request at the moment." });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;

        let responseData = {
            type,
            userInput: gemResult.userInput,
            response: "" 
        };

        switch (type) {
            case "get-date":
                responseData.response = `current date is ${moment().format("YYYY-MM-DD")}`;
                break;
            case "get-time":
                responseData.response = `current time is ${moment().format("hh:mm A")}`;
                break;
            case "get-day":
                responseData.response = `today is ${moment().format("dddd")}`;
                break;
            case "get-month":
                responseData.response = `today is ${moment().format("MMMM")}`;
                break;
            case "get-year":
                responseData.response = `current year is ${moment().format("YYYY")}`;
                break;

            case "google-search":
            case "youtube-search":
            case "youtube-play":
            case "general":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
            case "get-news":
            case "get-joke":
            case "get-quote":
            case "get-fact":
            case "get-definition":
            case "get-synonym":
            case "get-antonym":
            case "set-reminder":
            case "set-alarm":
            case "set-timer":
            case "open-application":
            case "close-application":
            case "play-music":
            case "pause-music":
            case "stop-music":
            case "next-track":
            case "previous-track":
            case "mute-volume":
            case "increase-volume":
            case "decrease-volume":
                responseData.response = gemResult.response;
                break;
                
            default:
                return res.status(400).json({ response: "Sorry, I didn't understand that command." });
        }

        user.history.push({ 
            user: command, 
            assistant: responseData.response 
        });
        await user.save();
        
        return res.json(responseData);

    } catch (error) {
        console.error("askToAssistant error:", error);
        return res.status(500).json({ response: "askToAssistant error" });
    }
}
