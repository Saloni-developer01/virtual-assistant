import React, { useContext, useState } from 'react';
import bg from '../assets/authBg.jpg';
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useNavigate} from 'react-router-dom';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';


function SignIn (){

    const [showPassword, setShowPassword] = useState(false);
    const {serverUrl, userData, setUserData} = useContext(userDataContext);
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignIn = async (e)=>{
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signin`, {
                 email, password
            }, {withCredentials: true})
            setUserData(result.data);
            setLoading(false);
            navigate("/");
            setEmail("");
            setPassword("");
        } catch (error) {
            setUserData(null);
            setLoading(false);
            console.log(error);
            setError(error.response.data.message);
        }
    }

    return (
        <div className='w-full min-h-[100vh] bg-cover bg-no-repeat lg:bg-[center_bottom_41%] flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>

            <form className='w-[90%] h-[580px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-blue-950 flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSignIn}>

                
            <h1 className='text-white text-[30px] font-bold mb-[30px]'>Sign in to <span className='text-blue-400 text-bolder'>Virtual Assistant</span></h1>

            <input type='email' placeholder='Email' className='w-full h-[55px] outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-[20px] py-[10px] rounded-lg text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email}/>

            <div className='w-full h-[55px] border-2 border-white bg-transparent text-white rounded-lg text-[18px] relative'>
                <input type={showPassword? "text":"password"} placeholder='Password' className='w-full h-full rounded-lg outline-none bg-transparent placeholder-grey-300 px-[20px] py-[10px]' required onChange={(e) => setPassword(e.target.value)} value={password}/>

                {!showPassword && <IoIosEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPassword(true)}/>}

                {showPassword && <IoIosEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' onClick={()=> setShowPassword(false)}/>}
                
            </div>

            {error.length > 0 && <p className='text-red-500 text-[18px] bg-white'>*{error}</p>}
            <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-lg text-[19px]' disabled={loading}>{loading? "Loading...":"Sign In"}</button>

            <p className='text-[white] text-[18px] cursor-pointer' onClick={()=> navigate("/signup")}>Want to create a new account ? <span className='text-blue-300 text-bolder '>Sign Up</span></p>

            </form>
        </div>
    );
}

export default SignIn;
