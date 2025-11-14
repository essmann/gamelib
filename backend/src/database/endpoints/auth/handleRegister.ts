import User from "../../models/user/user";
import { Response } from "express";
async function handleRegister(res : Response, username : string, email : string, encryptedPassword : string ){

    let userExists = await User.findOne({where: {
        email: email
    }})
    if(userExists == null){
        
    }
    else{
        console.log("User already exists in the database.");
        res.status(409).json({error: "User already exists in database."});
    }
}

export default handleRegister;