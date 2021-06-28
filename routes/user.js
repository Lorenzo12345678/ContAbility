const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Expense = require('../models/Expense');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');
const Income = require('../models/Income');



// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, CompanyName } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password, 
          CompanyName
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/user/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/user/login');
});


router.get('/profile', ensureAuthenticated, (req, res) => res.render('profile', {
  user: req.user
}))

router.get('/count', ensureAuthenticated, (req, res) => {
  const id = req.user._id
  var expense = 0
  var income = 0
  var plus = 0
 
  Expense.find({key : id})
  .then( (item) => {

    let totExpense = []
     for( let i = 0; i < item.length; i++){
       item[i].toObject()
       expense += item[i].value
       totExpense.push(item[i])

    } 
    console.log(expense)

    Income.find({key : id})
   .then( (item) => {
 
      let totIncome = []
      for( let i = 0; i < item.length; i++){
        item[i].toObject()
        income += item[i].value
        totIncome.push(item[i])
 
     } 

     plus = income - expense
   

    

     res.render('count', {expense:expense, income:income, plus: plus, totIncome:totIncome, totExpense: totExpense})


     })
    
     
    
 
   })
    .catch((err) => console.log(err)) 
  
})




   // Aggiungere una lista di tutti i movimenti sotto i bottoni e mettere un'icona con il cestino per poterli rimuovere
   // Non è prevista la possibilità di modificare i propri movimenti per il momento
   // Fa si che nella lista sia ben evidenziata la data e al massimo vedi se aggiunger una seconda pagina (in un secondo momento) in cui fai il calcolo mensile
   
  
   
    

  



router.get('/income', ensureAuthenticated, (req, res) => res.render('income', {
  user: req.user
}))
router.get('/expense', ensureAuthenticated, (req, res) => res.render('expense') )

router.post('/expense', ensureAuthenticated, (req, res) => {
  const {value, reason, companyName, key} = req.body
  let errors = []

  if (!value || !companyName || !key ){
    errors.push({msg : 'Please fill the required fields'})
  }

  if (key != req.user._id){
    errors.push({msg : 'Your secret key is not correct!'})
  }

  if (errors.length > 0){
    res.render('expense', {
      errors,
      value,
      reason,
      companyName,
      key
      
    })
  }else {
    const newExpense = new Expense({
      value,
      reason,
      companyName,
      key
      
    })
    newExpense
              .save()
              .then(expense => {
                req.flash(
                  'success_msg',
                  'New movement registered'
                );
                res.redirect('/user/count');
              })
              .catch(err => console.log(err));
  }
  


})

router.post('/income', ensureAuthenticated, (req, res) => {
  const {value, reason, companyName, key} = req.body
  let errors = []

  if (!value || !companyName || !key ){
    errors.push({msg : 'Please fill the required fields'})
  }
  
  if (key != req.user._id){
    errors.push({msg : 'Your secret key is not correct!'})
  }

  if (errors.length > 0){
    res.render('income', {
      errors,
      value,
      reason,
      companyName,
      key
      
    })
  }else {
    const newIncome = new Income({
      value,
      reason,
      companyName,
      key
      
    })
    newIncome
              .save()
              .then(income => {
                req.flash(
                  'success_msg',
                  'New movement registered'
                );
                res.redirect('/user/count');
              })
              .catch(err => console.log(err));
  }
})



module.exports = router;