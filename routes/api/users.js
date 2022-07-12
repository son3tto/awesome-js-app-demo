// login & register

// 1. import express
const express = require("express");
// 2. set up .js file for a ROUTER
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/key");

const gravatar = require("gravatar");

// 3. import user model
const User = require("../../models/User");
const { secretOrKey } = require("../../config/key");
// $route GET api/users/test
// @desc test api
// @access public
router.get("/test", (req, res) => {
  res.json({
    msg: "login response works.",
  });
});

// $route POST api/users/register
// @desc returns requested json data
// @access public
router.post("/register", (req, res) => {
  console.log(req.body);

  //if exists
  //argument email is  REQuEST BODY email, find obj 'user' with that email in the schema
  //
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "email taken!" });
    } else {
      // 在gravatar上注册过email的都会有图片
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "404",
      });
      // generate a new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        identity: req.body.identity,
      });

      //encrypted pwd
      bcrypt.genSalt(10, function (err, salt) {
        // hash函数直接callback了hash可以在括号里直接用，震惊
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          // store the hash string instead of the real pwd
          newUser.password = hash;

          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// $route POST api/users/login
// @desc returns requested json data
// @access public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "user not exist!" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity,
        };
        jwt.sign(
          rule,
          keys.secretOrKey,
          { expiresIn: 60 * 60 },
          (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "password incorrect!" });
      }
    });
  });
});

// $route GET api/users/info
// @desc verify token and returns current user info
// @access private
router.get(
  "/info",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

//...
module.exports = router;

// REMEMBER TO USE CURLY BRACKETS WITH JSON OBJECTS
