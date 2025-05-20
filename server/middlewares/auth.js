import jwt from  'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

// middleware to fetch userId from token

// Previous code
// const userAuth =  async (req, res, next)=>{
//     const {token} = req.headers;

//     if(!token){
//         return res.json({success: false, message: 'Not Authorised. Login Again!'});
//     }
//     try{
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

//         if(tokenDecode.id){
//             req.body.userId = tokenDecode.id;
//         }else{
//             return res.json({success:false, message:'Not Authorised. Login Again'});
//         }

//         next();

//     } catch(error){
//         res.json({success:false, message: error.message});

//     }
// };


// new code 

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