// // import React, { useContext, useEffect, useState, useRef } from "react";
// // import { userDataContext } from "../context/UserContext.jsx";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { TbMenuOrder, TbX } from "react-icons/tb";
// // import { TbArrowsCross } from "react-icons/tb";

// // function Home() {
// //   const { userData, serverUrl, setUserData, getGeminiResponse } =
// //     useContext(userDataContext);
// //   const navigate = useNavigate();

// //   const [conversationLog, setConversationLog] = useState([]);
// //   const [status, setStatus] = useState(
// //     "Tap the mic and say your assistant's name to start."
// //   );

// //   const [hasInteracted, setHasInteracted] = useState(false);

// //   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

// //   const [showInstructions, setShowInstructions] = useState(() => {
// //     const hasSeenInstructions = localStorage.getItem(
// //       "assistant_instructions_seen"
// //     );
// //     return hasSeenInstructions !== "true";
// //   });

// //   const [hamburgerOpen, setHamburgerOpen] = useState(false);

// //   const backgroundMusicRef = useRef(null);
// //   const typingSoundRef = useRef(null);

// //   const handleLogout = async () => {
// //     try {
// //       localStorage.removeItem("assistant_instructions_seen");

// //       await axios.get(`${serverUrl}/api/user/logout`, {
// //         withCredentials: true,
// //       });
// //       setUserData(null);
// //       navigate("/signin");
// //     } catch (error) {
// //       localStorage.removeItem("assistant_instructions_seen");
// //       setUserData(null);
// //       console.log(error);
// //     }
// //   };

// //   const handleCommand = (data) => {
// //     const { type, userInput } = data;
// //     if (
// //       type === "google-search" ||
// //       type === "calculator-open" ||
// //       type === "weather-show"
// //     ) {
// //       const query =
// //         type === "calculator-open"
// //           ? "calculator"
// //           : type === "weather-show"
// //           ? "weather"
// //           : userInput;
// //       const encodedQuery = encodeURIComponent(query);
// //       window.open(`https://www.google.com/search?q=${encodedQuery}`, "_blank");
// //     }

// //     if (type === "instagram-open") {
// //       window.open(`https://www.instagram.com/`, "_blank");
// //     }

// //     if (type === "facebook-open") {
// //       window.open(`https://www.facebook.com/`, "_blank");
// //     }

// //     if (type === "youtube-search" || type === "youtube-play") {
// //       const query = encodeURIComponent(userInput);
// //       window.open(
// //         `https://www.youtube.com/results?search_query=${query}`,
// //         "_blank"
// //       );
// //     }

// //     if (
// //       [
// //         "general",
// //         "get-news",
// //         "get-joke",
// //         "get-quote",
// //         "get-fact",
// //         "get-definition",
// //         "get-synonym",
// //         "get-antonym",
// //       ].includes(type)
// //     ) {
// //       return;
// //     }
// //   };

// //   const handlePlayMusic = () => {
// //     if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
// //       backgroundMusicRef.current.volume = 0.3;
// //       backgroundMusicRef.current.loop = true;
// //       backgroundMusicRef.current
// //         .play()
// //         .catch((e) => console.log("Music play failed:", e));
// //     }
// //   };

// //   useEffect(() => {
// //     if (showInstructions) {
// //       localStorage.setItem("assistant_instructions_seen", "true");
// //     }

// //     const SpeechRecognition =
// //       window.SpeechRecognition || window.webkitSpeechRecognition;

// //     if (!SpeechRecognition) {
// //       console.error("Speech Recognition not supported in this browser.");
// //       setStatus("Error: Speech Recognition not supported.");
// //       return;
// //     }

// //     const recognition = new SpeechRecognition();
// //     recognition.continuous = true;
// //     recognition.lang = "en-US";

// //     let shouldRestart = true;

// //     recognition.onresult = async (e) => {
// //       const transcript = e.results[e.results.length - 1][0].transcript.trim();
// //       setStatus("Heard: " + transcript);

// //       if (
// //         transcript
// //           .toLowerCase()
// //           .includes(userData?.assistantName?.toLowerCase())
// //       ) {
// //         setConversationLog((prevLog) => [
// //           ...prevLog,
// //           { source: "user", text: transcript },
// //         ]);
// //         setStatus("Thinking...");

// //         shouldRestart = false;
// //         recognition.stop();
// //         console.log("Recognition stopped for API call.");

// //         try {
// //           if (typingSoundRef.current) {
// //             typingSoundRef.current.loop = true;
// //             typingSoundRef.current.play().catch(() => {});
// //           }

// //           const data = await getGeminiResponse(transcript);

// //           if (typingSoundRef.current) {
// //             typingSoundRef.current.pause();
// //             typingSoundRef.current.currentTime = 0;
// //           }

// //           if (data && data.response) {
// //             setConversationLog((prevLog) => [
// //               ...prevLog,
// //               { source: "assistant", text: data.response },
// //             ]);

// //             handleCommand(data);

// //             shouldRestart = true;
// //             setStatus("Reply shown. Restarting mic...");
// //             recognition.start();
// //           } else {
// //             setStatus("Assistant did not return a response.");
// //             shouldRestart = true;
// //             recognition.start();
// //           }
// //         } catch (error) {
// //           if (typingSoundRef.current) {
// //             typingSoundRef.current.pause();
// //             typingSoundRef.current.currentTime = 0; 
// //           }

// //           console.error("Gemini API Error:", error);
// //           setStatus(
// //             `Error: API failed (${
// //               error.response?.status || error.message
// //             }). Restarting mic...`
// //           );

// //           shouldRestart = true;
// //           recognition.start();
// //         }
// //       }
// //     };

// //     recognition.onend = function () {
// //       if (shouldRestart) {
// //         console.log(
// //           "Recognition ended (due to silence/timeout). Restarting..."
// //         );
// //         try {
// //           setStatus("Listening...");
// //           recognition.start();
// //         } catch (e) {
// //           console.warn("Error restarting mic from onend:", e.message);
// //         }
// //       } else {
// //         console.log("Manual stop. Waiting for API response.");
// //       }
// //     };

// //     try {
// //       setStatus("Starting mic...");
// //       recognition.start();
// //     } catch (e) {
// //       console.warn(
// //         "Initial recognition start failed (likely already running):",
// //         e.message
// //       );
// //       setStatus("Listening...");
// //     }

// //     return () => {
// //       shouldRestart = false;
// //       recognition.stop();
// //       if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
// //       if (typingSoundRef.current) typingSoundRef.current.pause();
// //     };
// //   }, [userData?.assistantName, hasInteracted, getGeminiResponse]);

// //   return (
// //     <div
// //       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
// //       onClick={() => {
// //         setHasInteracted(true);
// //         setShowInstructions(false);
// //       }}
// //     >
// //       {showInstructions && (
// //         <div className="fixed inset-0 bg-[#00000020] backdrop-blur-lg flex items-center justify-center z-50 p-4">
// //           <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
// //             <h2 className="text-2xl font-bold text-[#50A5B4] mb-4">
// //               Welcome to Your Assistant!
// //             </h2>

// //             <ul className="text-gray-700 space-y-3 list-disc list-inside">
// //               <li>Make sure your **microphone** is enabled and working.</li>
// //               <li>
// //                 Your **typing sound** will start playing after your first
// //                 interaction.
// //               </li>
// //               <li>
// //                 **CRITICAL:** The assistant will **only** respond if you start
// //                 your query by saying its name (e.g., **"
// //                 {userData?.assistantName}"**).
// //               </li>
// //               <li>
// //                 If you speak, but the assistant doesn't reply, check the status
// //                 below its name — it will show exactly what the mic **'Heard'**.
// //               </li>
// //               <li>
// //                 You can ask the assistant to search anything on **Google** or
// //                 **YouTube**.
// //               </li>
// //             </ul>
// //             <p className="mt-6 text-xl font-bold text-center text-gray-800">
// //               Enjoy your conversation! 🎉
// //             </p>
// //             <p className="mt-4 text-sm text-gray-500">
// //               (This popup will disappear when you click anywhere on the screen.)
// //             </p>

// //             <button
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 setShowInstructions(false);
// //                 setHasInteracted(true);
// //               }}
// //               className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
// //             >
// //               <TbArrowsCross className="w-[20px] h-[25px]" />
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className="w-full h-[12vh] flex items-center justify-end pr-5 lg:pr-10">
// //         <div className="hidden lg:flex gap-[20px]">
// //           <button
// //             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
// //             onClick={() => {
// //               navigate("/customize");
// //             }}
// //           >
// //             Customize your Assistant
// //           </button>

// //           <button
// //             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
// //             onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
// //           >
// //             History
// //           </button>

// //           <button
// //             className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hover:bg-gray-100 transition-colors"
// //             onClick={handleLogout}
// //           >
// //             Log Out
// //           </button>
// //         </div>
// //       </div>

// //       {/* 3. Mobile Hamburger Icon */}
// //       <TbMenuOrder
// //         className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-50"
// //         onClick={() => setHamburgerOpen(true)}
// //       />

// //       <div
// //         className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[300px] h-full 
// //           bg-[#48A1B1] bg-opacity-90 backdrop-blur-md 
// //           p-5 flex flex-col gap-5 
// //           z-50 shadow-2xl
// //           transition-transform duration-300 ease-in-out
// //           ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`
// //         }
// //       >
// //         <TbArrowsCross
// //           className="text-white absolute top-[20px] right-[20px] w-[30px] h-[30px] cursor-pointer z-50"
// //           onClick={() => setHamburgerOpen(false)}
// //         />

// //         <div className="mt-[60px] flex flex-col gap-4 w-full">
// //           <button
// //             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
// //             onClick={() => {
// //               setHamburgerOpen(false);
// //               navigate("/customize");
// //             }}
// //           >
// //             Customize Assistant
// //           </button>

// //           <button
// //             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
// //             onClick={() => {
// //               setHamburgerOpen(false); 
// //               setShowHistoryDrawer(true);
// //             }}
// //           >
// //             History
// //           </button>

// //           <button
// //             className="w-full h-[50px] text-black font-semibold bg-white rounded-lg text-[18px] px-3 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors"
// //             onClick={handleLogout}
// //           >
// //             Log Out
// //           </button>
// //         </div>
// //       </div>

// //       {showHistoryDrawer && (
// //         <div 
// //             className="fixed inset-0 bg-transparent z-[60]" 
// //             onClick={() => setShowHistoryDrawer(false)}
// //         >
// //           <div
// //             className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-[400px] 
// //             bg-white backdrop-blur-lg 
// //             border-l border-white/20 
// //             z-[70] p-5 shadow-2xl transition-transform duration-300 ease-in-out 
// //             lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
// //             onClick={(e) => e.stopPropagation()} 
// //           >
// //             <div className="flex justify-between items-center mb-6">
// //               <h2 className="text-2xl font-bold text-[#5A655A]">
// //                 Conversation History
// //               </h2>
// //               <TbX 
// //                 className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-[80]" 
// //                 onClick={() => {
// //                   setShowHistoryDrawer(false); 
// //                 }}
// //               />
// //             </div>
// //             <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-[15px] p-1">
// //               {userData?.history?.length === 0 ? (
// //                 <p className="text-gray-400 mt-4 text-sm">
// //                   No past conversations found.
// //                 </p>
// //               ) : (
// //                 userData?.history
// //                   ?.slice()
// //                   .reverse()
// //                   .map((item, index) => (
// //                     <div
// //                       key={index}
// //                       className=" bg-[#01A6F0] p-3 rounded-lg shadow-lg hover:bg-white/10 transition-colors border-l-4 border-[#F78B00] shadow-md"
// //                     >
// //                       <p className="text-grey text-sm font-bold mb-1">
// //                         You:
// //                         <span className="text-gray-700 font-normal ml-2">
// //                           {item.user}
// //                         </span>
// //                       </p>
// //                       <p className="text-grey text-sm font-bold mt-2">
// //                         {userData?.assistantName}:
// //                         <span className="text-gray-700 font-normal ml-2 line-clamp-2">
// //                           {item.assistant}
// //                         </span>
// //                       </p>
// //                     </div>
// //                   ))
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div
// //         className="w-full p-5 pt-0 lg:p-10 lg:pt-5" 
// //         onClick={handlePlayMusic}
// //       >
// //         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />

// //         <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
          
// //           <div className="flex flex-col items-center lg:items-start mt-10 lg:mt-0">
// //             <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[10px] rounded-md"> 
// //               <img
// //                 src={userData?.assistantImage}
// //                 alt="Assistant Image"
// //                 className="h-full w-full object-cover rounded-md" 
// //               />
// //             </div>

// //             <h1 className="text-white text-[22px] font-bold text-center mt-4">
// //               I'm {userData?.assistantName}
// //             </h1>
// //             <p className="text-[#F78B00] text-[17px] font-medium mt-2 text-center max-w-[200px]">
// //               {status}
// //             </p>
// //           </div>

// //           <div className="w-full max-w-4xl lg:max-w-[700px] p-4 md:p-[30px] bg-white bg-opacity-10 rounded-lg overflow-y-auto h-[65vh] lg:h-[500px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
// //             {conversationLog.length === 0 && (
// //               <div className="flex items-center justify-center h-full">
// //                 <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
// //                   Your conversations will appear here. Start by saying: "
// //                   <strong className="text-gray-500">{userData?.assistantName}</strong>..."
// //                 </p>
// //               </div>
// //             )}

// //             <div className="space-y-4">
// //               {conversationLog.map((item, index) => (
// //                 <div
// //                   key={index}
// //                   className={`flex ${
// //                     item.source === "user" ? "justify-end" : "justify-start"
// //                   }`}
// //                 >
// //                   <div
// //                     className={`p-3 rounded-xl max-w-[80%] md:max-w-[70%] text-sm md:text-base shadow-md ${
// //                       item.source === "user"
// //                         ? "bg-blue-500 text-white rounded-br-none"
// //                         : "bg-gray-200 text-gray-800 rounded-tl-none"
// //                     }`}
// //                   >
// //                     <strong className="capitalize">{item.source}:</strong>{" "}
// //                     {item.text}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;





















































































































// import React, { useContext, useEffect, useState, useRef } from "react";
// import { userDataContext } from "../context/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { TbMenuOrder, TbX } from "react-icons/tb";
// import { TbArrowsCross } from "react-icons/tb";
// import { FiSend } from "react-icons/fi"; // Added for send button

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );
//   // New state for user text input
//   const [userInputText, setUserInputText] = useState("");
//   // New state to control if mic should be listening
//   const [isMicActive, setIsMicActive] = useState(true);
//   // New state to hold the SpeechRecognition object
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

//   // Scroll to bottom of conversation log
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
//     // You can customize voice, pitch, and rate here if needed
//     // utterance.rate = 1;
//     // utterance.pitch = 1;
//     synthRef.current.speak(utterance);
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
//       typingSoundRef.current.play().catch(() => {}); // Play sound, ignore if fails
//     }
//   };

//   const callGeminiAPI = async (transcript) => {
//     // 1. Pause Mic
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

//         speakAssistantResponse(data.response); // Assistant speaks the response
//         handleCommand(data);
//         setStatus("Reply shown.");
//       } else {
//         setStatus("Assistant did not return a response.");
//       }
//     } catch (error) {
//       stopTypingSound();
//       console.error("Gemini API Error:", error);
//       setStatus(
//         `Error: API failed (${
//           error.response?.status || error.message
//         }). Try again.`
//       );
//     } finally {
//       // 2. Restart Mic after a short delay to allow TTS to start
//       setTimeout(() => {
//         setIsMicActive(true);
//       }, 500);
//     }
//   };

//   // --- Handlers for user interactions ---

//   const handleLogout = async () => {
//     // Stop all speech before logging out
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
//       // Even if logout API fails, clear client side data and navigate
//       localStorage.removeItem("assistant_instructions_seen");
//       setUserData(null);
//       console.log(error);
//       navigate("/signin");
//     }
//   };

//   // New handler for text input
//   const handleTextInput = (e) => {
//     e.preventDefault();
//     const trimmedInput = userInputText.trim();
//     if (!trimmedInput) return;

//     // Add user text message to log
//     setConversationLog((prevLog) => [
//       ...prevLog,
//       { source: "user", text: trimmedInput },
//     ]);
//     setUserInputText(""); // Clear input field

//     // Check if the user's message contains the assistant's name (optional but good for consistency)
//     const assistantName = userData?.assistantName?.toLowerCase();
//     const callText = trimmedInput.toLowerCase().includes(assistantName)
//       ? trimmedInput
//       : `${assistantName}, ${trimmedInput}`;

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

//   // --- Speech Recognition Logic ---
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
//     recognitionInstance.continuous = false; // Set to false to stop after one utterance
//     recognitionInstance.lang = "en-US";
//     setRecognition(recognitionInstance);

//     recognitionInstance.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);
//       setIsMicActive(false); // Manually set to false to prevent onend restart

//       if (
//         transcript
//           .toLowerCase()
//           .includes(userData?.assistantName?.toLowerCase())
//       ) {
//         setConversationLog((prevLog) => [
//           ...prevLog,
//           { source: "user", text: transcript },
//         ]);

//         await callGeminiAPI(transcript);
//       } else {
//         setStatus(`Didn't hear "${userData?.assistantName}". Listening again...`);
//         // If wake word is not heard, mic should restart
//         setTimeout(() => {
//           setIsMicActive(true);
//         }, 500);
//       }
//     };

//     recognitionInstance.onend = function () {
//       if (isMicActive) {
//         console.log(
//           "Recognition ended (due to silence/timeout). Restarting..."
//         );
//         try {
//           setStatus("Listening...");
//           recognitionInstance.start();
//         } catch (e) {
//           console.warn("Error restarting mic from onend:", e.message);
//         }
//       } else {
//         console.log("Recognition manually stopped or waiting for API/TTS.");
//       }
//     };

//     recognitionInstance.onerror = function (e) {
//       console.error("Recognition error:", e);
//       setStatus("Mic Error. Restarting...");
//       // For general errors, try restarting the mic
//       setIsMicActive(true); // Will be handled by onend due to isMicActive=true
//     };

//     // Initial start
//     try {
//       setStatus("Listening...");
//       recognitionInstance.start();
//       setIsMicActive(true);
//     } catch (e) {
//       console.warn(
//         "Initial recognition start failed (likely already running or user hasn't interacted):",
//         e.message
//       );
//       // If start fails, ensure isMicActive is true so onend can attempt to restart
//       setIsMicActive(true);
//     }

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
//       setRecognition(null);
//     };
//   }, [userData?.assistantName, getGeminiResponse, isMicActive]); // isMicActive in dependency array to trigger logic change

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
//         handlePlayMusic(); // Play music on first interaction
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
//                 **CRITICAL:** The assistant will **only** respond if you start
//                 your query by saying its name (e.g., **"
//                 {userData?.assistantName}"**). This applies to **voice input**.
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

//       {/* Mobile Hamburger Icon & Drawer */}
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

//       {/* History Drawer */}
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

//       {/* Main Content Area */}
//       <div
//         className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
//         onClick={handlePlayMusic}
//       >
//         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />
//         {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto" /> // Music is commented out in original code, keeping it commented */}

//         <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
//           {/* Assistant Info */}
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

//           {/* Chat Window */}
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
//                 {/* Ref for auto-scrolling */}
//                 <div ref={conversationEndRef} />
//               </div>
//             </div>

//             {/* NEW: Input Box for Typing */}
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










































































































/// MIC OFF WALA CODE HAI 

// import React, { useContext, useEffect, useState, useRef } from "react";
// import { userDataContext } from "../context/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { TbMenuOrder, TbX } from "react-icons/tb";
// import { TbArrowsCross } from "react-icons/tb";
// import { FiSend } from "react-icons/fi"; // Added for send button

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );
//   // New state for user text input
//   const [userInputText, setUserInputText] = useState("");
//   // New state to control if mic should be listening
//   const [isMicActive, setIsMicActive] = useState(true);
//   // New state to hold the SpeechRecognition object
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

//   // Scroll to bottom of conversation log
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
//     // You can customize voice, pitch, and rate here if needed
//     // utterance.rate = 1;
//     // utterance.pitch = 1;
//     synthRef.current.speak(utterance);

//     // After speech is done, restart the mic
//     utterance.onend = () => {
//       setTimeout(() => {
//         setIsMicActive(true); // Restart listening after assistant finishes speaking
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
//       typingSoundRef.current.play().catch(() => {}); // Play sound, ignore if fails
//     }
//   };

//   const callGeminiAPI = async (transcript) => {
//     // 1. Pause Mic
//     if (recognition) {
//       setIsMicActive(false); // Stop auto-restarting
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

//         speakAssistantResponse(data.response); // Assistant speaks, and mic restarts in speakAssistantResponse's onend handler
//         handleCommand(data);
//         setStatus("Reply shown.");
//       } else {
//         setStatus("Assistant did not return a response.");
//         // If no response, mic should restart
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
//       // If API fails, mic should restart
//       setTimeout(() => {
//         setIsMicActive(true);
//       }, 500);
//     } 
//     // Removed finally block as mic restart is now in speakAssistantResponse.onend
//   };

//   // --- Handlers for user interactions ---

//   const handleLogout = async () => {
//     // Stop all speech before logging out
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
//       // Even if logout API fails, clear client side data and navigate
//       localStorage.removeItem("assistant_instructions_seen");
//       setUserData(null);
//       console.log(error);
//       navigate("/signin");
//     }
//   };

//   // New handler for text input
//   const handleTextInput = (e) => {
//     e.preventDefault();
//     const trimmedInput = userInputText.trim();
//     if (!trimmedInput) return;

//     // Add user text message to log
//     setConversationLog((prevLog) => [
//       ...prevLog,
//       { source: "user", text: trimmedInput },
//     ]);
//     setUserInputText(""); // Clear input field

//     // Check if the user's message contains the assistant's name (optional but good for consistency)
//     const assistantName = userData?.assistantName?.toLowerCase();
//     const callText = trimmedInput.toLowerCase().includes(assistantName)
//       ? trimmedInput
//       : `${assistantName}, ${trimmedInput}`;

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

//   // --- Speech Recognition Logic ---
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
//     recognitionInstance.continuous = false; // Set to false to stop after one utterance
//     recognitionInstance.lang = "en-US";
//     setRecognition(recognitionInstance);

//     recognitionInstance.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);
      
//       // Stop the mic immediately to prevent onend from auto-restarting
//       // before API call is initiated. The API call will handle the 'stop' in setIsMicActive(false).
//       recognitionInstance.stop(); 
//       setIsMicActive(false); 
      
//       // *** CHANGE START: NO WAKE WORD CHECK FOR VOICE INPUT ***
//       // We directly process the transcript to ensure quick response.
//       setConversationLog((prevLog) => [
//         ...prevLog,
//         { source: "user", text: transcript },
//       ]);
      
//       // Append assistant's name to transcript for context in the backend/API
//       const assistantName = userData?.assistantName;
//       const callText = `${assistantName}, ${transcript}`;

//       await callGeminiAPI(callText);
//       // *** CHANGE END ***
//     };

//     recognitionInstance.onend = function () {
//       if (isMicActive) {
//         console.log(
//           "Recognition ended (due to silence/timeout/error). Restarting..."
//         );
//         try {
//           setStatus("Listening...");
//           recognitionInstance.start();
//         } catch (e) {
//           console.warn("Error restarting mic from onend:", e.message);
//         }
//       } else {
//         console.log("Recognition manually stopped or waiting for API/TTS.");
//         setStatus("Waiting for assistant...");
//       }
//     };

//     recognitionInstance.onerror = function (e) {
//       console.error("Recognition error:", e);
//       setStatus("Mic Error. Restarting...");
//       // For general errors, try restarting the mic via onend logic
//       // Setting isMicActive to true ensures onend will attempt to restart
//       setIsMicActive(true); 
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
//       setRecognition(null);
//     };
//   }, [userData?.assistantName, getGeminiResponse, isMicActive]); 
  
//   // New useEffect to handle the mic start/stop logic based on isMicActive
//   useEffect(() => {
//     if (recognition) {
//       if (isMicActive) {
//         setStatus("Listening...");
//         // recognition.start() is now handled in onend to ensure restart loop works
//       } else {
//         // This is mainly for debugging logs, the actual stop happens in callGeminiAPI
//         console.log("Mic set to inactive.");
//       }
//     } else {
//       // Initial start logic is moved here and simplified
//       if (isMicActive) {
//           try {
//               recognition?.start();
//               setStatus("Listening...");
//           } catch (e) {
//               console.warn("Initial recognition start failed or already running:", e.message);
//           }
//       }
//     }
//   }, [isMicActive, recognition]);


//   return (
//     <div
//       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
//         handlePlayMusic(); // Play music on first interaction
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
//                 **CRITICAL:** The assistant will **always** respond if you start
//                 your query by saying its name (e.g., **"
//                 {userData?.assistantName}"**). This applies to **voice input** now also.
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

//       {/* Mobile Hamburger Icon & Drawer */}
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

//       {/* History Drawer */}
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

//       {/* Main Content Area */}
//       <div
//         className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
//         onClick={handlePlayMusic}
//       >
//         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />
//         {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto" /> // Music is commented out in original code, keeping it commented */}

//         <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
//           {/* Assistant Info */}
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

//           {/* Chat Window */}
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
//                 {/* Ref for auto-scrolling */}
//                 <div ref={conversationEndRef} />
//               </div>
//             </div>

//             {/* NEW: Input Box for Typing */}
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
import { FiSend } from "react-icons/fi"; // Added for send button

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [conversationLog, setConversationLog] = useState([]);
  const [status, setStatus] = useState(
    "Tap the mic and say your assistant's name to start."
  );
  // New state for user text input
  const [userInputText, setUserInputText] = useState("");
  // New state to control if mic should be listening
  const [isMicActive, setIsMicActive] = useState(true);
  // New state to hold the SpeechRecognition object
  const [recognition, setRecognition] = useState(null);

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

  // Scroll to bottom of conversation log
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationLog]);

  const speakAssistantResponse = (text) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    // You can customize voice, pitch, and rate here if needed
    // utterance.rate = 1;
    // utterance.pitch = 1;
    synthRef.current.speak(utterance);

    // After speech is done, restart the mic
    utterance.onend = () => {
      // Small delay to ensure resources are free before restarting mic
      setTimeout(() => {
        setIsMicActive(true); // Restart listening after assistant finishes speaking
      }, 500);
    };
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
      typingSoundRef.current.play().catch(() => {}); // Play sound, ignore if fails
    }
  };

  const callGeminiAPI = async (transcript) => {
    // 1. Pause Mic (Recognition will be stopped in onresult or here)
    if (recognition) {
      setIsMicActive(false); // Stop auto-restarting
      recognition.stop();
      console.log("Recognition stopped for API call.");
    }
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

        speakAssistantResponse(data.response); // Assistant speaks, and mic restarts in speakAssistantResponse's onend handler
        handleCommand(data);
        setStatus("Reply shown.");
      } else {
        setStatus("Assistant did not return a response.");
        // If no response, mic should restart immediately
        setTimeout(() => {
          setIsMicActive(true);
        }, 500);
      }
    } catch (error) {
      stopTypingSound();
      console.error("Gemini API Error:", error);
      setStatus(
        `Error: API failed (${
          error.response?.status || error.message
        }). Try again.`
      );
      // If API fails, mic should restart immediately
      setTimeout(() => {
        setIsMicActive(true);
      }, 500);
    }
  };

  // --- Handlers for user interactions ---

  const handleLogout = async () => {
    // Stop all speech before logging out
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    stopTypingSound();
    if (recognition) {
      setIsMicActive(false);
      recognition.stop();
    }

    try {
      localStorage.removeItem("assistant_instructions_seen");

      await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      // Even if logout API fails, clear client side data and navigate
      localStorage.removeItem("assistant_instructions_seen");
      setUserData(null);
      console.log(error);
      navigate("/signin");
    }
  };

  // New handler for text input
  const handleTextInput = (e) => {
    e.preventDefault();
    const trimmedInput = userInputText.trim();
    if (!trimmedInput) return;

    // Add user text message to log
    setConversationLog((prevLog) => [
      ...prevLog,
      { source: "user", text: trimmedInput },
    ]);
    setUserInputText(""); // Clear input field

    // Append assistant's name to transcript for context in the backend/API
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

  // --- Speech Recognition Setup & Control Logic (FIXED) ---

  // 1. Setup Recognition Object
  useEffect(() => {
    if (showInstructions) {
      localStorage.setItem("assistant_instructions_seen", "true");
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      setStatus("Error: Speech Recognition not supported.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false; // Stop after one utterance
    recognitionInstance.lang = "en-US";
    setRecognition(recognitionInstance);

    recognitionInstance.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      setStatus("Heard: " + transcript);

      // Immediately stop the mic after hearing something
      recognitionInstance.stop();
      setIsMicActive(false);

      // Add user text message to log
      setConversationLog((prevLog) => [
        ...prevLog,
        { source: "user", text: transcript },
      ]);

      // Append assistant's name to transcript for context in the backend/API
      const assistantName = userData?.assistantName;
      const callText = `${assistantName}, ${transcript}`;

      await callGeminiAPI(callText);
    };

    recognitionInstance.onend = function () {
      if (isMicActive) {
        // If mic is still active (wasn't stopped for API call), restart the listening loop
        console.log("Recognition ended. Restarting...");
        try {
          setStatus("Listening...");
          recognitionInstance.start();
        } catch (e) {
          console.warn("Error restarting mic from onend:", e.message);
        }
      } else {
        console.log("Recognition manually stopped. Waiting for command completion/TTS.");
      }
    };

    recognitionInstance.onerror = function (e) {
      console.error("Recognition error:", e);
      setStatus("Mic Error. Restarting...");
      // For general errors, try restarting the mic via onend logic
      setIsMicActive(true);
    };

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
  }, [userData?.assistantName, getGeminiResponse]); 
  
  // 2. Control Mic Start/Stop based on isMicActive
  useEffect(() => {
    if (recognition && isMicActive) {
        // This handles the initial start and restarts triggered by setIsMicActive(true)
        try {
            recognition.start();
            setStatus("Listening...");
            console.log("Mic started/restarted due to isMicActive change.");
        } catch (e) {
            // Ignore error if recognition is already running
            if (!e.message.includes("already started")) {
                console.warn("Error explicitly starting mic:", e.message);
            }
        }
    } else if (recognition && !isMicActive) {
        // Mic stop is handled by recognitionInstance.stop() in callGeminiAPI or onresult
        setStatus("Waiting for assistant...");
    }
  }, [isMicActive, recognition]);


  return (
    <div
      className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
      onClick={() => {
        setHasInteracted(true);
        setShowInstructions(false);
        handlePlayMusic(); // Play music on first interaction
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

      {/* Header/Nav */}
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

      {/* Mobile Hamburger Icon & Drawer */}
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

      {/* History Drawer */}
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

      {/* Main Content Area */}
      <div
        className="w-full p-5 pt-0 lg:p-10 lg:pt-5"
        onClick={handlePlayMusic}
      >
        <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />
        {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto" /> // Music is commented out in original code, keeping it commented */}

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
          {/* Assistant Info */}
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

          {/* Chat Window */}
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
                {/* Ref for auto-scrolling */}
                <div ref={conversationEndRef} />
              </div>
            </div>

            {/* NEW: Input Box for Typing */}
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