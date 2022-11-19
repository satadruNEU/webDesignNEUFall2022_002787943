const { response } = require('express');
const User = require('../models/userModels');
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const { validateEmail, checkPassword } = require("../validations");
const saltRounds = 10;


//Store users info 

// const store = async(req, res, next) => {
//     let requiredUser = User.findOne({ email: req.body.email });
//     console.log(req.body.email)
//     let passBool, emailBool = false;
//     console.log(req.body);
//     if (requiredUser) {
//         res.status(400).send({ message: "Email Address already exists." });
//     } else {

//         if (validateEmail(req.body.email)) {
//             // console.log("Proper email address");
//             emailBool = true;
//           } else {
//             emailBool = false;
//             res.status(400).send({ message: "Please input email address correctly!"});
//           }
    
//           if (checkPassword(req.body.password) && (req.body.password == req.body.confirm_password)) {
//             passBool = true;
//             // console.log("Password is correct");
//           } else {
//             passBool = false;
//             res.status(400).send({ message: "Please input password correctly!"});
//           }
          
//           if (passBool && emailBool) {
//             const hashedPassword = bcrypt.hash(req.body.password, saltRounds);
//             let user = new User({
//                 username: req.body.username,
//                 email: req.body.email,
//                 password: req.body.password
//             })
//         user.save()
//         .then(response => {
//         res.json({
//             message: 'User Added Successfully!'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'An error Occured'
//         })
//     })
// }
//       }
// }

//Show user info
const show = (req, res, next) => {
    User.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: "An error Occured while displaying users"
        })
    })
}

// //update user info
// const update = (req, res, next) => {
//     let userID = req.body.userID

//     let updatedData = {
//         username : req.body.username,
//         password : req.body.password
//     }

//     User.findByIdAndUpdate(userID, {$set: updatedData})
//     .then(() => {
//         res.json({
//             message: "User data Updated successfully!"
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: "An error occured while updating user data"
//         })
//     })
// }

// const deleteUser = (req, res, next) => {
//     let userEmail = req.body.userEmail
//     User.findByIdAndRemove(userEmail)
//     .then(() => {
//         res.json({
//             message: 'User deleted successfully!'
//         })
//     })
//     .catch(error => {
//         res.json({
//             message: 'An error occured while deleting user'
//         })
//     })
// }

module.exports = {
    show
}