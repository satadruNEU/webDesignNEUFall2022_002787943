const {validateEmail, checkPassword} = require("./validation");

const express = require("express"),
      app = express(),
      mongoose = require("mongoose"),
      bcrypt = require("bcrypt"),
      bodyParser = require("body-parser");

const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://sxtxdru:sxtxdru@cluster0.zcvvobz.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  joined: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

// Home Page
app.get("/", (req, res) => {
  res.send("Welcome to Assignment 8 - INFO6150.");
});

// Create new user
app.post("/user/create", async (req, res) => {

  try {

    let user = await User.findOne({ email: req.body.email });
    let passBool, emailBool = false;

    if (user) {
      res.status(400).send({ message: "Email Address already exists." });
    } else {

      if (validateEmail(req.body.email)) {
        emailBool = true;
      } else {
        emailBool = false;
        res.status(400).send({ message: "Please input email address correctly!"});
      }

      if (checkPassword(req.body.password) && (req.body.password == req.body.confirm_password)) {
        passBool = true;
      } else {
        passBool = false;
        res.status(400).send({ message: "Please input password correctly!"});
      }

      if (passBool && emailBool) {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const innerResult = await User.create({
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          user_type: req.body.user_type
        });
        res.status(201).send(innerResult);
      }   
    }    
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error Occurred!"});
  }

});

// Update user details
app.put("/user/edit", async (req, res) => {

  const user = await User.findOne({email: req.body.email});
  
  if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (passCompare) {

      if (req.body.new_email != undefined && req.body.new_password != undefined && req.body.confirm_new_password != undefined) {
        res.status(400).send({ message: "Please provide either new email or new password parameters only!" });
      } else if (req.body.new_email != undefined && req.body.new_password == undefined && req.body.confirm_new_password == undefined) {
        if (validateEmail(req.body.new_email)) {
          User.findByIdAndUpdate(user._id, { email: req.body.new_email }, { useFindAndModify: false })
            .then(data => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot update email with user id=${user._id}. User was not found!`
                });
              } else {
                res.send({ message: "User email address was updated successfully." })
              };
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating User's email with id=" + user._id
              });
            });
        } else {
          res.status(400).send({ message: "Please enter the new email correctly!" });
        }
      } else if (req.body.new_email == undefined && req.body.new_password != undefined && req.body.confirm_new_password != undefined) {
        if (checkPassword(req.body.new_password) && req.body.new_password == req.body.confirm_new_password) {
          const newPassword = await bcrypt.hash(req.body.new_password, saltRounds);
          User.findByIdAndUpdate(user._id, { password: newPassword }, { useFindAndModify: false })
            .then(data => {
              if (!data) {
                res.status(404).send({
                  message: `Cannot update password with user id=${user._id}. User was not found!`
                });
              } else res.send({ message: "User password was updated successfully." });
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating User's password with id=" + user._id
              });
            });
        } else {
          res.status(400).send({ message: "Please enter password correctly!" });
        }
      } else {
        res.status(400).send({ message: "Please provide either the new email or new password!" });
      }
    } else {
      res.status(404).send({
        message: `Password incorrect entered, please retry.`
      });
    }
  } else {
    res.status(404).send({
      message: `User was not found! Please check the email address.`
    });
  }
});

// Get all users
app.get("/user/getAll", async (req, res) => {

  User.find({}, function (err, users) {
      users.forEach(user => delete user.password);
      const newResult = users.map(item => {
        return {
          id: item._id,
          email: item.email,
          username: item.username,
          password: item.password
        }
      })
      res.send(newResult);
  });
  
});

// Delete user
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
      message: `User was not found! Please check the email address.`
    });
  }
});

// Server config block
app.listen(8000, () => {
  console.log("Server started at port 8000");
});