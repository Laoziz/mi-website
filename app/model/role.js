'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const date = new Date().getTime();
  const RoleSchema = new Schema({
    title: { type: String },
    status: { type: Number, default: 1 },
    description: { type: String },
    add_time: { type: Number, default: date },
  });
  return mongoose.model('Role', RoleSchema, 'role');
};
