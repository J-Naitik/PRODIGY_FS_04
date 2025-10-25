const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: { type: String, required: true }, // room id or "private:userA:userB"
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  createdAt: { type: Date, default: Date.now },
  meta: { type: Object }
});

module.exports = mongoose.model('Message', MessageSchema);
