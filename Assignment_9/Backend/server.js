const express = require('express');
const app = express();
const User = require('./models/userModels');
const bcrypt = require("bcrypt");
const { validateEmail, checkPassword } = require("./validations");
const saltRounds = 10;
const mongoose = require('mongoose');
const User1 = require("./controllers/UserController");
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb+srv://sxtxdru:sxtxdru@cluster0.zcvvobz.mongodb.net/?retryWrites=true&w=majority';
const UserRoute = require('./routes/userRoutes');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

const ssn = require('jsonwebtoken');

const ssn_decrypt = "43qrqq3r23rrq43frfafafafaef";

var port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));


mongoose.connect(connectionString, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database!'));
app.listen(8000 , () => console.log('Server Started'));

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('marvel_quotes');
    const quotesCollection = db.collection('quotes');
    module.exports = quotesCollection;

    //Create a user which takes 3 parameters full name, email and password
    app.post('/user/create', async (req, res) => {
      let requiredUser = await User.findOne({ email: req.body.email });
    let passBool, emailBool = false;
    if (requiredUser) {
        res.status(400).send({ message: "Email Address already exists." });
    } else {

        if (validateEmail(req.body.email)) {
            // console.log("Proper email address");
            emailBool = true;
          } else {
            emailBool = false;
            res.status(400).send({ message: "Please input email address correctly!"});
          }
    
          if (checkPassword(req.body.password)) {
            passBool = true;
            // console.log("Password is correct");
          } else {
            passBool = false;
            res.status(400).send({ message: "Please input password correctly!"});
          }
          
          if (passBool && emailBool) {
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            })
            console.log(user);
            console.log(req.body.password);
        user.save()
        .then(response => {
        res.json({
            message: 'User Added Successfully!'
        })
        quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })
    .catch(error => {
        res.json({
            message: 'An error Occured'
        })
    })
}
      }
    })

    app.put('/user/edit', async (req, res) => {
      const user = await User.findOne({email: req.body.email});
  
      if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        console.log(req.body.new_username)
        if (passCompare) {
    
          if (req.body.new_email != undefined && req.body.new_password != undefined && req.body.new_username != undefined) {
            res.status(400).send({ message: "Please provide either new username or new password parameters only!" });
          } 
          else if (req.body.new_email != undefined && req.body.new_password == undefined) {
            res.status(404).send({
            message: "User email can't be updated"
          });
          }
          else if (req.body.new_email == undefined && req.body.new_password != undefined) {
            if (checkPassword(req.body.new_password)) {
              const newPassword = await bcrypt.hash(req.body.new_password, saltRounds);
              User.findByIdAndUpdate(user._id, { password: newPassword }, { useFindAndModify: false })
                .then(data => {
                  if (!data) {
                    res.status(404).send({
                      message: `Cannot update password with user id=${user._id}. User was not found!`
                    });
                  } else res.send({ message: "User password updated successfully!" });
                })
                .catch(err => {
                  res.status(500).send({
                    message: "Error updating User's password with id=" + user._id
                  });
                });
            } else {
              res.status(400).send({ message: "Please enter new password correctly!" });
            }
          }else if (req.body.new_password == undefined && req.body.new_username != undefined ) {
            const newUsername = req.body.new_username
            User.findByIdAndUpdate(user._id, { username: newUsername }, { useFindAndModify: false })
            .then(data => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot update username with user id=${user._id}. User was not found!`
                });
              } else res.send({ message: "Username was updated successfully." });
            })
    }
           else {
            res.status(400).send({ message: "Please provide either the new username or new password!" });
          }
        } else {
          res.status(404).send({
            message: `Wrong Password. Please enter correct password`
          });
        }
      }else {
        res.status(404).send({
          message: `User was not found! Please check the email address.`
        });
      }
    })

    app.delete("/user/delete", async (req, res) => {
      const user = await User.findOne({email: req.body.email});
      if (user) {
      const passCompare = await bcrypt.compare(req.body.password, user.password);
      if (passCompare) {
        User.findByIdAndDelete(user._id)
          .then(item => {
            if (!item) {
              res.status(404).send({
                message: `Cannot delete User with email=${user.email}. User not found!`
              });
            } else {
              res.send({
                message: `User with email id ${user.email} was deleted successfully!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Could not delete User with email=" + user.email
            });
          });
      } else {
        res.status(404).send({
          message: `Password incorrect entered, please retry.`
        });
      }
    } else {
      res.status(404).send({
        message: `User was not found. Please check the email address and retry.`
      });
  }
    })

    app.post("/login", async(req,res) =>{
      const {username, password} = req.body;

      const user = await User.findOne({username});
      if(!user){
        return res.json({ status: "no", error: "User not Found"});
      }
      if(await bcrypt.compare(password,user.password)){
        const token = ssn.sign({}, ssn_decrypt);

        if(res.status(201)){
          return res.json({ status: "ok", data: token});
        } else {
          return res.json({ error : "error"});
        }
      }
      res.json({status: "error", error: "invalid Password"});
    });

  })

  app.use('/user', UserRoute);

 

