import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


function Customize2 () {
    const {userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
    const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdateAssistant = async () =>{
        setLoading(true);
        try {
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if(backendImage){
                formData.append("assistantImage", backendImage);
            }else{
                formData.append("imageUrl", selectedImage);
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials: true});

            setLoading(false);
            // console.log(result.data);
            setUserData(result.data);
            navigate("/");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className='w-full min-h-[100vh] bg-gradient-to-t from-[#fffff] to-[#48A1B1] flex justify-center items-center flex-col p-[20px] relative'>

            <IoArrowBackSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=> navigate("/customize")}/>

            <h1 className='text-white mb-[30px] text-[30px] text-center'>Select your <span className='text-[#01A6F0]'>Assistant Name</span></h1>

            <input type='text' placeholder='eg: Aura' className='w-full max-w-[600px] h-[55px] outline-none border-2border-white bg-transparent text-white placeholder-white px-[20px] py-[10px] rounded-lg text-[18px] border-3 border-white' required onChange={(e)=> setAssistantName(e.target.value)} value={assistantName}/>

            {assistantName &&
            <button className='min-w-[200px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-lg text-[19px] cursor-pointer ' disabled={loading} onClick={()=> {
                handleUpdateAssistant()
            }}>{!loading? "Create your Assistant": "Loading..."}</button>
            }

        </div>
    );
}

export default Customize2;
