const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: String,
  prenom: String,
  nom: String,
  adresse: String,
  age: Number,
  presentation: String,
  preferences: Array,
  avatar: Object,
  username: String,
  password: String,
  friendList: Array,
  friendRequest: Array,
  waitConf: Array,
  genre: String,
  isAdmin: Boolean,
  creatDate: Date,
  lastModif: Date,
  isConnect: Boolean,
  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
