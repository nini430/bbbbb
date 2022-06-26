const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Must provide name"],
        minlength:4,
        maxLength:20

    },

    email:{
        type:String,
        required:[true,"must provide email"],
        minLength:10,
        maxLength:50,
        unique:true,
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"enter valid E-mail"]
    },

    password:{
        type:String,
        required:[true,"must provide password"],
        minLength:6
    }
}


)

UserSchema.pre("save",async function() {
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

UserSchema.methods.createJWT=function() {
    return jwt.sign({userId:this._id,name:this.name},"jwtSecret",{expiresIn:"30d"})
}

UserSchema.methods.comparePassword=async function(candidatePassword) {
    const isMatch=await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

module.exports=mongoose.model("User",UserSchema);