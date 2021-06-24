const router = require("express").Router();
const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt = require("jsonwebtoken");
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

function isLoggedIn(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, RSA_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json("token invalid");
      }
      const sub = decoded.sub;

      User.findOne({ _id: sub }).exec((err, user) => {
        if (err || !user) {
          res.status(401).json("error findOne");
        }
        req.user = user;
        next();
      });
    });
  } else {
    res.status(401).json("pas de token !");
  }
}

router.get("/current", isLoggedIn, (req, res) => {
  res.json(req.user);
});

router.get("/look", isLoggedIn, (req, res) => {
  User.find({}).exec((err, list) => {
    if (err || !list) {
      res.status(401).json("error");
    }
    res.json(list);
  });
});

router.post("/edit/:id", isLoggedIn, (req, res) => {
  User.find({ email: req.body.email }).exec((err, user) => {
    if (!user) {
      if (req.body.password) {
        User.findByIdAndUpdate(
          { _id: req.params.id },
          {
            prenom: req.body.prenom,
            nom: req.body.nom,
            adresse: req.body.adresse,
            age: req.body.age,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
            preferences: req.body.preferences,
            presentation: req.body.presentation,
            lastModif: req.body.lastModif,
            genre: req.body.genre,
          },
          { new: true },
          (err) => {
            if (err) {
              res.status(500).json("Erreur Edit Fail");
            } else {
              res.status(200).json("Edit Succes !");
            }
          }
        );
      } else {
        User.findByIdAndUpdate(
          { _id: req.params.id },
          {
            prenom: req.body.prenom,
            nom: req.body.nom,
            adresse: req.body.adresse,
            age: req.body.age,
            username: req.body.username,
            email: req.body.email,
            preferences: req.body.preferences,
            presentation: req.body.presentation,
            lastModif: req.body.lastModif,
            genre: req.body.genre,
          },
          { new: true },
          (err) => {
            if (err) {
              res.status(500).json("Erreur Edit Fail");
            } else {
              res.status(200).json("Edit Succes !");
            }
          }
        );
      }
    } else {
      res.status(500).json("Erreur Email already in DB");
    }
  });
});

router.post("/editAdmin/:id", isLoggedIn, (req, res) => {
  console.log(req.body.id);
  User.find({ email: req.body.email }).exec((err, user) => {
    if (!user) {
      if (req.body.password) {
        User.findByIdAndUpdate(
          { _id: req.params.id },
          {
            prenom: req.body.prenom,
            nom: req.body.nom,
            adresse: req.body.adresse,
            age: req.body.age,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
            preferences: req.body.preferences,
            presentation: req.body.presentation,
            lastModif: req.body.lastModif,
            genre: req.body.genre,
            isAdmin: req.body.isAdmin,
          },
          (err) => {
            if (err) {
              res.status(500).json("Erreur Edit Fail");
            } else {
              res.status(200).json("Edit Succes !");
            }
          }
        );
      } else {
        User.findByIdAndUpdate(
          { _id: req.params.id },
          {
            prenom: req.body.prenom,
            nom: req.body.nom,
            adresse: req.body.adresse,
            age: req.body.age,
            username: req.body.username,
            email: req.body.email,
            preferences: req.body.preferences,
            presentation: req.body.presentation,
            lastModif: req.body.lastModif,
            genre: req.body.genre,
            isAdmin: req.body.isAdmin,
          },
          (err) => {
            if (err) {
              res.status(500).json("Erreur Edit Fail");
            } else {
              res.status(200).json("Edit Succes !");
            }
          }
        );
      }
    } else {
      res.status(500).json("Erreur Email already in DB");
    }
  });
});

router.delete("/delete/:id", isLoggedIn, (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json("Erreur delete Fail");
    } else {
      res.status(200).json("delete Succes !");
    }
  });
});

router.post("/modifAll", isLoggedIn, (req, res) => {
  User.updateMany(
    {},
    {
      friendList: req.body.friendList,
      friendRequest: req.body.friendRequest,
      waitConf: req.body.waitConf,
    },
    (err) => {
      if (err) {
        res.status(500).json("erreur ModifFriendRemove");
      } else {
        res.status(200).json("ModifFriendRemove OK !");
      }
    }
  );
});

router.get("/lookSelected/:email", (req, res) => {
  User.findOne({ email: req.params.email }).exec((err, user) => {
    if (err || !user) {
      res.status(401).json("error");
    }
    res.json(user);
  });
});

router.get("/lookSelect/:id", isLoggedIn, (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, users) => {
    if (err || !users) {
      res.status(401).json("error");
    }
    res.json(users);
  });
});

router.post("/addFriendRequest", isLoggedIn, (req, res) => {
  User.findOne({ _id: req.body._id }).exec((err, users) => {
    if (
      users.friendList.includes(req.body.friendRequest) ||
      users.waitConf.includes(req.body.friendRequest) ||
      users.friendRequest.includes(req.body.friendRequest)
    ) {
      res.status(500).json("erreur already  friend ");
    } else {
      User.findOneAndUpdate(
        { _id: req.body._id },
        { friendRequest: req.body.friendRequest },
        (err) => {
          if (err) {
            res.status(500).json("erreur addFriendRequest");
          } else {
            res.status(200).json("addFriendRequest OK !");
            var mailOptions = {
              from: myEmail,
              to: req.body.email,
              subject: `Vous avez reçu une demande d'amis`,
              text: `Bonjour ${req.body.username},vous avez reçu une demande d'amis `,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
          }
        }
      );
    }
  });
});

router.post("/addListFriend", isLoggedIn, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    {
      friendList: req.body.friendList,
      friendRequest: req.body.friendRequest,
      waitConf: req.body.waitConf,
    },
    (err) => {
      if (err) {
        res.status(500).json("erreur addFriendRequest");
      } else {
        res.status(200).json("addFriendRequest OK !");
      }
    }
  );
});

module.exports = router;
