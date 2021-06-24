const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/user.models");
const Post = require("../models/post.models");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const RSA_PUBLIC_KEY = fs.readFileSync("./rsa/key.pub");
const nodemailer = require("nodemailer");

// method pour envoyer un mail avec node.js
// const myEmail = "johan.ifocop@gmail.com";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: myEmail,
//     pass: "nazdrovia01",
//   },
// });

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
          res.status(401).json("error");
        }
        req.user = user;
        next();
      });
    });
  } else {
    res.status(401).json("pas de token !");
  }
}

router.post("/send", isLoggedIn, (req, res) => {
  const newPost = Post({
    _id: mongoose.Types.ObjectId(),
    idUser: req.body.idUser,
    domaine: req.body.domaine,
    title: req.body.title,
    content: req.body.content,
    nameUser: req.body.nameUser,
    postDate: req.body.postDate,
    reponse: req.body.reponse,
  });

  User.findOne({ _id: req.body.domaine }).exec((err, user) => {
    if (user) {
      // var mailOptions = {
      //   from: myEmail,
      //   to: user.email,
      //   subject: "Vous avez un nouveau message",
      //   text: "Vous avez un nouveaux message sur votre page.",
      // };
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });
    } else {
      res.status(401).json("Error User introuvable");
    }
  });

  newPost.save((err) => {
    if (err) {
      res.status(500).json("erreur Post Send");
    } else {
      res.status(200).json("Post Send !");
    }
  });
});

router.get("/get/:_id", isLoggedIn, (req, res) => {
  Post.find({ domaine: req.params._id }).exec((err, post) => {
    if (err || !post) {
      res.status(401).json("error");
    }
    res.json(post);
  });
});

router.get("/getOne/:_id", isLoggedIn, (req, res) => {
  Post.find({ _id: req.params._id }).exec((err, post) => {
    if (err || !post) {
      res.status(401).json("error");
    }
    res.json(post);
  });
});

router.get("/getall", isLoggedIn, (req, res) => {
  Post.find({}).exec((err, allPost) => {
    if (err || !allPost) {
      res.status(401).json("error");
    }
    res.json(allPost);
  });
});

router.post("/edit/:_id", isLoggedIn, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id },
    { reponse: req.body.reponse },
    (err) => {
      if (err) {
        res.status(500).json("Erreur Edit Fail");
      } else {
        res.status(200).json("Edit Succes !");
      }
    }
  );
});

router.post("/editAdmin/:_id", isLoggedIn, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.body._id },
    {
      title: req.body.title,
      content: req.body.content,
      domaine: req.body.domaine,
      idUser: req.body.idUser,
      reponse: req.body.reponse,
    },
    (err) => {
      if (err) {
        res.status(500).json("Erreur Edit Fail");
      } else {
        res.status(200).json("Edit Succes !");
      }
    }
  );
});

router.delete("/delete/:_id", isLoggedIn, (req, res) => {
  Post.deleteOne({ _id: req.params._id }, (err) => {
    if (err) {
      res.status(500).json("Erreur Edit Fail");
    } else {
      res.status(200).json("Edit Succes !");
    }
  });
});

module.exports = router;
