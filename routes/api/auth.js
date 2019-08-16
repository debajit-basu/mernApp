const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');





// @route   GET api/auth
// @desc    Test route
// @access  protected
router.get('/', auth , async (req,res) => {
    // res.send('auth route');
    // res.json({ data: req.user });

    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }

})


// @route   POST api/auth
// @desc    User authentication
// @access  Public

router.post('/',[
    check('email', 'Email required').isEmail(),
    check('password' , 'Password required').exists()
] ,async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.sendStatus(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try{

    //see if the user not exists
    
    let user = await User.findOne({ email: email});
    
    if(!user){
        res.status(400).json({ errors: [ { msg: 'Invalid credential'}] });
    }

    // see if password not matched

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
        res.status(400).json({ errors: [ { msg: 'Invalid credential'}] });
    }


    
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
            }
        } 
        );

    }catch(err){
        console.log(err.message);
        res.sendStatus(500).send('server error');
    }
    
})














module.exports = router; 9830305769