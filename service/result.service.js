let success = function (msg, data) {
    return {
        businessCode: '0000',
        code: '0000',
        data: data,
        msg: msg || ''
    }
}
let error = function (msg, code) {
    return {
        businessCode: code || '0001',
        code: code || '0001',
        msg: msg
    }
}
let fault = function (msg, code) {
    return {
        businessCode: '0001',
        code: code || '0001', //001默认错误，002本地服务错误，003http错误，004mongodb错误，005redis错误，006第三方接口错误
        msg: msg
    }
}
/**
 * 后端异常
 * 	网络中断或者服务down
 */
let down = function () {
    return {
		businessCode: '0003',
		code: '0000',
		msg: '服务出错了，请稍后再试'
	}
}
/**
 * 携带错误信息,到error,
 * 前端不显示,但是可以通过调试器查看,便于错误定位
 * @param {*} msg  错误提示
 * @param {*} error 正真的错误信息
 */
let fail = (msg, error) => {
    return {
        businessCode: '0001',
        code: '0001',
        msg: msg,
        error: error || ''
    }
}
module.exports = {
    success: success,
    error: error,
    fault: fault,
    down: down,
    fail: fail
}