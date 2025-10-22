// import React, { useContext, useEffect, useState, useRef } from "react";
// import { userDataContext } from "../context/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { TbMenuOrder, TbX } from "react-icons/tb";
// import { TbArrowsCross } from "react-icons/tb";
// import { FiSend } from "react-icons/fi"; 

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );
//   const [userInputText, setUserInputText] = useState("");
//   const [isMicActive, setIsMicActive] = useState(true);
//   const [recognition, setRecognition] = useState(null);

//   const [hasInteracted, setHasInteracted] = useState(false);

//   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

//   const [showInstructions, setShowInstructions] = useState(() => {
//     const hasSeenInstructions = localStorage.getItem(
//       "assistant_instructions_seen"
//     );
//     return hasSeenInstructions !== "true";
//   });

//   const [hamburgerOpen, setHamburgerOpen] = useState(false);

//   const conversationEndRef = useRef(null);
//   const backgroundMusicRef = useRef(null);
//   const typingSoundRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);

//   useEffect(() => {
//     if (conversationEndRef.current) {
//       conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [conversationLog]);

//   const speakAssistantResponse = (text) => {
//     if (synthRef.current.speaking) {
//       synthRef.current.cancel();
//     }
//     const utterance = new SpeechSynthesisUtterance(text);
//     synthRef.current.speak(utterance);

//     utterance.onend = () => {
//       setTimeout(() => {
//         setIsMicActive(true); 
//       }, 500);
//     };
//   };

//   const stopTypingSound = () => {
//     if (typingSoundRef.current) {
//       typingSoundRef.current.pause();
//       typingSoundRef.current.currentTime = 0;
//     }
//   };

//   const startTypingSound = () => {
//     if (typingSoundRef.current) {
//       typingSoundRef.current.loop = true;
//       typingSoundRef.current.play().catch(() => {}); 
//     }
//   };

//   const callGeminiAPI = async (transcript) => {
//     if (recognition) {
//       setIsMicActive(false); 
//       recognition.stop();
//       console.log("Recognition stopped for API call.");
//     }
//     setStatus("Thinking...");
//     startTypingSound();

//     try {
//       const data = await getGeminiResponse(transcript);

//       stopTypingSound();

//       if (data && data.response) {
//         setConversationLog((prevLog) => [
//           ...prevLog,
//           { source: "assistant", text: data.response },
//         ]);

//         speakAssistantResponse(data.response); 
//         handleCommand(data);
//         setStatus("Reply shown.");
//       } else {
//         setStatus("Assistant did not return a response.");
//         setTimeout(() => {
//           setIsMicActive(true);
//         }, 500);
//       }
//     } catch (error) {
//       stopTypingSound();
//       console.error("Gemini API Error:", error);
//       setStatus(
//         `Error: API failed (${
//           error.response?.status || error.message
//         }). Try again.`
//       );
//       setTimeout(() => {
//         setIsMicActive(true);
//       }, 500);
//     }
//   };

//   // --- Handlers for user interactions ---

//   const handleLogout = async () => {
//     if (synthRef.current.speaking) {
//       synthRef.current.cancel();
//     }
//     stopTypingSound();
//     if (recognition) {
//       setIsMicActive(false);
//       recognition.stop();
//     }

//     try {
//       localStorage.removeItem("assistant_instructions_seen");

//       await axios.get(`${serverUrl}/api/user/logout`, {
//         withCredentials: true,
//       });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       localStorage.removeItem("assistant_instructions_seen");
//       setUserData(null);
//       console.log(error);
//       navigate("/signin");
//     }
//   };

//   const handleTextInput = (e) => {
//     e.preventDefault();
//     const trimmedInput = userInputText.trim();
//     if (!trimmedInput) return;

//     setConversationLog((prevLog) => [
//       ...prevLog,
//       { source: "user", text: trimmedInput },
//     ]);
//     setUserInputText(""); 

//     const assistantName = userData?.assistantName;
//     const callText = `${assistantName}, ${trimmedInput}`;

//     callGeminiAPI(callText);
//   };

//   const handleCommand = (data) => {
//     const { type, userInput } = data;
//     if (
//       type === "google-search" ||
//       type === "calculator-open" ||
//       type === "weather-show"
//     ) {
//       const query =
//         type === "calculator-open"
//           ? "calculator"
//           : type === "weather-show"
//           ? "weather"
//           : userInput;
//       const encodedQuery = encodeURIComponent(query);
//       window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
//     }

//     if (type === "instagram-open") {
//       window.open(`https://www.instagram.com/`, "_blank");
//     }

//     if (type === "facebook-open") {
//       window.open(`https://www.facebook.com/`, "_blank");
//     }

//     if (type === "youtube-search" || type === "youtube-play") {
//       const query = encodeURIComponent(userInput);
//       window.open(
//         `https://www.youtube.com/results?search_query=${query}`,
//         "_blank"
//       );
//     }

//     if (
//       [
//         "general",
//         "get-news",
//         "get-joke",
//         "get-quote",
//         "get-fact",
//         "get-definition",
//         "get-synonym",
//         "get-antonym",
//       ].includes(type)
//     ) {
//       return;
//     }
//   };

//   const handlePlayMusic = () => {
//     if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
//       backgroundMusicRef.current.volume = 0.3;
//       backgroundMusicRef.current.loop = true;
//       backgroundMusicRef.current
//         .play()
//         .catch((e) => console.log("Music play failed:", e));
//     }
//   };


//   useEffect(() => {
//     if (showInstructions) {
//       localStorage.setItem("assistant_instructions_seen", "true");
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Speech Recognition not supported in this browser.");
//       setStatus("Error: Speech Recognition not supported.");
//       return;
//     }

//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.continuous = false;
//     recognitionInstance.lang = "en-US";
//     setRecognition(recognitionInstance);

//     recognitionInstance.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);

//       recognitionInstance.stop();
//       setIsMicActive(false);

//       setConversationLog((prevLog) => [
//         ...prevLog,
//         { source: "user", text: transcript },
//       ]);

//       const assistantName = userData?.assistantName;
//       const callText = `${assistantName}, ${transcript}`;

//       await callGeminiAPI(callText);
//     };

//     recognitionInstance.onend = function () {
//       if (isMicActive) {
//         console.log("Recognition ended. Restarting...");
//         try {
//           setStatus("Listening...");
//           recognitionInstance.start();
//         } catch (e) {
//           console.warn("Error restarting mic from onend:", e.message);
//         }
//       } else {
//         console.log("Recognition manually stopped. Waiting for command completion/TTS.");
//       }
//     };

//     recognitionInstance.onerror = function (e) {
//       console.error("Recognition error:", e);
//       setStatus("Mic Error. Restarting...");
//       setIsMicActive(true);
//     };

//     return () => {
//       if (recognitionInstance) {
//         recognitionInstance.stop();
//       }
//       if (synthRef.current.speaking) {
//         synthRef.current.cancel();
//       }
//       if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
//       stopTypingSound();
//     };
//   }, [userData?.assistantName, getGeminiResponse]); 
  
//   useEffect(() => {
//     if (recognition && isMicActive) {
//         try {
//             recognition.start();
//             setStatus("Listening...");
//             console.log("Mic started/restarted due to isMicActive change.");
//         } catch (e) {
//             if (!e.message.includes("already started")) {
//                 console.warn("Error explicitly starting mic:", e.message);
//             }
//         }
//     } else if (recognition && !isMicActive) {
//         setStatus("Waiting for assistant...");
//     }
//   }, [isMicActive, recognition]);


//   return (
//     <div
//       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
//         handlePlayMusic(); 
//       }}
//     >
//       {showInstructions && (
//         <div className="fixed inset-0 bg-[#00000020] backdrop-blur-lg flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
//             <h2 className="text-2xl font-bold text-[#50A5B4] mb-4">
//               Welcome to Your Assistant!
//             </h2>

//             <ul className="text-gray-700 space-y-3 list-disc list-inside">
//               <li>Make sure your **microphone** is enabled and working.</li>
//               <li>
//                 Your **typing sound** will start playing after your first
//                 interaction.
//               </li>
//               <li>
//                 **IMPORTANT:** The assistant will **always** respond to your **voice** now (no wake word needed). For best results, keep questions clear.
//               </li>
//               <li>
//                 If you speak, but the assistant doesn't reply, check the status
//                 below its name — it will show exactly what the mic **'Heard'**.
//               </li>
//               <li>
//                 You can now **type** in the chat box at the bottom, or talk to
//                 it.
//               </li>
//               <li>
//                 You can ask the assistant to search anything on **Google** or
//                 **YouTube**.
//               </li>
//             </ul>
//             <p className="mt-6 text-xl font-bold text-center text-gray-800">
//               Enjoy your conversation! 🎉
//             </p>
//             <p className="mt-4 text-sm text-gray-500">
//               (This popup will disappear when you click anywhere on the screen.)
//             </p>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowInstructions(false);
//                 setHasInteracted(true);
//                 handlePlayMusic();
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
//             >
//               <TbArrowsCross className="w-[20px] h-[25px]" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Header/Nav */}
//       <div className="w-full h-[12vh] flex items-center justify-end pr-5 lg:pr-10">
//         <div className="hidden lg:flex gap-[20px]">
//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               navigate("/customize");
//             }}
//           >
//             Customize your Assistant
//           </button>

//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
//           >
//             History
//           </button>

//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={handleLogout}
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       <TbMenuOrder
//         className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-50"
//         onClick={() => setHamburgerOpen(true)}
//       />

//       <div
//         className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[300px] h-full 
//           bg-[#48A1B1] bg-opacity-90 backdrop-blur-md 
//           p-5 flex flex-col gap-5 
//           z-50 shadow-2xl
//           transition-transform duration-300 ease-in-out
//           ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <TbArrowsCross
//           className="text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-50"
//           onClick={() => setHamburgerOpen(false)}
//         />

//         <div className="mt-[60px] flex flex-col gap-4 w-full">
//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               setHamburgerOpen(false);
//               navigate("/customize");
//             }}
//           >
//             Customize Assistant
//           </button>

//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               setHamburgerOpen(false);
//               setShowHistoryDrawer(true);
//             }}
//           >
//             History
//           </button>

//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={handleLogout}
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {showHistoryDrawer && (
//         <div
//           className="fixed inset-0 bg-transparent z-[60]"
//           onClick={() => setShowHistoryDrawer(false)}
//         >
//           <div
//             className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-[400px] 
//             bg-white backdrop-blur-lg 
//             border-l border-white/20 
//             z-[70] p-5 shadow-2xl transition-transform duration-300 ease-in-out 
//             lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-[#5A655A]">
//                 Conversation History
//               </h2>
//               <TbX
//                 className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-[80]"
//                 onClick={() => {
//                   setShowHistoryDrawer(false);
//                 }}
//               />
//             </div>
//             <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-[15px] p-1">
//               {userData?.history?.length === 0 ? (
//                 <p className="text-gray-400 mt-4 text-sm">
//                   No past conversations found.
//                 </p>
//               ) : (
//                 userData?.history
//                   ?.slice()
//                   .reverse()
//                   .map((item, index) => (
//                     <div
//                       key={index}
//                       className=" bg-[#01A6F0] p-3 rounded-lg shadow-lg hover:bg-white/10 transition-colors border-l-4 border-[#F78B00] shadow-md"
//                     >
//                       <p className="text-grey text-sm font-bold mb-1">
//                         You:
//                         <span className="text-gray-700 font-normal ml-2">
//                           {item.user}
//                         </span>
//                       </p>
//                       <p className="text-grey text-sm font-bold mt-2">
//                         {userData?.assistantName}:
//                         <span className="text-gray-700 font-normal ml-2 line-clamp-2">
//                           {item.assistant}
//                         </span>
//                       </p>
//                     </div>
//                   ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       <div
//         className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
//         onClick={handlePlayMusic}
//       >
//         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />
//         {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto" /> */}

//         <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
//           <div className="flex flex-col items-center lg:items-start mt-10 lg:mt-0">
//             <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[10px] rounded-md">
//               <img
//                 src={userData?.assistantImage}
//                 alt="Assistant Image"
//                 className="h-full w-full object-cover rounded-md"
//               />
//             </div>

//             <h1 className="text-white text-[22px] font-bold text-center mt-4">
//               I'm {userData?.assistantName}
//             </h1>
//             <p className="text-[#F78B00] text-[17px] font-medium mt-2 text-center max-w-[200px]">
//               {status}
//             </p>
//           </div>

//           <div className="w-full max-w-4xl lg:max-w-[700px] flex flex-col">
//             <div className="p-4 md:p-[30px] bg-white bg-opacity-10 rounded-t-lg overflow-y-auto h-[60vh] lg:h-[450px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
//               {conversationLog.length === 0 && (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
//                     Your conversations will appear here. Start by saying: "
//                     <strong className="text-gray-500">
//                       {userData?.assistantName}
//                     </strong>
//                     ..." or type below.
//                   </p>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {conversationLog.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       item.source === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-xl max-w-[80%] md:max-w-[70%] text-sm md:text-base shadow-md ${
//                         item.source === "user"
//                           ? "bg-blue-500 text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-800 rounded-tl-none"
//                       }`}
//                     >
//                       <strong className="capitalize">{item.source}:</strong>{" "}
//                       {item.text}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={conversationEndRef} />
//               </div>
//             </div>

//             <form
//               onSubmit={handleTextInput}
//               className="flex w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-b-lg border border-[#15B8F3]/20 p-2 shadow-xl"
//             >
//               <input
//                 type="text"
//                 value={userInputText}
//                 onChange={(e) => setUserInputText(e.target.value)}
//                 placeholder={`Type your message here (e.g., "${userData?.assistantName}, what is the weather?")...`}
//                 className="flex-grow p-3 bg-transparent text-black placeholder-gray-400 focus:outline-none text-base md:text-lg"
//               />
//               <button
//                 type="submit"
//                 className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
//                 disabled={!userInputText.trim()}
//               >
//                 <FiSend className="w-6 h-6" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;


























































































































































































// import React, { useContext, useEffect, useState, useRef } from "react";
// import { userDataContext } from "../context/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { TbMenuOrder, TbX } from "react-icons/tb";
// import { TbArrowsCross } from "react-icons/tb";
// import { FiSend } from "react-icons/fi";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );
//   const [userInputText, setUserInputText] = useState("");
//   // isMicActive: Controls the *looping* start/stop logic
//   const [isMicActive, setIsMicActive] = useState(true);
//   const [recognition, setRecognition] = useState(null);
  
//   // To track if Assistant is currently speaking (TTS) - Ab yeh sirf status ke liye hai, loop control ke liye nahi.
//   const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false); 

//   const [hasInteracted, setHasInteracted] = useState(false);

//   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

//   const [showInstructions, setShowInstructions] = useState(() => {
//     const hasSeenInstructions = localStorage.getItem(
//       "assistant_instructions_seen"
//     );
//     return hasSeenInstructions !== "true";
//   });

//   const [hamburgerOpen, setHamburgerOpen] = useState(false);

//   const conversationEndRef = useRef(null);
//   const backgroundMusicRef = useRef(null);
//   const typingSoundRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);

//   // Helper to safely start recognition
//   const startRecognition = (recInstance) => {
//     if (recInstance) {
//       try {
//         recInstance.start();
//         setStatus("Listening...");
//         setIsMicActive(true); // Mic state ko update kiya
//         console.log("Mic started/restarted.");
//       } catch (e) {
//         if (!e.message.includes("already started")) {
//             console.warn("Error starting mic:", e.message);
//         }
//       }
//     }
//   };

//   // Helper to safely stop recognition
//   const stopRecognition = (recInstance) => {
//     if (recInstance) {
//       try {
//         recInstance.stop();
//         setIsMicActive(false); // Mic state ko update kiya
//         console.log("Mic stopped.");
//       } catch (e) {
//         console.warn("Error stopping mic:", e.message);
//       }
//     }
//   };
  
//   useEffect(() => {
//     if (conversationEndRef.current) {
//       conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [conversationLog]);

//   const speakAssistantResponse = (text) => {
//     // Mic ko turant band karo taaki woh TTS sound na sun le
//     if (recognition) {
//         stopRecognition(recognition);
//     }
    
//     // TTS shuru hone se pehle state set karo
//     setIsAssistantSpeaking(true);
//     setStatus("Assistant Speaking...");

//     // TTS Logic
//     const startSpeaking = () => {
//         if (synthRef.current.speaking) {
//             synthRef.current.cancel();
//         }
        
//         const utterance = new SpeechSynthesisUtterance(text);
//         synthRef.current.speak(utterance);

//         utterance.onend = () => {
//             setIsAssistantSpeaking(false);
//             setStatus("Ready to listen.");
//             // TTS khatam hone par, mic ko auto restart karo
//             // Recognition object set ho chuka hoga pehle useEffect mein
//             setTimeout(() => {
//                 startRecognition(recognition);
//             }, 500); // Thoda sa delay diya taaki TTS resources free ho jaayein
//         };

//         utterance.onerror = (event) => {
//             console.error('Speech Synthesis Error:', event);
//             setIsAssistantSpeaking(false);
//             setStatus("TTS Error. Restarting mic.");
//             // Error hone par bhi mic ko auto restart karo
//             setTimeout(() => {
//                 startRecognition(recognition);
//             }, 500);
//         };
//     }

//     // TTS ko thoda delay se start karo taaki React state update ho sake aur mic band ho sake
//     setTimeout(startSpeaking, 100); 
//   };

//   const stopTypingSound = () => {
//     if (typingSoundRef.current) {
//       typingSoundRef.current.pause();
//       typingSoundRef.current.currentTime = 0;
//     }
//   };

//   const startTypingSound = () => {
//     if (typingSoundRef.current) {
//       typingSoundRef.current.loop = true;
//       typingSoundRef.current.play().catch(() => {});
//     }
//   };

//   const callGeminiAPI = async (transcript) => {
//     // Recognition ko 'onresult' mein already stop kar diya gaya hai
//     setStatus("Thinking...");
//     startTypingSound();

//     try {
//       const data = await getGeminiResponse(transcript);

//       stopTypingSound();

//       if (data && data.response) {
//         setConversationLog((prevLog) => [
//           ...prevLog,
//           { source: "assistant", text: data.response },
//         ]);

//         speakAssistantResponse(data.response); // Mic restart is handled inside this function's onend
//         handleCommand(data);
//         setStatus("Reply shown. Waiting for TTS to finish...");
//       } else {
//         setStatus("Assistant did not return a response.");
//         // If no response, mic should restart immediately
//         setTimeout(() => {
//           startRecognition(recognition);
//         }, 500);
//       }
//     } catch (error) {
//       stopTypingSound();
//       console.error("Gemini API Error:", error);
//       setStatus(
//         `Error: API failed (${
//           error.response?.status || error.message
//         }). Try again.`
//       );
//       // If API fails, mic should restart immediately
//       setTimeout(() => {
//         startRecognition(recognition);
//       }, 500);
//     }
//   };

//   // --- Handlers for user interactions (Unchanged) ---
//   const handleLogout = async () => {
//     if (synthRef.current.speaking) {
//       synthRef.current.cancel();
//     }
//     stopTypingSound();
//     if (recognition) {
//       stopRecognition(recognition); // Helper use kiya
//     }

//     try {
//       localStorage.removeItem("assistant_instructions_seen");

//       await axios.get(`${serverUrl}/api/user/logout`, {
//         withCredentials: true,
//       });
//       setUserData(null);
//       navigate("/signin");
//     } catch (error) {
//       localStorage.removeItem("assistant_instructions_seen");
//       setUserData(null);
//       console.log(error);
//       navigate("/signin");
//     }
//   };

//   const handleTextInput = (e) => {
//     e.preventDefault();
//     const trimmedInput = userInputText.trim();
//     if (!trimmedInput) return;

//     setConversationLog((prevLog) => [
//       ...prevLog,
//       { source: "user", text: trimmedInput },
//     ]);
//     setUserInputText("");

//     const assistantName = userData?.assistantName;
//     const callText = `${assistantName}, ${trimmedInput}`;

//     callGeminiAPI(callText);
//   };

//   const handleCommand = (data) => {
//     const { type, userInput } = data;
//     if (
//       type === "google-search" ||
//       type === "calculator-open" ||
//       type === "weather-show"
//     ) {
//       const query =
//         type === "calculator-open"
//           ? "calculator"
//           : type === "weather-show"
//           ? "weather"
//           : userInput;
//       const encodedQuery = encodeURIComponent(query);
//       window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
//     }

//     if (type === "instagram-open") {
//       window.open(`https://www.instagram.com/`, "_blank");
//     }

//     if (type === "facebook-open") {
//       window.open(`https://www.facebook.com/`, "_blank");
//     }

//     if (type === "youtube-search" || type === "youtube-play") {
//       const query = encodeURIComponent(userInput);
//       window.open(
//         `https://www.youtube.com/results?search_query=${query}`,
//         "_blank"
//       );
//     }

//     if (
//       [
//         "general",
//         "get-news",
//         "get-joke",
//         "get-quote",
//         "get-fact",
//         "get-definition",
//         "get-synonym",
//         "get-antonym",
//       ].includes(type)
//     ) {
//       return;
//     }
//   };

//   const handlePlayMusic = () => {
//     if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
//       backgroundMusicRef.current.volume = 0.3;
//       backgroundMusicRef.current.loop = true;
//       backgroundMusicRef.current
//         .play()
//         .catch((e) => console.log("Music play failed:", e));
//     }
//   };

//   // --- Main Speech Recognition Setup & Loop Logic (Optimized) ---
//   useEffect(() => {
//     if (showInstructions) {
//       localStorage.setItem("assistant_instructions_seen", "true");
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       console.error("Speech Recognition not supported in this browser.");
//       setStatus("Error: Speech Recognition not supported.");
//       return;
//     }

//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.continuous = false;
//     recognitionInstance.lang = "en-US";
//     setRecognition(recognitionInstance); // Recognition instance set kiya

//     recognitionInstance.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);

//       // Jab kuch sun liya, toh mic ko band kar do taaki woh aage ki recording na kare
//       stopRecognition(recognitionInstance); // isMicActive automatically false ho jayega

//       setConversationLog((prevLog) => [
//         ...prevLog,
//         { source: "user", text: transcript },
//       ]);

//       const assistantName = userData?.assistantName;
//       const callText = `${assistantName}, ${transcript}`;

//       await callGeminiAPI(callText);
//     };

//     // Yahi main auto-restart loop hai
//     recognitionInstance.onend = function () {
//       // isMicActive: True ka matlab humne manually stop nahi kiya, aur TTS chal nahi raha hai
//       if (isMicActive && !isAssistantSpeaking) { 
//         console.log("Recognition ended naturally. Restarting...");
//         // isMicActive true hai toh startRecognition call ho jayega (jo khud hi status aur state update karta hai)
//         startRecognition(recognitionInstance);
//       } else {
//         console.log("Recognition manually stopped (for API/TTS) or is currently speaking.");
//         // Yahaan kuch nahi karenge. Mic ko TTS ke onend ya API fail hone par restart kiya jayega.
//       }
//     };

//     recognitionInstance.onerror = function (e) {
//       console.error("Recognition error:", e);
//       // Agar 'no-speech' error hai, toh woh onend ko trigger karta hai, isliye yahan kuch nahi karte.
//       // Agar koi aur fatal error hai, toh 1 second baad restart karne ki koshish karo.
//       if (e.error !== 'no-speech') {
//         setStatus("Mic Error. Retrying...");
//         setTimeout(() => startRecognition(recognitionInstance), 1000);
//       }
//     };

//     // Cleanup function
//     return () => {
//       if (recognitionInstance) {
//         recognitionInstance.stop();
//       }
//       if (synthRef.current.speaking) {
//         synthRef.current.cancel();
//       }
//       if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
//       stopTypingSound();
//     };
//   }, [userData?.assistantName, getGeminiResponse]); // Dependencies simple rakhe, taaki loop na bane


//   // --- Mic Control useEffect: Sirf Initial Start ke liye ---
//   // Yeh useEffect sirf ek baar run hoga initial component load par
//   useEffect(() => {
//     // Initial start
//     if (recognition && isMicActive) {
//         // Ek chota sa delay de rahe hain taaki component mount ho jaaye
//         const timer = setTimeout(() => {
//             startRecognition(recognition);
//         }, 100);
//         return () => clearTimeout(timer);
//     }
//   }, [recognition]); // Sirf recognition set hone par chalta hai


//   return (
//     <div
//       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
//         handlePlayMusic();
//       }}
//     >
//       {showInstructions && (
//         <div className="fixed inset-0 bg-[#00000020] backdrop-blur-lg flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
//             <h2 className="text-2xl font-bold text-[#50A5B4] mb-4">
//               Welcome to Your Assistant!
//             </h2>

//             <ul className="text-gray-700 space-y-3 list-disc list-inside">
//               <li>Make sure your **microphone** is enabled and working.</li>
//               <li>
//                 Your **typing sound** will start playing after your first
//                 interaction.
//               </li>
//               <li>
//                 **IMPORTANT:** The assistant will **always** respond to your **voice** now (no wake word needed). For best results, keep questions clear.
//               </li>
//               <li>
//                 If you speak, but the assistant doesn't reply, check the status
//                 below its name — it will show exactly what the mic **'Heard'**.
//               </li>
//               <li>
//                 You can now **type** in the chat box at the bottom, or talk to
//                 it.
//               </li>
//               <li>
//                 You can ask the assistant to search anything on **Google** or
//                 **YouTube**.
//               </li>
//             </ul>
//             <p className="mt-6 text-xl font-bold text-center text-gray-800">
//               Enjoy your conversation! 🎉
//             </p>
//             <p className="mt-4 text-sm text-gray-500">
//               (This popup will disappear when you click anywhere on the screen.)
//             </p>

//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowInstructions(false);
//                 setHasInteracted(true);
//                 handlePlayMusic();
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
//             >
//               <TbArrowsCross className="w-[20px] h-[25px]" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Header/Nav (Unchanged) */}
//       <div className="w-full h-[12vh] flex items-center justify-end pr-5 lg:pr-10">
//         <div className="hidden lg:flex gap-[20px]">
//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               navigate("/customize");
//             }}
//           >
//             Customize your Assistant
//           </button>

//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
//           >
//             History
//           </button>

//           <button
//             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
//             onClick={handleLogout}
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       <TbMenuOrder
//         className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-50"
//         onClick={() => setHamburgerOpen(true)}
//       />

//       <div
//         className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[300px] h-full 
//           bg-[#48A1B1] bg-opacity-90 backdrop-blur-md 
//           p-5 flex flex-col gap-5 
//           z-50 shadow-2xl
//           transition-transform duration-300 ease-in-out
//           ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <TbArrowsCross
//           className="text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-50"
//           onClick={() => setHamburgerOpen(false)}
//         />

//         <div className="mt-[60px] flex flex-col gap-4 w-full">
//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               setHamburgerOpen(false);
//               navigate("/customize");
//             }}
//           >
//             Customize Assistant
//           </button>

//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={() => {
//               setHamburgerOpen(false);
//               setShowHistoryDrawer(true);
//             }}
//           >
//             History
//           </button>

//           <button
//             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
//             onClick={handleLogout}
//           >
//             Log Out
//           </button>
//         </div>
//       </div>

//       {/* History Drawer (Unchanged) */}
//       {showHistoryDrawer && (
//         <div
//           className="fixed inset-0 bg-transparent z-[60]"
//           onClick={() => setShowHistoryDrawer(false)}
//         >
//           <div
//             className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-[400px] 
//             bg-white backdrop-blur-lg 
//             border-l border-white/20 
//             z-[70] p-5 shadow-2xl transition-transform duration-300 ease-in-out 
//             lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-[#5A655A]">
//                 Conversation History
//               </h2>
//               <TbX
//                 className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-[80]"
//                 onClick={() => {
//                   setShowHistoryDrawer(false);
//                 }}
//               />
//             </div>
//             <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-[15px] p-1">
//               {userData?.history?.length === 0 ? (
//                 <p className="text-gray-400 mt-4 text-sm">
//                   No past conversations found.
//                 </p>
//               ) : (
//                 userData?.history
//                   ?.slice()
//                   .reverse()
//                   .map((item, index) => (
//                     <div
//                       key={index}
//                       className=" bg-[#01A6F0] p-3 rounded-lg shadow-lg hover:bg-white/10 transition-colors border-l-4 border-[#F78B00] shadow-md"
//                     >
//                       <p className="text-grey text-sm font-bold mb-1">
//                         You:
//                         <span className="text-gray-700 font-normal ml-2">
//                           {item.user}
//                         </span>
//                       </p>
//                       <p className="text-grey text-sm font-bold mt-2">
//                         {userData?.assistantName}:
//                         <span className="text-gray-700 font-normal ml-2 line-clamp-2">
//                           {item.assistant}
//                         </span>
//                       </p>
//                     </div>
//                   ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content Area (Unchanged) */}
//       <div
//         className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
//         onClick={handlePlayMusic}
//       >
//         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />
//         {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto" /> */}

//         <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
//           <div className="flex flex-col items-center lg:items-start mt-10 lg:mt-0">
//             <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[10px] rounded-md">
//               <img
//                 src={userData?.assistantImage}
//                 alt="Assistant Image"
//                 className="h-full w-full object-cover rounded-md"
//               />
//             </div>

//             <h1 className="text-white text-[22px] font-bold text-center mt-4">
//               I'm {userData?.assistantName}
//             </h1>
//             <p className="text-[#F78B00] text-[17px] font-medium mt-2 text-center max-w-[200px]">
//               {status}
//             </p>
//           </div>

//           <div className="w-full max-w-4xl lg:max-w-[700px] flex flex-col">
//             <div className="p-4 md:p-[30px] bg-white bg-opacity-10 rounded-t-lg overflow-y-auto h-[60vh] lg:h-[450px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
//               {conversationLog.length === 0 && (
//                 <div className="flex items-center justify-center h-full">
//                   <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
//                     Your conversations will appear here. Start by saying: "
//                     <strong className="text-gray-500">
//                       {userData?.assistantName}
//                     </strong>
//                     ..." or type below.
//                   </p>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {conversationLog.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`flex ${
//                       item.source === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     <div
//                       className={`p-3 rounded-xl max-w-[80%] md:max-w-[70%] text-sm md:text-base shadow-md ${
//                         item.source === "user"
//                           ? "bg-blue-500 text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-800 rounded-tl-none"
//                       }`}
//                     >
//                       <strong className="capitalize">{item.source}:</strong>{" "}
//                       {item.text}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={conversationEndRef} />
//               </div>
//             </div>

//             <form
//               onSubmit={handleTextInput}
//               className="flex w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-b-lg border border-[#15B8F3]/20 p-2 shadow-xl"
//             >
//               <input
//                 type="text"
//                 value={userInputText}
//                 onChange={(e) => setUserInputText(e.target.value)}
//                 placeholder={`Type your message here (e.g., "${userData?.assistantName}, what is the weather?")...`}
//                 className="flex-grow p-3 bg-transparent text-black placeholder-gray-400 focus:outline-none text-base md:text-lg"
//               />
//               <button
//                 type="submit"
//                 className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
//                 disabled={!userInputText.trim()}
//               >
//                 <FiSend className="w-6 h-6" />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;


















































































































































































































































import React, { useContext, useEffect, useState, useRef } from "react";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TbMenuOrder, TbX } from "react-icons/tb";
import { TbArrowsCross } from "react-icons/tb";
import { FiSend } from "react-icons/fi";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [conversationLog, setConversationLog] = useState([]);
  const [status, setStatus] = useState(
    "Tap the screen to initialize and start listening."
  );
  const [userInputText, setUserInputText] = useState("");
  
  // Mic state ab sirf UI aur external control ke liye hai
  const [isMicActive, setIsMicActive] = useState(false); 
  const [recognition, setRecognition] = useState(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false); 

  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showInstructions, setShowInstructions] = useState(() => {
    const hasSeenInstructions = localStorage.getItem(
      "assistant_instructions_seen"
    );
    return hasSeenInstructions !== "true";
  });
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const conversationEndRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const typingSoundRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null); 
  const isAssistantSpeakingRef = useRef(isAssistantSpeaking);

  // isAssistantSpeakingRef ko update rakho jab state change ho
  useEffect(() => {
    isAssistantSpeakingRef.current = isAssistantSpeaking;
  }, [isAssistantSpeaking]);

  // Helper to safely start recognition
  const startRecognition = (recInstance) => {
    if (recInstance && !isAssistantSpeakingRef.current) { 
      try {
          recInstance.start();
          setStatus("Listening...");
          setIsMicActive(true); 
          console.log("Mic started/restarted.");
      } catch (e) {
          if (!e.message.includes("already started")) {
              console.warn("Error starting mic:", e.message);
              setStatus("Mic Error. Tap to retry.");
              setIsMicActive(false); 
          }
      }
    } else if (isAssistantSpeakingRef.current) {
        console.log("Mic start attempt ignored: Assistant is speaking.");
        setStatus("Waiting for assistant to finish...");
    }
  };

  // Helper to safely stop recognition
  const stopRecognition = (recInstance) => {
    if (recInstance) {
      try {
        recInstance.stop();
        setIsMicActive(false); 
        console.log("Mic stopped.");
      } catch (e) {
        console.warn("Error stopping mic:", e.message);
      }
    }
  };
  
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationLog]);

  const speakAssistantResponse = (text) => {
    // 1. Mic ko turant band karo taaki TTS sound na sun le
    if (recognitionRef.current) {
        stopRecognition(recognitionRef.current);
    }
    
    setIsAssistantSpeaking(true);
    setStatus("Assistant Speaking...");

    // 2. TTS Logic
    const startSpeaking = () => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
            setIsAssistantSpeaking(false);
            setStatus("Ready to listen.");
            // 3. TTS khatam hone par, mic ko auto restart karo (thoda delay)
            if (recognitionRef.current) {
                setTimeout(() => startRecognition(recognitionRef.current), 500);
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech Synthesis Error:', event);
            setIsAssistantSpeaking(false);
            setStatus("TTS Error. Restarting mic.");
            if (recognitionRef.current) {
                setTimeout(() => startRecognition(recognitionRef.current), 500);
            }
        };

        synthRef.current.speak(utterance);
    }

    // TTS ko thoda delay se start karo (50ms)
    setTimeout(startSpeaking, 50); 
  };

  const stopTypingSound = () => {
    if (typingSoundRef.current) {
      typingSoundRef.current.pause();
      typingSoundRef.current.currentTime = 0;
    }
  };

  const startTypingSound = () => {
    if (typingSoundRef.current) {
      typingSoundRef.current.loop = true;
      typingSoundRef.current.play().catch(() => {});
    }
  };

  const callGeminiAPI = async (transcript) => {
    setStatus("Thinking...");
    startTypingSound();

    try {
      const data = await getGeminiResponse(transcript);

      stopTypingSound();

      if (data && data.response) {
        setConversationLog((prevLog) => [
          ...prevLog,
          { source: "assistant", text: data.response },
        ]);

        speakAssistantResponse(data.response); 
        handleCommand(data);
        setStatus("Reply shown. Waiting for assistant to speak...");
      } else {
        setStatus("Assistant did not return a response.");
        // If no response, mic should restart immediately
        setTimeout(() => startRecognition(recognitionRef.current), 500);
      }
    } catch (error) {
      stopTypingSound();
      console.error("Gemini API Error:", error);
      setStatus(
        `Error: API failed (${
          error.response?.status || error.message
        }). Retrying mic...`
      );
      // If API fails, mic should restart immediately
      setTimeout(() => startRecognition(recognitionRef.current), 500);
    }
  };

  const handleLogout = async () => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    stopTypingSound();
    if (recognitionRef.current) {
      stopRecognition(recognitionRef.current); 
    }

    try {
      localStorage.removeItem("assistant_instructions_seen");

      await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      localStorage.removeItem("assistant_instructions_seen");
      setUserData(null);
      console.log(error);
      navigate("/signin");
    }
  };

  const handleTextInput = (e) => {
    e.preventDefault();
    const trimmedInput = userInputText.trim();
    if (!trimmedInput) return;

    setConversationLog((prevLog) => [
      ...prevLog,
      { source: "user", text: trimmedInput },
    ]);
    setUserInputText("");

    const assistantName = userData?.assistantName;
    const callText = `${assistantName}, ${trimmedInput}`;

    callGeminiAPI(callText);
  };

  const handleCommand = (data) => {
    const { type, userInput } = data;
    if (
      type === "google-search" ||
      type === "calculator-open" ||
      type === "weather-show"
    ) {
      const query =
        type === "calculator-open"
          ? "calculator"
          : type === "weather-show"
          ? "weather"
          : userInput;
      const encodedQuery = encodeURIComponent(query);
      window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
    }

    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (
      [
        "general",
        "get-news",
        "get-joke",
        "get-quote",
        "get-fact",
        "get-definition",
        "get-synonym",
        "get-antonym",
      ].includes(type)
    ) {
      return;
    }
  };

  const handlePlayMusic = () => {
    if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
      backgroundMusicRef.current.volume = 0.3;
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current
        .play()
        .catch((e) => console.log("Music play failed:", e));
    }
  };

  // --- Main Speech Recognition Setup & Loop Logic ---
  useEffect(() => {
    if (showInstructions) {
      localStorage.setItem("assistant_instructions_seen", "true");
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Error: Speech Recognition not supported.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.lang = "en-US";
    setRecognition(recognitionInstance); 
    recognitionRef.current = recognitionInstance; 

    recognitionInstance.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      setStatus("Heard: " + transcript);

      stopRecognition(recognitionInstance); 

      setConversationLog((prevLog) => [
        ...prevLog,
        { source: "user", text: transcript },
      ]);

      const assistantName = userData?.assistantName;
      const callText = `${assistantName}, ${transcript}`;

      await callGeminiAPI(callText);
    };

    // ***********************************************
    // FIX 1: Aggressive Loop Fix (Slow Restart)
    recognitionInstance.onend = function () {
        // Recognition end hone par 2 second ka gap do
        console.log("Recognition ended naturally. Waiting for 2 seconds to restart...");
        
        if (isAssistantSpeakingRef.current) {
             console.log("Assistant is speaking. Restarting mic after TTS onend.");
             return; 
        }
        
        setTimeout(() => {
            if (!isAssistantSpeakingRef.current) { 
                console.log("2 second passed. Restarting mic.");
                startRecognition(recognitionInstance);
            } else {
                console.log("Mic not restarted: Assistant started speaking during the wait.");
            }
        }, 2000); 
    };
    // ***********************************************

    // ***********************************************
    // FIX 2: Aborted Error Handling
    recognitionInstance.onerror = function (e) {
      console.error("Recognition error:", e);
      stopRecognition(recognitionInstance); 

      if (e.error === 'aborted') {
          setStatus("Error: Aborted/Interrupted. Will retry in 5 seconds.");
          console.log("CRITICAL ABORTED ERROR. Delaying restart.");
          
          setTimeout(() => {
             if (!isAssistantSpeakingRef.current) {
                 startRecognition(recognitionInstance);
             }
          }, 5000); 
      }
      else if (e.error !== 'no-speech') {
        setStatus("Mic Error. Retrying in 1s...");
        setTimeout(() => startRecognition(recognitionInstance), 1000);
      }
    };
    // ***********************************************

    // Cleanup function
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      stopTypingSound();
    };
  }, [userData?.assistantName, getGeminiResponse]); // Semicolon removed here: }, [userData?.assistantName, getGeminiResponse])


  // --- Initial Start Trigger ---
  useEffect(() => {
    if (recognitionRef.current && hasInteracted && !isMicActive) {
      setStatus("Initializing mic after user interaction...");
      setTimeout(() => startRecognition(recognitionRef.current), 500);
    }
  }, [hasInteracted]);


  return (
    <div
      className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
      onClick={() => {
        setHasInteracted(true);
        setShowInstructions(false);
        handlePlayMusic();
      }}
    >
      {showInstructions && (
        <div className="fixed inset-0 bg-[#00000020] backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-[#50A5B4] mb-4">
              Welcome to Your Assistant!
            </h2>

            <ul className="text-gray-700 space-y-3 list-disc list-inside">
              <li>Make sure your **microphone** is enabled and working.</li>
              <li>
                Your **typing sound** will start playing after your first
                interaction.
              </li>
              <li>
                **IMPORTANT:** The assistant will **always** respond to your **voice** now (no wake word needed). For best results, keep questions clear.
              </li>
              <li>
                If you speak, but the assistant doesn't reply, check the status
                below its name — it will show exactly what the mic **'Heard'**.
              </li>
              <li>
                You can now **type** in the chat box at the bottom, or talk to
                it.
              </li>
              <li>
                You can ask the assistant to search anything on **Google** or
                **YouTube**.
              </li>
            </ul>
            <p className="mt-6 text-xl font-bold text-center text-gray-800">
              Enjoy your conversation! 🎉
            </p>
            <p className="mt-4 text-sm text-gray-500">
              (This popup will disappear when you click anywhere on the screen.)
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInstructions(false);
                setHasInteracted(true);
                handlePlayMusic();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
            >
              <TbArrowsCross className="w-[20px] h-[25px]" />
            </button>
          </div>
        </div>
      )}

      {/* Header/Nav (Unchanged) */}
      <div className="w-full h-[12vh] flex items-center justify-end pr-5 lg:pr-10">
        <div className="hidden lg:flex gap-[20px]">
          <button
            className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => {
              navigate("/customize");
            }}
          >
            Customize your Assistant
          </button>

          <button
            className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
          >
            History
          </button>

          <button
            className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      <TbMenuOrder
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-50"
        onClick={() => setHamburgerOpen(true)}
      />

      <div
        className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[300px] h-full 
          bg-[#48A1B1] bg-opacity-90 backdrop-blur-md 
          p-5 flex flex-col gap-5 
          z-50 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <TbArrowsCross
          className="text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-50"
          onClick={() => setHamburgerOpen(false)}
        />

        <div className="mt-[60px] flex flex-col gap-4 w-full">
          <button
            className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
            onClick={() => {
              setHamburgerOpen(false);
              navigate("/customize");
            }}
          >
            Customize Assistant
          </button>

          <button
            className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
            onClick={() => {
              setHamburgerOpen(false);
              setShowHistoryDrawer(true);
            }}
          >
            History
          </button>

          <button
            className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>

      {showHistoryDrawer && (
        <div
          className="fixed inset-0 bg-transparent z-[60]"
          onClick={() => setShowHistoryDrawer(false)}
        >
          <div
            className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-[400px] 
            bg-white backdrop-blur-lg 
            border-l border-white/20 
            z-[70] p-5 shadow-2xl transition-transform duration-300 ease-in-out 
            lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5A655A]">
                Conversation History
              </h2>
              <TbX
                className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-[80]"
                onClick={() => {
                  setShowHistoryDrawer(false);
                }}
              />
            </div>
            <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-[15px] p-1">
              {userData?.history?.length === 0 ? (
                <p className="text-gray-400 mt-4 text-sm">
                  No past conversations found.
                </p>
              ) : (
                userData?.history
                  ?.slice()
                  .reverse()
                  .map((item, index) => (
                    <div
                      key={index}
                      className=" bg-[#01A6F0] p-3 rounded-lg shadow-lg hover:bg-white/10 transition-colors border-l-4 border-[#F78B00] shadow-md"
                    >
                      <p className="text-grey text-sm font-bold mb-1">
                        You:
                        <span className="text-gray-700 font-normal ml-2">
                          {item.user}
                        </span>
                      </p>
                      <p className="text-grey text-sm font-bold mt-2">
                        {userData?.assistantName}:
                        <span className="text-gray-700 font-normal ml-2 line-clamp-2">
                          {item.assistant}
                        </span>
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
        onClick={handlePlayMusic}
      >
        <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
          <div className="flex flex-col items-center lg:items-start mt-10 lg:mt-0">
            <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[10px] rounded-md">
              <img
                src={userData?.assistantImage}
                alt="Assistant Image"
                className="h-full w-full object-cover rounded-md"
              />
            </div>

            <h1 className="text-white text-[22px] font-bold text-center mt-4">
              I'm {userData?.assistantName}
            </h1>
            <p className="text-[#F78B00] text-[17px] font-medium mt-2 text-center max-w-[200px]">
              {status}
            </p>
          </div>

          <div className="w-full max-w-4xl lg:max-w-[700px] flex flex-col">
            <div className="p-4 md:p-[30px] bg-white bg-opacity-10 rounded-t-lg overflow-y-auto h-[60vh] lg:h-[450px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
              {conversationLog.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
                    Your conversations will appear here. Start by saying: "
                    <strong className="text-gray-500">
                      {userData?.assistantName}
                    </strong>
                    ..." or type below.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {conversationLog.map((item, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      item.source === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl max-w-[80%] md:max-w-[70%] text-sm md:text-base shadow-md ${
                        item.source === "user"
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <strong className="capitalize">{item.source}:</strong>{" "}
                      {item.text}
                    </div>
                  </div>
                ))}
                <div ref={conversationEndRef} />
              </div>
            </div>

            <form
              onSubmit={handleTextInput}
              className="flex w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-b-lg border border-[#15B8F3]/20 p-2 shadow-xl"
            >
              <input
                type="text"
                value={userInputText}
                onChange={(e) => setUserInputText(e.target.value)}
                placeholder={`Type your message here (e.g., "${userData?.assistantName}, what is the weather?")...`}
                className="flex-grow p-3 bg-transparent text-black placeholder-gray-400 focus:outline-none text-base md:text-lg"
              />
              <button
                type="submit"
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                disabled={!userInputText.trim()}
              >
                <FiSend className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;