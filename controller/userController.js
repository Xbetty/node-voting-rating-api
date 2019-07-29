const Users = require('../model/user');
const Result = require('../service/result.service');
const jwt = require('jsonwebtoken')
class userController {
    // 登录
    // ----------------------
	static async userLogin (ctx) {
		let { phone, pwd } = ctx.request.body
		try {
			const item = await Users.find({
				phoneNo: phone
      })
			if (item.length === 0) {
				ctx.body = Result.fault('用户不存在！')
			} else {
				if (item[0].phoneNo === phone && item[0].password === pwd) {
					let _token = {
						_id: item[0]._id,
						username: item[0].username,
						phoneNo: item[0].phoneNo,
						password: item[0].password,
						roles: item[0].roles
					}
					let res = {
            _id: item[0]._id,
						username: item[0].username,
						phoneNo: item[0].phoneNo,
						role: item[0].roles,
						token: jwt.sign(_token, 'votingToken')
					}
					ctx.body = Result.success("登录成功", res)
				} else {
					ctx.body = Result.fault('账号或密码输入有误！')
				}
			}
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }
  
  // 获取用户数据列表
  // -----------------------
  static async getInfos (ctx) {
		let { limit, page, keywords } = ctx.request.body
		let start = (page - 1) * limit
		let reg = new RegExp(keywords, 'i')
		try {
			let res = await Users.find({
				$or : [ 
					{username : {$regex : reg}}
				]
			}).skip(start).limit(limit).sort({"createAt": -1})
			let total = await Users.find({
				$or : [ 
					{username : {$regex : reg}}
				]
			}).count()
			let result = {}
			result.limit = limit
			result.total = total
			result.list = res
      ctx.body = Result.success('查询成功', result)
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }

  // 添加用户
  // -----------------------
  static async addInfos (ctx) {
		let content = ctx.request.body
		let phoneNo = content.phoneNo
		try {
			let user = await Users.find({phoneNo: phoneNo})
			if (user && user.length > 0) {
				ctx.body = Result.error("用户已存在！")
				return
			}
			let userInsert = new Users(content)
			let res = await userInsert.save()
			ctx.body = Result.success("新增成功")
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }

  // 删除用户
  // --------------------------
  static async removeInfos (ctx) {
    let del = ctx.request.body
    try {
      let res = await Users.remove(del)
      ctx.body = Result.success("删除成功")
    } catch (err) {
      ctx.body = Result.error(err)
    }
  }

  // 更新用户
  // --------------------------
  static async updateInfos (ctx) {
    let newValue = ctx.request.body
    try {
      await Users.update({"_id": ctx.request.body._id}, {$set: newValue})
      ctx.body = Result.success("更新成功")
    } catch (err) {
      ctx.body = Result.error(err)
    }
  }
  // 修改密码
  static async updatePassword (ctx) {
    let newValue = ctx.request.body
    try {
      await Users.update({"_id": ctx.session.userId}, {
        'password': newValue.password
      })
    ctx.body = Result.success("更新成功")
    } catch (err) {
      ctx.body = Result.error(err)
    }
  }

  static async userStatic (ctx) {
    // let newValue = ctx.request.body
    try {
      // await Users.update({"_id": ctx.request.body._id}, {$set: newValue})
      // ctx.body = Result.success("更新成功")
    } catch (err) {
      // ctx.body = Result.error(err)
    }
	}
}
module.exports = userController