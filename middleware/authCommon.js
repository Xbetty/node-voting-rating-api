const jwt = require('jsonwebtoken')
const Result = require('../service/result.service');
const Users = require('../model/user');
module.exports = function() {
    return async (ctx, next) => {
        if(ctx.request.url.indexOf('Login') > 0){
            await next()
        } else {
            let token = ctx.headers['x-auth-token']
            if (token) {
                //验证token合法性
                try {
                    let decode_token = jwt.verify(token, 'votingToken')
                    let user = await Users.findOne({
                        _id: decode_token._id
                    })
                    if (user.username === decode_token.username && user.password === decode_token.password) {
                        ctx.session.userId = user._id
                        ctx.session.userName = user.username
                        await next()
                    } else {
                        ctx.response.status = 401
                        Result.fault('0401', '请登录')
                    }
                } catch (e){
                    ctx.response.status = 401
                    Result.fault('0401', '请登录')
                }
            } else {
                ctx.response.status = 401
                Result.fault('0401', '请登录')
            }
        }
    }
}