const jwt = require('jsonwebtoken');
const User = require('../models/user');
const secretKey = "mysecretkey"


const auth = (userType) => {
  
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }
      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid bearer token' });
      }

      const decoded = jwt.verify(token, secretKey);

      const user = await User.findOne({ where: { id: decoded.userId } });

       if (!user) {
        return res.status(401).json({ message: 'Invalid user ID' });
      }

      if (userType && user.userType !== userType) {

        return res.status(403).json({ message: 'Insufficient privileges' });
      }

      req.user = user.id;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }

    //  next();

  };
};

module.exports = auth;