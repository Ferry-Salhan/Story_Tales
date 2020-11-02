const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next)=> {
    const {authorization} = req.headers
    //autorization = Federer gyjvjhk
    if (!authorization){
        return res.status(402).json({error: "Warning: You must logged in.."});

    }
    const token = authorization.replace("Federer ", "");
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err){
            return res.status(402).json({error: "Warning: You must logged in.."}); 
        }
        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
    })
}