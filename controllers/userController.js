const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");
const user = require('../models/user');
var async = require('async');
const saltRounds = 10;
const { findOneAndUpdate } = require('../models/user');
var User = require('../models/user');
var tekst ='randomowy'


exports.stats_get = (req, res) => {
    if(req.query.token === '') {
        return res.status(401).send('token required');
    }
    //need to add case when there is no user with this id
    User.findOne({_id: req.query.id}, function(err,obj) {
        bcrypt.compare( req.query.token,obj.token).then(function(result){

        if (err) return res.status(500).send(err);
        if (result === null) return res.status(400).send({ error: 'Malformed/wrong query parameters'});
        if (result == true){
            return res.status(200).send({avgWinTime: obj.avgWinTime, wins: obj.wins, losses: obj.losses});
        }
        
        res.status(403).send('wrong token');
    });
    });
};


exports.stats_post = [
    (req, res) => {
        if(req.body.token === '') return res.status(401).send('token required');

        User.findOne({_id: req.body.id},(err, obj) => {
            bcrypt.compare( req.body.token,obj.token).then(function(result){
            if (err) return res.status(500).send(err);
            if (result === null) return res.status(400).send({ errors: ['Malformed/wrong query parameters'] });
            if (result == false) return res.status(403).send('wrong token');

            if(req.body.won){
                ++obj.wins;
                obj.winsTimeArray.push(req.body.time);
                const sum = obj.winsTimeArray.reduce(
                    (previousValue, currentValue) => previousValue + currentValue
                );

                obj.avgWinTime = Math.floor(sum / obj.winsTimeArray.length);
            } else ++obj.losses;

            obj.save(err => {
                if(err) return res.status(500).send(err);

                res.status(201).send();
            });
        });
        })
    }
];

exports.register = (req,res) => {
    //check username and password requirements
    User.countDocuments({username: req.body.username},(err, count)=>{
        if(count){
            return res.status(400).send({errors: ['This username is already in use.']})
        } if(req.body.password.length < 8){
            return res.status(400).send({errors: ['Password need to be atleast 8 characters long']});
        } if(!/\d/.test(req.body.password)){
            return res.status(400).send({errors: ['Password need to contain atleast one number']});
        } else {
            bcrypt.hash(req.body.password,saltRounds,function(err,hash){
                
            var user = new User({
                username: req.body.username,
                password: hash,
                played_games: 0,
                wins: 0,
                winsTimeArray: [],
                avgWinTime: 0,
                losses: 0
            })
        
            user.save();    
            console.log('Added new user.')
            res.send({id: user.id});
        })
    }
    })
}

exports.login = (req,res) => {
    const sendError = () => res.status(400).send({errors: ['Wrong username or password.']});
    if (!req.body.username || !req.body.password) return sendError();
    User.findOne({username: req.body.username},(err,obj)=>{
        if (err) return res.status(500).send(err);
        bcrypt.compare(req.body.password,obj.password).then(function(result){
            console.log(result);
            if(result==false || obj===null){
                return sendError();
            }
            var token = Math.random().toString(36).substr(2);
            bcrypt.hash(token,saltRounds,function(err,hash){
            obj.token = hash;
            obj.save(err => {
            if(err) return res.status(500).send(err);
    
            res.status(201).send();
            });
            res.status(200).send({id: obj._id,token, username: obj.username});
            setTimeout(function(){
                obj.token = '';
                obj.save();
            },180000);
            });
        });
    });

    //if (obj === null || obj.password !== req.body.password) return sendError();

    };


exports.deleteEmail = (req,res) =>{
     User.findOne({_id: req.params.id},(err, obj) => {
        var deleteToken = Math.random().toString(36).substr(2);
        obj.deleteToken = deleteToken;
        obj.save();
            
            
    async function main() {
    // create reusable transporter object using the default SMTP transport
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "User delate", // Subject line
      text: "To delete user enter this : http://localhost:8080/jsExercismCourse/deleteUser?token="+obj.deleteToken, // plain text body
      html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.status(204).send();
}
  main().catch(console.error);
      });
}

exports.delete = (req,res) =>{
    console.log(req.params.id);
    User.findByIdAndDelete(req.params.id,function(err){
        res.status(204).send();
        console.log('Succes');
    })





}
  
