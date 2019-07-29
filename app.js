const Koa = require('koa');
const router = require('./router')
const bodyParser = require('koa-bodyParser')
const cors = require('koa-cors')
const koaJson = require('koa-json')
const authCommon = require('./middleware/authCommon')
const session = require('koa-session')
// const responseCommon = require('./middleware/responseCommon')
const koaBody = require('koa-body')
const app = new Koa()
app.use(koaBody({
  multipart: true
}))
app.use(cors())  //解决跨域问题
app.use(koaJson())
app.use(bodyParser())
// app.use(responseCommon)
app.use(router.allowedMethods())
.use(authCommon())
.use(router.routes())
const config = {
}
app.use(session(config, app));

    
app.listen(3000);
console.log('[demo] start-quick is starting at port 3000')