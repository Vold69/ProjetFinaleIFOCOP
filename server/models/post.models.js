const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = Schema({
  idUser: String,
  domaine: String,
  title: String,
  content: String,
  nameUser: String,
  postDate: Date,
  reponse: Array,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
