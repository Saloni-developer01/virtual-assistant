import React, { useContext, useRef, useState } from 'react';
import Card from '../components/Card';
import image1 from "../assets/img1.jpg";
import image2 from "../assets/img2.jpg";
import image3 from "../assets/img3.webp";
import image4 from "../assets/img4.png";
import image5 from "../assets/img5.jpg";
import image6 from "../assets/img6.jpg";
import image7 from "../assets/img7.jpeg";
import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from "react-icons/io5";


function Customize () {

    const {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} = useContext(userDataContext);

    const navigate = useNavigate();
    const inputImage = useRef();

    const handleImage = (e) =>{
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file));
    }

    return (
        <div className='w-full min-h-[100vh] bg-gradient-to-t from-[#fffff] to-[#48A1B1] flex justify-center items-center flex-col p-[20px]'>

            <IoArrowBackSharp className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=> navigate("/")}/>

            <h1 className='text-white mb-[30px] text-[30px] text-center'>Select your <span className='text-blue-200'>Assistant Image</span></h1>
            <div className='w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px] '>
                <Card image={image1}/>
                <Card image={image2}/>
                <Card image={image3}/>
                <Card image={image4}/>
                <Card image={image5}/>
                <Card image={image6}/>
                <Card image={image7}/>

                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#4DA4B3] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black-950 cursor-pointer hover:border-3 hover:border-white flex items-center justify-center ${selectedImage == "input"? " border-3 border-white shadow-2xl shadow-white-950" : null}`} onClick={()=> {
                    inputImage.current.click()
                    setSelectedImage("input")
                }}>
                    {!frontendImage && <RiImageAddFill className='text-white w-[25px] h-[25px]'/>}
                    {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
                </div>
        
                <input type='file' accept='image/*' ref={inputImage} hidden onChange={handleImage}/>

            </div>

            {selectedImage && 
             <button className='min-w-[150px] h-[50px] mt-[30px] text-black font-semibold bg-white rounded-lg text-[19px] cursor-pointer border-2 border-[#5E6267]' onClick={()=> navigate("/customize2")}>Next</button>
            }

        </div>
    );
}

export default Customize;
