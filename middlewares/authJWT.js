const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateJWT = (req, res, next) => {
  // const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  const token = req.cookies.jwt_auth || req.headers['authorization']?.split(' ')[1]; 

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => 
    {
      if (err) 
      {
        return res.status(403).json({ message: 'Invalid token, access denied.' });
      }

      // Attach the decoded user object to the request object (req.user)
      req.user = user;
      console.log(user);      

      // Proceed to the next middleware/route handler
      next();
  });
};

module.exports = authenticateJWT;
