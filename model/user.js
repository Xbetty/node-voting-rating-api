const mongoose = require('../dbHelper');
const Schema = mongoose.Schema
const UserSchema = new Schema ({
    // 用户名
    username: {
        type: String,
        require: true,
        unique: true
    },
    // 电话号码
    phoneNo: {
        type: String,
        require: true
    },
    // 密码
    password: {
        type: String,
        require: true
    },
    // 角色 （admin 超级管理员 / operator 管理员 / user 普通用户）
    roles: {
        type: String,
        require: true
    },
    // 创建时间
    createAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('User', UserSchema);