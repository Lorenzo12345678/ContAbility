const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const userRoute = require('../routes/user');


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{

  

 
  
  res.render('dashboard', {

    user: req.user
  })
});

router.use('/user', userRoute )
module.exports = router;


