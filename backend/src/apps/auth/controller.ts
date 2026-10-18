import {type Request, type Response} from 'express';
import { LoginSchema, RegisterSchema } from './schema';
import { userservice } from './user_service';
import { authentication } from './authhandler';

const bcrypt = require('bcrypt');

class AuthController {


    async register(req: Request, res: Response) {
        try {
            const { error, value } = RegisterSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const user_exist = await userservice.get_email_by(value.email);
            if (user_exist) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(value.password, saltRounds);
            value.password = hashedPassword;
            const result = await userservice.create_user(value);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { error, value } = LoginSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const user = await authentication(value.email, value.password);
            console.log("user get data",user);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.cookie('access_token', user.access_token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hour
                path: '/'
            })
            res.cookie('refresh_token', user.refresh_token, { 
                            httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
                            secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in dev
                            sameSite: 'lax', // CSRF protection
                            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                            path: '/'
                        });
            delete user.refresh_token;
            delete user.access_token;
            return res.status(200).json({user});

            // res.json({ message: 'Login successful', token });
            // res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}


export default new AuthController();




