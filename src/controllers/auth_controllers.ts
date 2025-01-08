import { NextFunction, Request, Response } from 'express';
import UserModel from '../models/user_models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => { 
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({
                email: req.body.email,
                password: hashedPassword,
            }
        );
        res.status(200).send(user);
    }catch(error){
        res.status(400).send(error);
    }
};

const login = async (req: Request, res: Response) => { 
    try{
    const user = await UserModel.findOne({email: req.body.email});
    if(!user){
        res.status(400).send("wrong username or password");
        return;
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        res.status(400).send("wrong username or password");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Bad Request: TOKEN_SECRET is missing");
        return;
    }
    const token = jwt.sign({ _id: user._id }, 
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });
        res.status(200).send({token: token, _id: user._id});
    }catch(error){
        res.status(400).send(error); 
    }
};

const logout = async (req:Request, res:Response) => { 
    res.status(200).send("Logged out");
};

type Payload = {
    _id: string;    
};
export const authMiddleware = (req:Request, res:Response, next:NextFunction) => { 
    const authorization = req.header('authorization');
    const token = authorization && authorization.split(' ')[1];

    if (!token) {
        res.status(401).send("Access Denied");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Bad Request: TOKEN_SECRET is missing");
        return;
    }
    
    jwt.verify(token, process.env.TOKEN_SECRET, (error,  payload) => {
        if (error) {
            res.status(401).send("Access Denied");
            return;
        }
        req.body._id = (payload as Payload)._id;
        next();
    });
};   

export default {
    register,
    login,
    logout,
};