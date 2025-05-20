import jwt from  'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const userAuth = async(req, res, next) => {

    // Get the token from the request headers
    const token = req.headers.token;

    // Check if the token is present
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again!' });
    }

    try{
        // Verify the token using the secret key, decode and get the user ID
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            // assign userId to req
            req.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        // Call the next middleware or route handler
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;