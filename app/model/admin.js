'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = new Date().getTime();
  const AdminSchema = new Schema({
    username: { type: String },
    password: { type: String },
    mobile: { type: Number },
    email: { type: String },
    status: { type: Number, default: 1 },
    role_id: { type: Schema.Types.ObjectId },
    add_time: { type: Number, default: date },
    is_supper: { type: Number },
  });
  return mongoose.model('Admin', AdminSchema, 'admin');
};
