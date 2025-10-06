import jwt from 'jsonwebtoken';

const genToke = async (userId)=>{
    try {
        const token = await jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"10d"})
        return token
    } catch (error) {
        console.log(error);
    }
}

export default genToke;