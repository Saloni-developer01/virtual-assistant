// import axios from "axios";


// const geminiResponse = async (command, assistantName, userName) => {
//     try {
//         const apiUrl = process.env.GEMINI_API_URL;

//         // const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}.
//         // You are not Google. You will now behave like a voice-enabled assistant.
//         // Your task is to understand the user's natural language input and respond with a JSON object like this : 
        
//         // {
//         // "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-month" | "get-day" | "get-year" | "get-news" | "get-joke" | "get-quote" | "get-fact" | "get-definition" | "get-synonym" | "get-antonym" | "set-reminder" | "set-alarm" | "set-timer" | "open-application" | "close-application" | "play-music" | "pause-music" | "stop-music" | "next-track" | "previous-track" | "increase-volume" | "decrease-volume" | "mute-volume" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show" ,

//         // "userInput" : "<original user input>" {Only remove your name from userinput if exists. Agar kisi ne Google ya YouTube pe kuch search karne ko bola hai, toh userInput mein only woh search waala text jaye.},

//         // "response": "<a complete and concise answer to the user's general question, read out loud to the user>" 
//         // }
        
//         // Instructions:
//         // - "type": Determine the user's intent.
//         // - "userinput": Original sentence the user spoke (after cleaning up your name).
        
//         // Type meanings:
//         // - "general": Factual or informational question.
//         // - "google-search": User wants to search something on Google.
//         // - "youtube-search": User wants to search something on Youtube.
//         // - "youtube-play": User wants to directly play a video or song.
//         // - "calculator-open": User wants to open calculator.
//         // - "instagram-open": User wants to open instagram.
//         // - "facebook-open": User wants to open facebook.
//         // - "weather-show": User wants to know weather.
//         // - **"get-time", "get-date", "get-day", "get-month", "get-year"**: These will be handled by the backend (Node.js/Moment.js), so for these types, give a short confirmation in 'response' (e.g., "Checking the date now.")
//         // - **"get-joke"**: User wants to hear a joke.
//         // - **"get-quote"**: User wants a motivational quote.
//         // - **"get-fact"**: User wants an interesting fact.
//         // - "get-definition", "get-synonym", "get-antonym": Meaning or related words.
//         // - **"set-reminder", "set-alarm", "set-timer"**: Give a voice-friendly reply saying you cannot perform OS-level functions (e.g., "Sorry, I can't set a timer on your device right now.").
//         // - **"open-application", "close-application", "play-music", "increase-volume", etc.** (All music/volume commands): Give a voice-friendly reply saying you cannot perform OS-level functions.

//         // Important Rules for Response:
//         // 1. **Main Rule:** Only respond with the **JSON object**, nothing else.
//         // 2. **Joke/Fact/Quote Content:** For types **"get-joke"**, **"get-fact"**, **"get-quote"**, **"get-definition"**, **"get-synonym"**, or **"get-antonym"**, the **'response'** field must contain the **full text** of the joke, fact, quote, or meaning, and not just a short confirmation like "Here's a joke."
//         // 3. **Date/Time/OS-Level Commands:** For "get-time", "get-date", "set-timer", "increase-volume", etc., the 'response' should be a short, voice-friendly confirmation (e.g., "I'm checking the time.", "Opening calculator.").
//         // 4. Use ${userName} agar koi puche tumhe kisne banaya.

//         // Now, your user input is - ${command}
        
//         // `


//         // Apne backend ke gemini utility file me jaakar prompt me ye add/verify karein:



//         const prompt = `You are a virtual assistant named ${assistantName} for ${userName}. 
// Analyze the user command: "${command}".
// You MUST return ONLY a valid JSON object in this exact format, with no extra text or markdown outside it:
// {
//   "type": "general" (or appropriate command type like "google-search", "get-date", etc.),
//   "userInput": "extracted query or command text",
//   "response": "the text response the assistant should speak"
// }`;

//         const result = await axios.post(apiUrl, {
//             "contents": [{
//                 "parts": [{"text": prompt}]
//             }]
//         })
        
//         return result.data.candidates[0].content.parts[0].text;
        
//     } catch (error) {
//         console.error("Gemini API Error:", error.message); 
//         return ""; 
//     }
// }


// export default geminiResponse;




























import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
    try {
        const apiUrl = process.env.GEMINI_API_URL;
        if (!apiUrl) {
            console.error("GEMINI_API_URL is missing in environment variables!");
            return JSON.stringify({
                type: "general",
                userInput: command,
                response: "Configuration error. Please check environment variables on Render."
            });
        }

        const prompt = `You are a virtual assistant named ${assistantName} for ${userName}. 
User says: "${command}"

You MUST respond in ONLY strict JSON format, with no markdown code blocks, no backticks:
{
  "type": "general",
  "userInput": "${command}",
  "response": "Give a short, friendly, natural voice response here."
}`;

        const result = await axios.post(apiUrl, {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        });

        const rawText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
            return JSON.stringify({
                type: "general",
                userInput: command,
                response: "I didn't get any response from Gemini."
            });
        }
        
        // Clean markdown backticks safely
        const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        return cleanedText;
        
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message); 
        // Crash hone ki jagah ek valid JSON return karega taaki 400/500 error na aaye
        return JSON.stringify({
            type: "general",
            userInput: command,
            response: "Sorry, I am having trouble connecting right now."
        });
    }
}

export default geminiResponse;