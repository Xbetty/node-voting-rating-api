/*
    响应结果格式化
    在app.use(router)之前调用
*/
const responseCommon = async (ctx, next) => {
    await next()  //先执行路由
    console.log("11111", ctx.body)
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success'
        }
    }
}
module.exports = responseCommon