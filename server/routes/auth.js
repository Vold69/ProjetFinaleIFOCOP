const router = require("express").Router();
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const Mongoose = require("mongoose");
const nodemailer = require("nodemailer");

// method pour envoyer un mail avec node.js
const myEmail = "johan.ifocop@gmail.com";
const transporter = nodemailer.createTransport({
  host: myEmail,
  service: "gmail",
  auth: {
    user: myEmail,
    pass: "nazdrovia01",
  },
});

const RSA_PUBLIC_KEY = fs.readFileSync("./rsa/key.pub");
const RSA_KEY_PRIVATE = fs.readFileSync("./rsa/key");

router.post("/signin", (req, res) => {
  User.findOneAndUpdate({ email: req.body.email }, { isConnect: true }).exec(
    (err, user) => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({}, RSA_KEY_PRIVATE, {
          algorithm: "RS256",
          expiresIn: "1500s",
          subject: user._id.toString(),
        });
        res.status(200).json(token);
      } else {
        res.status(401).json("signin fail !");
      }
    }
  );
});

router.post("/logout", (req, res) => {
  User.findOneAndUpdate({ _id: req.body.value }, { isConnect: false }).exec(
    (err, user) => {
      if (err || !user) {
        res.status(401).json("logout erreur !");
      } else {
        res.status(200).json("logout success");
      }
    }
  );
});

router.get("/refresh-token", (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json("token invalid");
      }
      const newToken = jwt.sign({}, RSA_KEY_PRIVATE, {
        algorithm: "RS256",
        expiresIn: "15s",
        subject: decoded.sub,
      });
      res.status(200).json(newToken);
    });
  } else {
    res.status(403).json("no token to refresh !");
  }
});

router.post("/signup", (req, res) => {
  const newUser = User({
    _id: Mongoose.Types.ObjectId(),
    prenom: req.body.prenom,
    nom: req.body.nom,
    adresse: req.body.adresse,
    age: req.body.age,
    presentation: req.body.presentation,
    preferences: req.body.preferences,
    avatar: req.body.avatar,
    email: req.body.email,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
    genre: req.body.genre,
    isAdmin: req.body.isAdmin,
    isConnect: req.body.isConnect,
    creatDate: req.body.creatDate,
    lastModif: req.body.lastModif,
  });

  var mailOptions = {
    from: myEmail,
    to: req.body.email,
    subject: `Confirmation d'inscription`,
    html: `<h1>Bonjour ${req.body.username}</h1>
  <p>je vous confirme que votre inscription sur notre plateforme PS:(nom de la plateforme) a bien été pris en compte</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      res.status(500).json("erreur Email Already Use");
    } else {
      newUser.save((err) => {
        if (err) {
          res.status(500).json("erreur signup");
        } else {
          res.status(200).json("signup OK !");
        }
      });
    }
  });
});

router.post("/lookpassword", (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (err) {
      res.status(401).json("User non trouver !");
    } else {
      res.status(200).json("User Find");
      var mailOptions = {
        from: myEmail,
        to: req.body.email,
        subject: `Confirmation d'inscription`,
        text:
          "Vous recevez ceci parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n" +
          "Veuillez cliquer sur le lien suivant ou collez-le dans votre navigateur pour terminer le processus:\n\n" +
          "https://myreseaux.herokuapp.com/lost-password/" +
          user._id +
          "\n\n" +
          "Si vous ne l'avez pas demandé, veuillez ignorer cet e-mail et votre mot de passe restera inchangé.\n",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
});

router.get("/data/:_id", (req, res) => {
  User.findOne({ _id: req.params._id }).exec((err, user) => {
    if (err || !user) {
      res.status(401).json("error User Introuvable");
    }
    res.json(user);
  });
});

router.post("/changepassword", (req, res) => {
  User.updateOne(
    { _id: req.body._id },
    { password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)) }
  );

  var mailOptions = {
    from: myEmail,
    to: req.body.email,
    subject: `Confirmation de changement de mot de passe`,
    text: "je vous confirme que le changement de mot de passe a bien été effectuer",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.json("password change !");
    }
  });
});

module.exports = router;
