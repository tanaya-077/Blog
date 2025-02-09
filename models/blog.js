
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  owner :{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ownerUsername: { type: String, required: true }
});


module.exports = mongoose.model('Blog', blogSchema);
