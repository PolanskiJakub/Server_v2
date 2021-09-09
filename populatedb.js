#! /usr/bin/env node

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []

function userCreate(username, played_games, wins, winsTimeArray, avgWinTime, losses, cb) {
  var user = new User({
    username: username,
    played_games: played_games,
    wins: wins,
    winsTimeArray: winsTimeArray, 
    avgWinTime: avgWinTime,
    losses: losses
  });
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New user: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}

function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate('User1', 10, 3, [61, 61, 23], 61, 7, callback);
        },
        function(callback) {
          userCreate('Ben', 0, 0, [0], 0, 0, callback);
        },
        function(callback) {
          userCreate('Isaac', 13, 9, [1, 2, 3, 4], 32, 4, callback);
        },
        function(callback) {
          userCreate('Bob', 0, 0, [0], 0, 0, callback);
        },
        function(callback) {
          userCreate('Jim', 0, 0, [0], 0, 0, callback);
        }
        ],
        // optional callback
        cb);
}

createUsers();

/*async.series([
    createUsers,
    createBooks,
    createBookInstances
  ],
// Optional callback
  function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});*/