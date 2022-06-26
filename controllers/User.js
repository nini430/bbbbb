const User =require("../models/User");
const {BadRequestError,UnauthenticatedError}=require("../errors");
const {StatusCodes}=require("http-status-codes");


const RegisterUser=async(req,res)=>{
    const user=await User.create({...req.body});
    const token=await user.createJWT();
    res.status(StatusCodes.CREATED).json({token,user:{name:user.name,user}});
    
}

const LoginUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password) {
        throw new BadRequestError("Please provide email and password")
    }

    const user=await User.findOne({email:email});
    if(!user) {
        throw new UnauthenticatedError("no user is found with this E-mail");
    }
    console.log(user);
    const isPasswordCorrect=await user.comparePassword(password);

    if(!isPasswordCorrect) {
        throw new UnauthenticatedError("password is not correct");
    }

    const token=await user.createJWT();

    return res.status(StatusCodes.OK).json({token,user:{name:user.name}})




}

module.exports={RegisterUser,LoginUser};

