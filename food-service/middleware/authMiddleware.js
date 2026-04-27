import { config } from "dotenv";
import jwt from "jsonwebtoken";


config();

const auth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({msg:'No token, authorization denied'});
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("Token received:", token);
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", decoded);

        req.user = decoded;

        next();

    } catch (e) {
        console.error("Token verification error:", e.message);
        console.error("JWT_SECRET being used:", process.env.JWT_SECRET);
        res.status(401).json({msg:'Token is not valid'});
    }
};

export { auth };