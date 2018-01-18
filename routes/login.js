var express = require('express');
var router = express.Router();
var passport = require( "passport" );
const LocalStrategy = require( "passport-local" );
const bcrypt = require( "bcrypt" );
const sqlite = require("sqlite3");
const db = new sqlite.Database( "./users.db" );

// passport.initialize();

passport.use( new LocalStrategy(
  function( username, password, done ) {
    console.log( "Authenticating user: ", username );
    fetchUser( username, password, function( err, user ) {
      if ( err ) return done( err );
      if ( ! user ) return done( null, false );
      return done( null, user );
      console.log( "RESULTS: ", user.password );
    })
  }
))

passport.serializeUser( function( user, done ) {
  console.log( "Serialize ", user, " to ", user.id );
  done( null, user.id );
});

passport.deserializeUser( function( id, done ) {
  findUserbyId( id, function( err, user ) {
    console.log( "Deserialize ", id, " to ", user );
    
    done( err, user );
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log( req.body );

  console.log( "Session: ", req.session );
  console.log( "User   : ", req.user );
  
  res.render('index', { title: 'login' });
});

router.post( "/", passport.authenticate( 'local', { failureRedirect: "/" }), function( req, res ) {
  console.log( "PUT:/", req.body );

  res.render("index", { title: "PUT: login" } );
})

function fetchUser( username, password, done ) {
  console.log( "fetchUser( " + username + ", " + password + " )" );

  db.all( 'SELECT * FROM users WHERE username = ?', [ username ], function( err, results ) {
    console.log( `${err}, `, JSON.stringify( results, null, 2 ) );
    if ( err ) return done( err );
    if ( results.length === 0 ) return done( null, false );
    return done( null, results[0] );
  } );
}

function findUserbyId( id, done ) {
  console.log( "findUserById( ", id, " )" );

  db.all( 'SELECT * FROM users WHERE id = ?', [ id ], function( err, results ) {
    console.log( "ERR: ", err, "RESULTS: ", results );
    if ( err ) return done( err );
    if ( results.length === 0 ) return done( null, false );
    return done( null, results[0] );
  })
}

module.exports = router;
