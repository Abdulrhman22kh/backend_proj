
const jwt = require('jsonwebtoken')
const { secretKey } = require("../serverConstant");
const protect = async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
    
      try {
        token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, secretKey);
        next();
      } catch (err) {
        
        res.status(401).json({message: "No authorized"});
      }
    }
    if (!token) {
        res.status(403).json({message: "No authorized"});
        
    }
  };

  module.exports = {protect}