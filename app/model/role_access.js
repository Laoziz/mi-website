'use strict';
// 角色权限联系表
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const RoleAccessSchema = new Schema({
    role_id: { type: Schema.Types.ObjectId }, // 角色id
    access_id: { type: Schema.Types.ObjectId }, // 权限id
  });
  return mongoose.model('RoleAccess', RoleAccessSchema, 'roleaccess');
};
