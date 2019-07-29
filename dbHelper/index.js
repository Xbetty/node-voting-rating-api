const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/votingdb')
//链接成功
mongoose.connection.on('connected', function () {
    console.log('mongoose is opened')
})
//链接异常
mongoose.connection.on('error', function (err) {
    console.log('mongoose connection error' + err)
})
//断开链接
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
})
module.exports = mongoose