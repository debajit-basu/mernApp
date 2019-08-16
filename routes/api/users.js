const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const User = require('../../models/Users');


// @route   GET api/users
// @desc    Test user
// @access  Public
router.get('/',(req,res) => {
    res.send('User route get request');
})



// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/',[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password' , 'Please enter a password with 6 or more characters').isLength({ min: 6})
] ,async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.sendStatus(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try{

    //see if the user exists
    
    let user = await User.findOne({ email: email});
    
    if(user){
        res.status(400).json({ errors: [ { msg: 'User already exists'}] });
    }

    user = new User({
        name,
        email,
        password

    });

    //Encrypt password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // res.send('User registered');

    // Return jsonwebToken

    const payload = {
        user: {
            id: user.id
        }
    }
            // email: user.email,
            // name: user.name
    jwt.sign(payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
            if(err){
                throw err;
            }else{
                res.json({ token });
                console.log(token);
                console.log("jwt working");
            }
        } 
        );

    

    // console.log(req.body);

    }catch(err){
        console.log(err.message);
        res.sendStatus(500).send('server error');
    }
    
})

module.exports = router;