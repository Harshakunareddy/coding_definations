const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');
const { BCRYPT_SALT_ROUNDS, JWT_SECRET, JWT_EXPIRE } = require('../../config/auth.config');

const Signup = async (req) => {
    const existingUser = await User.findOne({
        where: { email:req.email }
    });

    if(existingUser){
        throw new Error("Email Already Exists");
    }
    const hashedPassword = await bcrypt.hash(req.password, BCRYPT_SALT_ROUNDS);

    const user_created = await User.create({
        name: req.name,
        email: req.email,
        role: "user",
        password: hashedPassword,
    });

    return user_created;
}


const SignupAdmin = async (req) => {
    const existingUser = await User.findOne({
        where: { email:req.email }
    });

    if(existingUser){
        throw new Error("Email Already Exists");
    }
    const hashedPassword = await bcrypt.hash(req.password, BCRYPT_SALT_ROUNDS);

    const user_created = await User.create({
        name: req.name,
        email: req.email,
        role: "admin",
        password: hashedPassword,
    });

    return user_created;
}


const login = async (req) => {
    const user_exists = await User.findOne({
        where: {email: req.email}
    });

    if(!user_exists){
        throw new Error("User Not Found");
    }

    const password_matched = await bcrypt.compare(
        req.password, user_exists.password
    )

    if(!password_matched){
        throw new Error("Password Incorrect");
    }
    
    if(user_exists.role !== req.role){
        throw new Error("you dont have access to login as "+ req.role);
    }
    
    const token = jwt.sign(
        {
            id: user_exists.id,
            email: user_exists.email,
        }, JWT_SECRET, {expiresIn: JWT_EXPIRE}
    )

    return {
        token,
        token_type: "Bearer",
        expires_in: JWT_EXPIRE,
        user: {
            id: user_exists.id,
            email: user_exists.email,
            role: user_exists.role,
        },
    }
}

module.exports = {Signup,login,SignupAdmin};