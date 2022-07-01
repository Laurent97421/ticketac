var express = require('express');
var router = express.Router();

var journeyModel = require('../models/journey')

const mongoose = require('mongoose');



var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  res.render('home');
});


router.post('/search', async function(req, res, next) {

  // On récupère la liste des trajets correspondant dans la BDD
  var journeyList = await journeyModel.find({departure: req.body.departure, arrival: req.body.arrival, date: req.body.trip_start});
  // console.log(journeyList)


  var departure = req.body.departure
  var arrival = req.body.arrival
  var date = req.body.trip_start
  date = new Date(date).toLocaleDateString()

  console.log(journeyList)

  if(journeyList.length < 1){
    res.render('no_train')
  } else if(journeyList.length == 1){
    res.render('train_list', { journeyList })
  } else {
    for(var i = 0; i < journeyList.length; i++){
      if(departure == journeyList[i].departure && arrival  == journeyList[i].arrival){
        console.log('bibi ')
        res.render('train_list', { journeyList, date })
      }
    }
  }


})









// Remplissage de la base de donnée, une fois suffit
router.get('/save', async function(req, res, next) {

  // How many journeys we want
  var count = 300

  // Save  ---------------------------------------------------
    for(var i = 0; i< count; i++){

    departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
    arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

    if(departureCity != arrivalCity){

      var newUser = new journeyModel ({
        departure: departureCity , 
        arrival: arrivalCity, 
        date: date[Math.floor(Math.random() * Math.floor(date.length))],
        departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
        price: Math.floor(Math.random() * Math.floor(125)) + 25,
      });
       
       await newUser.save();

    }

  }
  res.render('index', { title: 'Express' });
});


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/result', function(req, res, next) {

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
  
      function (err, journey) {

          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )

  }

  res.render('index', { title: 'ticketact' });
});



router.get('/train ', function (req, res, next) {


   res.render('train_list', { title: 'ticketact'  });
})


router.get('/basket', function (req, res, next) {
  const journey = [];

  journey.push(
     {
    departure: req.query.departure,
    arrival: req.query.arrival,
    time: req.query.time,
    date: req.query.date,
    price: req.query.price
    })
  
  console.log(journey)
   res.render('basket', { title: 'ticketac', journey});
})


router.post('/add-journey', function (req, res, next) {
  
  var startCity = req.body.cityStart;
  var finishCity = req.body.cityFinish;
  var journey = []
  


  for (var i = 0; i < city.length; i++) {
    if (startCity & finishCity) {
    
      
    
    } else {
      res.redirect("/");
    }
  }
console.log(journey)

  
  
  res.render('basket', { title: "ticketact" })
  
})



module.exports = router;
