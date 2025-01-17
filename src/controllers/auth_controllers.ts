import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user_models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type TokenPayload = {
    _id: string;
};

const Register = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("missing email or password");
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({
            email: email,
            password: hashedPassword,
        });
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const GenerateTokens = (_id: string): { accessToken: string, refreshToken: string } | null => {
    const random = Math.floor(Math.random() * 1000000);
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    const accessToken = jwt.sign(
        {
            _id: _id,
            random: random
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION });

    const refreshToken = jwt.sign(
        {
            _id: _id,
            random: random
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });

    return { accessToken, refreshToken };
};

const Login = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400).send("wrong email or password");
        return;
    }
    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            res.status(400).send("wrong email or password");
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).send("wrong email or password");
            return;
        }

        const userId: string = user._id.toString();
        const tokens = GenerateTokens(userId);
        if (!tokens) {
            res.status(400).send("missing auth configuration");
            return;
        }

        if (user.refreshTokens == null) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
            email: user.email,
            _id: user._id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

const Logout = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("missing refresh token");
        return;
    }

    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (error: unknown, data: unknown) => {
        if (error) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data as TokenPayload;
        try {
            const user = await UserModel.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }
            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                res.status(400).send("invalid token");
                user.refreshTokens = [];
                await user.save();
                return;
            }
            const tokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens = tokens;
            await user.save();
            res.status(200).send("logged out");
        } catch (error) {
            res.status(400).send(error);
        }
    });
};

const Refresh = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send("invalid token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (error: unknown, data: unknown) => {
        if (error) {
            res.status(403).send("invalid token");
            return;
        }

        const payload = data as TokenPayload;
        try {
            const user = await UserModel.findOne({ _id: payload._id });
            if (!user) {
                res.status(400).send("invalid token");
                return;
            }

            if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("invalid token");
                return;
            }

            const newTokens = GenerateTokens(user._id.toString());
            if (!newTokens) {
                user.refreshTokens = [];
                await user.save();
                res.status(400).send("missing auth configuration");
                return;
            }

            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            user.refreshTokens.push(newTokens.refreshToken);
            await user.save();

            res.status(200).send({
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            });
        } catch (error) {
            res.status(400).send(error);
        }
    });
};


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send("missing token");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("missing auth configuration");
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (error, data) => {
        if (error) {
            res.status(403).send("invalid token");
            return;
        }
        const payload = data as TokenPayload;
        req.query.userId = payload._id;
        next();
    });
};

export default { Register, Login, Logout, Refresh };
