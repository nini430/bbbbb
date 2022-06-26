const express=require("express");
const router=express.Router();
const {LoginUser,RegisterUser}=require("../controllers/User");


router.post("/register",RegisterUser)
router.post("/login",LoginUser);

module.exports=router;