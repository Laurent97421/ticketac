
var express = require('express');
var router = express.Router();

var userModel = require('../models/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Sign-up
router.post('/sign-up', async function (req, res, next) {

  // On récupère le mail entré dans le input
  var findMail = await userModel.find({mail: req.body.mail})

  // Si il existe dans la BDD on fait rien, sinon on l'ajoute
  if(!findMail) {
    // Création du nouveau user
    var newUser = new userModel({
      firstname: req.body.firstname,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    // On ajoute le nouveau user à la BDD
    var newUserSaved = await newUser.save();

    // Création de la session pour chaque user
    req.session.user = {
      name: newUserSaved.firstname,
      id: newUserSaved._id
    }
    res.redirect('/homepage')
  } else {
    res.redirect('/')
  }
});

// Sign-in AKA login
router.post('/sign-in', async function (req, res, next) {

  // On check si le mail et password entré sont dans la BDD
  var userExist = await userModel.findOne({maill: req.body.email, password: req.body.password})

  // Le cas échéant on va à la page suivant
  // Sinon on reste sur celle-ci
  if(userExist != null) {
    req.session.user = {
      name: userExist.email,
      id: userExist._id
    }
    res.redirect('/homepage');
  } else {
    res.redirect('/');
  }
});

// Logout
router.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
})

module.exports = router;
