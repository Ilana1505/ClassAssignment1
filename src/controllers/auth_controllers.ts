import { Request, Response } from 'express';
import userModel from '../models/user_models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create(
            {
                email: req.body.email,
                password: hashedPassword,
            }
        );
        res.status(200).send(user);
    } catch(err){
        res.status(400).send(err);
    }   
    res.status(400).send();
};

const login = async (req: Request, res: Response) => {
   try{
       const user = await userModel.findOne({ email: req.body.email });
       if (!user) {
           res.status(400).send("wrong username or password");
           return;
       }
       const validPassword = await bcrypt.compare(req.body.password, user.password);
       if (!validPassword) {
           res.status(400).send("wrong username or password");
           return;
       }
       const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET as string);

   }catch(err){
    res.status(400).send(err);
   }
};

export default { register, login };
