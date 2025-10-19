// import React, { useContext, useEffect, useState, useRef } from "react";
// import { userDataContext } from "../context/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { TbMenuOrder } from "react-icons/tb";
// import { TbArrowsCross, TbX } from "react-icons/tb";

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );

//   const [hasInteracted, setHasInteracted] = useState(false);

//   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

//   const [showInstructions, setShowInstructions] = useState(() => {
//     const hasSeenInstructions = localStorage.getItem(
//       "assistant_instructions_seen"
//     );
//     return hasSeenInstructions !== "true";
//   });

//   const [hamburgerOpen, setHamburgerOpen] = useState(false);

//   const backgroundMusicRef = useRef(null);
//   const typingSoundRef = useRef(null);

//   const handleLogout = async () => {
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
//     }
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

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";

//     let shouldRestart = true;

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);

//       if (
//         transcript
//           .toLowerCase()
//           .includes(userData?.assistantName?.toLowerCase())
//       ) {
//         setConversationLog((prevLog) => [
//           ...prevLog,
//           { source: "user", text: transcript },
//         ]);
//         setStatus("Thinking...");

//         shouldRestart = false;
//         recognition.stop();
//         console.log("Recognition stopped for API call.");

//         try {
//           if (typingSoundRef.current) {
//             typingSoundRef.current.loop = true;
//             typingSoundRef.current.play().catch(() => {});
//           }

//           const data = await getGeminiResponse(transcript);

//           if (typingSoundRef.current) {
//             typingSoundRef.current.pause();
//             typingSoundRef.current.currentTime = 0;
//           }

//           if (data && data.response) {
//             setConversationLog((prevLog) => [
//               ...prevLog,
//               { source: "assistant", text: data.response },
//             ]);

//             handleCommand(data);

//             shouldRestart = true;
//             setStatus("Reply shown. Restarting mic...");
//             recognition.start();
//           } else {
//             setStatus("Assistant did not return a response.");
//             shouldRestart = true;
//             recognition.start();
//           }
//         } catch (error) {
//           if (typingSoundRef.current) {
//             typingSoundRef.current.pause();
//             typingSoundRef.current.currentTime = 0;
//           }

//           console.error("Gemini API Error:", error);
//           setStatus(
//             `Error: API failed (${
//               error.response?.status || error.message
//             }). Restarting mic...`
//           );

//           shouldRestart = true;
//           recognition.start();
//         }
//       }
//     };

//     recognition.onend = function () {
//       if (shouldRestart) {
//         console.log(
//           "Recognition ended (due to silence/timeout). Restarting..."
//         );
//         try {
//           setStatus("Listening...");
//           recognition.start();
//         } catch (e) {
//           console.warn("Error restarting mic from onend:", e.message);
//         }
//       } else {
//         console.log("Manual stop. Waiting for API response.");
//       }
//     };

//     try {
//       setStatus("Starting mic...");
//       recognition.start();
//     } catch (e) {
//       console.warn(
//         "Initial recognition start failed (likely already running):",
//         e.message
//       );
//       setStatus("Listening...");
//     }

//     return () => {
//       shouldRestart = false;
//       recognition.stop();
//       if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
//       if (typingSoundRef.current) typingSoundRef.current.pause();
//     };
//   }, [userData?.assistantName, hasInteracted, getGeminiResponse]);

//   return (
//     <div
//       className="bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-y-hidden "
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
//       }}
//     >
//       {showInstructions && (
//         <div className="fixed inset-0 bg-[#00000020] backdrop-blur-lg flex items-center justify-center z-50">
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
//                 {userData?.assistantName}"**).
//               </li>
//               <li>
//                 If you speak, but the assistant doesn't reply, check the status
//                 below its name — it will show exactly what the mic **'Heard'**.
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
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
//             >
//               <TbArrowsCross className=" w-[20px] h-[25px]" />
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="w-full h-[12vh] flex align-center justify-left gap-[20px]">
//         <button
//           className="min-w-[150px] h-[50px] mt-[20px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hidden lg:block absolute  right-[350px]"
//           onClick={() => {
//             navigate("/customize");
//           }}
//         >
//           Customize your Assistant
//         </button>

//         <button
//           className="min-w-[150px] h-[50px] mt-[20px] text-black font-semibold bg-white rounded-lg text-[19px] px-[20px] py-[10px] cursor-pointer hidden lg:block absolute right-[190px]"
//           onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
//         >
//           History
//         </button>

//         <button
//           className="min-w-[150px] h-[50px] mt-[20px] text-black font-semibold bg-white rounded-lg text-[19px] cursor-pointer hidden lg:block absolute right-[20px]"
//           onClick={handleLogout}
//         >
//           Log Out
//         </button>
//       </div>

//       <TbMenuOrder
//         className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] "
//         onClick={() => setHamburgerOpen(true)}
//       />

//       <div
//         className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
//           hamburgerOpen ? "traslate-x-0" : "translate-x-[200%]"
//         } lg:translate-x-0 transition-transform duration-800 ease-in-out z-50`}
//       >
//         <TbArrowsCross
//           className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] "
//           onClick={() => setHamburgerOpen(false)}
//         />

//         <button
//           className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-lg text-[19px] cursor-pointer "
//           onClick={handleLogout}
//         >
//           Log Out
//         </button>

//         <button
//           className="min-w-[150px] h-[50px]  text-black font-semibold bg-white rounded-lg text-[19px]  px-[20px] py-[10px] cursor-pointer "
//           onClick={() => {
//             navigate("/customize");
//           }}
//         >
//           Customize your Assistant
//         </button>

//         <h1 className="text-white font-semibold text-[19px] mt-[30px]">
//           History
//         </h1>
//         <div className="w-full h-[2px] bg-gray-400"></div>

//         <div className="w-full h-[60%] overflow-y-auto flex flex-col gap-[15px] p-1">
//           {userData?.history?.length === 0 ? (
//             <p className="text-gray-400 mt-4 text-sm">
//               No past conversations found.
//             </p>
//           ) : (
//             userData?.history
//               ?.slice()
//               .reverse()
//               .map((item, index) => (
//                 <div
//                   key={index}
//                   className="bg-[#2D2D2D] p-3 rounded-lg border-l-4 border-[#48A1B1] shadow-md"
//                 >
//                   <p className="text-white text-sm font-semibold mb-1">
//                     You:
//                     <span className="text-gray-300 font-normal ml-2">
//                       {item.user}
//                     </span>
//                   </p>
//                   <p className="text-white text-sm font-semibold mt-2">
//                     {userData?.assistantName}:
//                     <span className="text-gray-400 font-normal ml-2 line-clamp-2">
//                       {item.assistant}
//                     </span>
//                   </p>
//                 </div>
//               ))
//           )}
//         </div>
//       </div>

//       {showHistoryDrawer && (
//         <div
//           className="absolute top-0 right-0 h-full w-[350px] 
//      bg-white backdrop-blur-lg 
//      border-l border-white/20 
//      z-40 p-5 shadow-2xl transition-transform duration-300 ease-in-out 
//      lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
//         >
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-[#5A655A]">
//               Conversation History
//             </h2>
//             <TbX
//               className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400"
//               onClick={() => setShowHistoryDrawer(false)}
//             />
//           </div>
//           <div className="w-full h-[90%] overflow-y-auto flex flex-col gap-[15px] p-1">
//             {userData?.history?.length === 0 ? (
//               <p className="text-gray-400 mt-4 text-sm">
//                 No past conversations found.
//               </p>
//             ) : (
//               userData?.history
//                 ?.slice()
//                 .reverse()
//                 .map((item, index) => (
//                   <div
//                     key={index}
//                     className=" bg-[#01A6F0] p-3 rounded-lg 
     
//      shadow-lg hover:bg-white/10 transition-colors rounded-lg border-l-4 border-[#F78B00] shadow-md"
//                   >
//                     <p className="text-grey text-sm font-bold mb-1">
//                       You:
//                       <span className="text-gray-700 font-normal ml-2">
//                         {item.user}
//                       </span>
//                     </p>
//                     <p className="text-grey text-sm font-bold mt-2">
//                       {userData?.assistantName}:
//                       <span className="text-gray-700 font-normal ml-2 line-clamp-2">
//                         {item.assistant}
//                       </span>
//                     </p>
//                   </div>
//                 ))
//             )}
//           </div>
//         </div>
//       )}

//       <div
//         className="w-full min-h-[100vh] gap-[15px] p-5 overflow-hidden "
//         onClick={handlePlayMusic}
//       >
//         {/* <audio ref={backgroundMusicRef} src="/sounds/background.mp3" preload="auto"/> */}
//         <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />

//         <div className="flex flex-wrap gap-[100px] min-h-[100vh] pl-10 sm:flex-nowrap lg:flex-nowrap lg:justify-start lg:items-start sm:justify-center sm:items-center xs:justify-center xs:items-center">
//           <div>
//             <div className="w-[200px] h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[20px] ">
//               <img
//                 src={userData?.assistantImage}
//                 alt="Assistant Image"
//                 className="h-full w-full object-cover"
//               />
//             </div>

//             <h1 className="text-white text-[20px] font-semibold text-center mt-4">
//               I'm {userData?.assistantName}
//             </h1>
//             <p className="text-[#F78B00] text-[17px] font-medium mt-4 text-center max-w-[195px]">
//               {status}
//             </p>
//           </div>

//           <div>
//             <div className=" p-[30px] bg-[white] bg-opacity-10 rounded-lg p-3 overflow-y-auto mt-4 space-y-5  w-[70vw] h-[60vh] lg:w-[2000px] lg:max-w-[700px] lg:h-[500px] bg-white bg-opacity-5 rounded-lg p-3 overflow-y-auto mt-4 lg:mt-0 space-y-3 border border-[#FF3366]/20 backdrop-blur-sm">
//               {conversationLog.length === 0 && (
//                 <div className="absolute flex items-center justify-center pointer-events-none">
//                   <p className="text-gray-500 text-lg font-medium select-none sm:text-lg">
//                     Your conversations will appear here. Start by saying: "
//                     {userData?.assistantName}..."
//                   </p>
//                 </div>
//               )}

//               {conversationLog.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     item.source === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-2 rounded-lg max-w-[70%] ${
//                       item.source === "user"
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 text-gray-800"
//                     }`}
//                   >
//                     <strong className="capitalize">{item.source}:</strong>{" "}
//                     {item.text}
//                   </div>
//                 </div>
//               ))}
//             </div>
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

// function Home() {
//   const { userData, serverUrl, setUserData, getGeminiResponse } =
//     useContext(userDataContext);
//   const navigate = useNavigate();

//   const [conversationLog, setConversationLog] = useState([]);
//   const [status, setStatus] = useState(
//     "Tap the mic and say your assistant's name to start."
//   );

//   const [hasInteracted, setHasInteracted] = useState(false);

//   const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

//   const [showInstructions, setShowInstructions] = useState(() => {
//     const hasSeenInstructions = localStorage.getItem(
//       "assistant_instructions_seen"
//     );
//     return hasSeenInstructions !== "true";
//   });

//   const [hamburgerOpen, setHamburgerOpen] = useState(false);

//   const backgroundMusicRef = useRef(null);
//   const typingSoundRef = useRef(null);

//   const handleLogout = async () => {
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
//     }
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

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";

//     let shouldRestart = true;

//     recognition.onresult = async (e) => {
//       const transcript = e.results[e.results.length - 1][0].transcript.trim();
//       setStatus("Heard: " + transcript);

//       if (
//         transcript
//           .toLowerCase()
//           .includes(userData?.assistantName?.toLowerCase())
//       ) {
//         setConversationLog((prevLog) => [
//           ...prevLog,
//           { source: "user", text: transcript },
//         ]);
//         setStatus("Thinking...");

//         shouldRestart = false;
//         recognition.stop();
//         console.log("Recognition stopped for API call.");

//         try {
//           if (typingSoundRef.current) {
//             typingSoundRef.current.loop = true;
//             typingSoundRef.current.play().catch(() => {});
//           }

//           const data = await getGeminiResponse(transcript);

//           if (typingSoundRef.current) {
//             typingSoundRef.current.pause();
//             typingSoundRef.current.currentTime = 0;
//           }

//           if (data && data.response) {
//             setConversationLog((prevLog) => [
//               ...prevLog,
//               { source: "assistant", text: data.response },
//             ]);

//             handleCommand(data);

//             shouldRestart = true;
//             setStatus("Reply shown. Restarting mic...");
//             recognition.start();
//           } else {
//             setStatus("Assistant did not return a response.");
//             shouldRestart = true;
//             recognition.start();
//           }
//         } catch (error) {
//           if (typingSoundRef.current) {
//             typingSoundRef.current.pause();
//             typingSoundSoundRef.current.currentTime = 0;
//           }

//           console.error("Gemini API Error:", error);
//           setStatus(
//             `Error: API failed (${
//               error.response?.status || error.message
//             }). Restarting mic...`
//           );

//           shouldRestart = true;
//           recognition.start();
//         }
//       }
//     };

//     recognition.onend = function () {
//       if (shouldRestart) {
//         console.log(
//           "Recognition ended (due to silence/timeout). Restarting..."
//         );
//         try {
//           setStatus("Listening...");
//           recognition.start();
//         } catch (e) {
//           console.warn("Error restarting mic from onend:", e.message);
//         }
//       } else {
//         console.log("Manual stop. Waiting for API response.");
//       }
//     };

//     try {
//       setStatus("Starting mic...");
//       recognition.start();
//     } catch (e) {
//       console.warn(
//         "Initial recognition start failed (likely already running):",
//         e.message
//       );
//       setStatus("Listening...");
//     }

//     return () => {
//       shouldRestart = false;
//       recognition.stop();
//       if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
//       if (typingSoundRef.current) typingSoundRef.current.pause();
//     };
//   }, [userData?.assistantName, hasInteracted, getGeminiResponse]);

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
//       onClick={() => {
//         setHasInteracted(true);
//         setShowInstructions(false);
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
//                 {userData?.assistantName}"**).
//               </li>
//               <li>
//                 If you speak, but the assistant doesn't reply, check the status
//                 below its name — it will show exactly what the mic **'Heard'**.
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
//               }}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
//             >
//               <TbArrowsCross className="w-[20px] h-[25px]" />
//             </button>
//           </div>
//         </div>
//       )}

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

//       {/* 3. Mobile Hamburger Icon */}
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
//           ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`
//         }
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
//               setShowHistoryDrawer(!showHistoryDrawer);
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
//             className="fixed inset-0 bg-[#48A1B1] bg-opacity-30 z-40" 
//             onClick={() => setShowHistoryDrawer(false)}
//         >
//           <div
//             className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-[400px] 
//             bg-white backdrop-blur-lg 
//             border-l border-white/20 
//             z-50 p-5 shadow-2xl transition-transform duration-300 ease-in-out 
//             lg:bg-gradient-to-br lg:from-white/10 lg:to-[#48A1B1]/30"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-[#5A655A]">
//                 Conversation History
//               </h2>
//               <TbX 
//                 className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-50"
//                 onClick={() => setShowHistoryDrawer(false)}
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

//           <div className="w-full max-w-4xl lg:max-w-[700px] p-4 md:p-[30px] bg-white bg-opacity-10 rounded-lg overflow-y-auto h-[65vh] lg:h-[500px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
//             {conversationLog.length === 0 && (
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
//                   Your conversations will appear here. Start by saying: "
//                   <strong className="text-gray-500">{userData?.assistantName}</strong>..."
//                 </p>
//               </div>
//             )}

//             <div className="space-y-4">
//               {conversationLog.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`flex ${
//                     item.source === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`p-3 rounded-xl max-w-[80%] md:max-w-[70%] text-sm md:text-base shadow-md ${
//                       item.source === "user"
//                         ? "bg-blue-500 text-white rounded-br-none"
//                         : "bg-gray-200 text-gray-800 rounded-tl-none"
//                     }`}
//                   >
//                     <strong className="capitalize">{item.source}:</strong>{" "}
//                     {item.text}
//                   </div>
//                 </div>
//               ))}
//             </div>
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

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [conversationLog, setConversationLog] = useState([]);
  const [status, setStatus] = useState(
    "Tap the mic and say your assistant's name to start."
  );

  const [hasInteracted, setHasInteracted] = useState(false);

  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  const [showInstructions, setShowInstructions] = useState(() => {
    const hasSeenInstructions = localStorage.getItem(
      "assistant_instructions_seen"
    );
    return hasSeenInstructions !== "true";
  });

  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const backgroundMusicRef = useRef(null);
  const typingSoundRef = useRef(null);

  const handleLogout = async () => {
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
    }
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

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    let shouldRestart = true;

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      setStatus("Heard: " + transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData?.assistantName?.toLowerCase())
      ) {
        setConversationLog((prevLog) => [
          ...prevLog,
          { source: "user", text: transcript },
        ]);
        setStatus("Thinking...");

        shouldRestart = false;
        recognition.stop();
        console.log("Recognition stopped for API call.");

        try {
          if (typingSoundRef.current) {
            typingSoundRef.current.loop = true;
            typingSoundRef.current.play().catch(() => {});
          }

          const data = await getGeminiResponse(transcript);

          if (typingSoundRef.current) {
            typingSoundRef.current.pause();
            typingSoundRef.current.currentTime = 0;
          }

          if (data && data.response) {
            setConversationLog((prevLog) => [
              ...prevLog,
              { source: "assistant", text: data.response },
            ]);

            handleCommand(data);

            shouldRestart = true;
            setStatus("Reply shown. Restarting mic...");
            recognition.start();
          } else {
            setStatus("Assistant did not return a response.");
            shouldRestart = true;
            recognition.start();
          }
        } catch (error) {
          if (typingSoundRef.current) {
            typingSoundRef.current.pause();
            // FIX: Removed the typo 'typingSoundSoundRef' and corrected it to 'typingSoundRef'
            typingSoundRef.current.currentTime = 0; 
          }

          console.error("Gemini API Error:", error);
          setStatus(
            `Error: API failed (${
              error.response?.status || error.message
            }). Restarting mic...`
          );

          shouldRestart = true;
          recognition.start();
        }
      }
    };

    recognition.onend = function () {
      if (shouldRestart) {
        console.log(
          "Recognition ended (due to silence/timeout). Restarting..."
        );
        try {
          setStatus("Listening...");
          recognition.start();
        } catch (e) {
          console.warn("Error restarting mic from onend:", e.message);
        }
      } else {
        console.log("Manual stop. Waiting for API response.");
      }
    };

    try {
      setStatus("Starting mic...");
      recognition.start();
    } catch (e) {
      console.warn(
        "Initial recognition start failed (likely already running):",
        e.message
      );
      setStatus("Listening...");
    }

    return () => {
      shouldRestart = false;
      recognition.stop();
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      if (typingSoundRef.current) typingSoundRef.current.pause();
    };
  }, [userData?.assistantName, hasInteracted, getGeminiResponse]);

  return (
    <div
      className="min-h-screen bg-gradient-to-t from-[#fffff] to-[#48A1B1] overflow-x-hidden relative"
      onClick={() => {
        setHasInteracted(true);
        setShowInstructions(false);
      }}
    >
      {/* 1. Instructions Modal (No changes) */}
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
                **CRITICAL:** The assistant will **only** respond if you start
                your query by saying its name (e.g., **"
                {userData?.assistantName}"**).
              </li>
              <li>
                If you speak, but the assistant doesn't reply, check the status
                below its name — it will show exactly what the mic **'Heard'**.
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
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-3xl font-light cursor-pointer"
            >
              <TbArrowsCross className="w-[20px] h-[25px]" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Desktop Navigation (Top Right Buttons) */}
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

      {/* 3. Mobile Hamburger Icon */}
      <TbMenuOrder
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[35px] h-[35px] cursor-pointer z-50"
        onClick={() => setHamburgerOpen(true)}
      />

      {/* 4. Mobile Menu Drawer (Hamburger Menu) */}
      <div
        className={`fixed lg:hidden top-0 right-0 w-3/4 max-w-[300px] h-full 
          bg-[#48A1B1] bg-opacity-90 backdrop-blur-md 
          p-5 flex flex-col gap-5 
          z-50 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${hamburgerOpen ? "translate-x-0" : "translate-x-full"}`
        }
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
            className="fixed inset-0 bg-white backdrop-blur-lg bg-transparent z-[60]" 
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
                className="text-[#5A655A] w-8 h-8 cursor-pointer hover:text-red-400 z-[80]" // Increased z-index
                onClick={() => {
                  // FIX: Small screen par cross icon click karne par history drawer band hoga
                  setShowHistoryDrawer(false); 
                  // Hamburger menu ki state ko yahan affect nahi karna hai.
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

      {/* 6. Main Content Area */}
      <div
        className="w-full p-5 pt-0 lg:p-10 lg:pt-5" 
        onClick={handlePlayMusic}
      >
        <audio ref={typingSoundRef} src="/sounds/typing.mp3" preload="auto" />

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[100px] justify-center lg:justify-start items-center lg:items-start min-h-[calc(100vh-12vh)] lg:min-h-[calc(100vh-12vh-40px)]">
          
          {/* Assistant Info Column (Image is now rounded-md as requested) */}
          <div className="flex flex-col items-center lg:items-start mt-10 lg:mt-0">
            <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex overflow-hidden shadow-lg shadow-[white] p-[10px] rounded-md"> 
              <img
                src={userData?.assistantImage}
                alt="Assistant Image"
                className="h-full w-full object-cover rounded-md" // rounded-md confirmed
              />
            </div>

            <h1 className="text-white text-[22px] font-bold text-center mt-4">
              I'm {userData?.assistantName}
            </h1>
            <p className="text-[#F78B00] text-[17px] font-medium mt-2 text-center max-w-[200px]">
              {status}
            </p>
          </div>

          {/* Chat Log/Conversation Area */}
          <div className="w-full max-w-4xl lg:max-w-[700px] p-4 md:p-[30px] bg-white bg-opacity-10 rounded-lg overflow-y-auto h-[65vh] lg:h-[500px] border border-[#FF3366]/20 backdrop-blur-sm shadow-xl">
            {conversationLog.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-lg font-medium text-center p-4 select-none">
                  Your conversations will appear here. Start by saying: "
                  <strong className="text-gray-500">{userData?.assistantName}</strong>..."
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;