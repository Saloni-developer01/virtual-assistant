# 🗣️ Virtual Voice Assistant (VVA) Application

**Project Overview:** A cutting-edge Virtual Voice Assistant (VVA) application that provides users with a hands-free, real-time conversational experience. Built using the **MERN stack** (MongoDB, Express, React, Node.js) and integrated with modern Web Speech APIs for seamless interaction.

---

## ✨ Key Features

* **📱 Fully Responsive Design:** The application is built with responsive principles, ensuring a smooth and consistent user experience across **desktop, tablet, and mobile devices**.
* **🎙️ Hands-Free Interaction:** Utilizes browser-native **Speech Recognition** to continuously listen and process user commands without requiring a specific wake word.
* **🗣️ Real-time TTS (Text-to-Speech):** Provides natural and human-like voice replies using the TTS API, enhancing the conversational flow.
* **🧠 Intelligent Response System:** Integrated with the **Gemini API** for generating highly intelligent, context-aware, and accurate answers to diverse queries.
* **🛡️ Optimized Stability:** Features robust error handling, especially for "aborted" mic events and loop issues, ensuring **stable and uninterrupted performance** even during high-frequency micro-interactions.
* **🌐 Command Execution:** Capable of executing system-level actions like initiating searches on Google, YouTube, or navigating to popular social media platforms.
* **🔒 Secure Authentication:** Implements secure user sign-up and sign-in functionality.
* **📊 Conversation History:** Maintains a personalized log of past conversations for user reference.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **React:** For dynamic and reactive user interface development.
* **Context API:** Efficient state management across components.
* **Web Speech API:** Core component for voice-to-text and text-to-voice functionality.
* **CSS Framework (Tailwind/Bootstrap if used):** For responsive styling.

### Backend (Server)
* **Node.js & Express.js:** Robust server-side logic and API handling.
* **MongoDB & Mongoose:** Database for storing user profiles and history data.
* **Gemini API:** AI model integration for natural language processing and response generation.
* **JWT (JSON Web Tokens):** For secure, stateless user authentication.

---

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Instance (Local or cloud service like MongoDB Atlas)

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install server dependencies
npm install

# Create a .env file and configure environment variables
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key

# Start the backend server
npm start