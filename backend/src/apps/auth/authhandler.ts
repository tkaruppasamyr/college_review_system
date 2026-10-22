import { userservice } from "./user_service";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { type Request, type Response, type NextFunction } from 'express';


export async function accesstoken(payload: any) {
    try{

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1h', // Token expires in 15 minutes
            algorithm: 'HS256'
        })

        return Buffer.from(token).toString('base64');
    }
    catch (error) {
        console.log(error);
        return null;
    }

}


export async function refreshtoken(payload: any) {
    try{
        const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d', // Token expires in 7 days
            algorithm: 'HS256'
        });
        return Buffer.from(token).toString('base64');
    }
    catch (error) {
        console.log(error);
        return null;
    }
}



export async function authentication(email: string, password: string) {
    try{
        const user_exist_docs : any = await userservice.get_email_by(email);
        if (!user_exist_docs) {
            return null;
        }
              
        const isMatch = await bcrypt.compare(password, user_exist_docs.password);
        if (!isMatch) {
            return null;
        }
        if (!user_exist_docs.is_active || user_exist_docs.is_deleted) {
            return null;
        }

        const user_exist = user_exist_docs.toObject();
        delete user_exist.password;
        const payload = { ...user_exist };

        // Later implementation more seured and storing in database
        
        const [access_token, refresh_token] = await Promise.all([
            accesstoken(payload),
            refreshtoken(payload)
        ]);
        user_exist.access_token = access_token;
        user_exist.refresh_token = refresh_token;

        return user_exist;
    }           
    catch (error) {
        console.log(error);
        return null;
    }

}


// 1. Overwrite the standard Express Request globally from this file
declare global {
    namespace Express {
        interface Request {
            user?: any;
            is_authenticated?: boolean;
        }
    }
}

function safeBase64Decode(value: string): string | null {
  try {
    const buffer = Buffer.from(value, 'base64');
    // Verify round-trip encoding to ensure the source was strictly Base64
    return buffer.toString('base64') === value ? buffer.toString('utf8') : null;
  } catch {
    return null;
  }
}


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const base64Token = req.cookies['access_token'];
        if (!base64Token) {
            req.is_authenticated = false;
            return res.status(401).json({ "is_authenticated": false, "message": "Unauthorized" });
        }
        const jwtToken = safeBase64Decode(base64Token);
        const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
        jwt.verify(jwtToken, accessSecret, { algorithms: ['HS256'] }, (err: any, decodedUser: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired access token.' });
        }
        req.user = decodedUser;
        
        });
    } catch (error) {
        req.is_authenticated = false;
        console.log(error);
        return res.status(500).json({ message: 'Internal server error during authentication.' });
    }
    finally{
        next(); // Proceed to the protected route
    }
};

export const TokenClear = (req: Request, res: Response) => {
    try {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return true;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error during token clear.' });
    }
}