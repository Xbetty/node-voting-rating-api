const Rating = require('../model/votingRating');
const Result = require('../service/result.service')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
class RatingController {

  // 发起投票/评分
  // ----------------------------------
  static async initiateScoreOrVote (ctx) {
		let content = ctx.request.body
		try {
			let userInsert = new Rating(content)
			let res = await userInsert.save()
			ctx.body = Result.success("发起成功")
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }
  
  // 立即评分/投票
  // --------------------------
	static async userOperate (ctx) {
		let content = ctx.request.body
		let userId = ctx.session.userId
		let userName = ctx.session.userName
		try {
			let currentProject = await Rating.findOne({_id: content._id})
			if (currentProject.record === undefined) {
				currentProject.record = []
			}
			if (content.scoreResult.userName === undefined) {
				content.scoreResult.userName = null
			}
			content.scoreResult.userName = userName
			let obj = {}
			obj.userId = userId
			obj.result = content.scoreResult
      currentProject.record.push(obj)
      
      // 计算评分/投票结果
      // ------------------
			let operateResult = 0
			let newOption = []
			let allArr = []
			currentProject.record.forEach((record)=> {
				let _projectOption = record.result.projectOption
				_projectOption.forEach((option) => {
					allArr.push(option)
				})
			})
			if (content.projectType === 1) {
        // 评分
				currentProject.record.forEach(project => {
					operateResult += project.result.score
					newOption = currentProject.projectOption
				})
			} else {
        // 投票
				currentProject.projectOption.map((item) => {
					item.value = 0
					allArr.forEach(item1 => {
						if (item.name === item1) {
							item.value += 1
						}
					})
				})
				newOption = currentProject.projectOption.sort(function (a, b) {
					return b.value - a.value
				})
			}
			currentProject.scoreResult = content.projectType === 1 ? (operateResult / (currentProject.record).length) : null
			currentProject.votingResult = content.projectType === 2 ? currentProject.projectOption[0].name : null
			newOption.map((item) => {
				item.value = 0
				allArr.forEach(item1 => {
					if (item.name === item1.name || item.name === item1) {
						item.value = content.projectType === 1 ? (item.value + item1.value) : (item.value + 1)
					}
        })
				item.value = content.projectType === 1 ? (item.value / (currentProject.record).length) : item.value
			})
			
			await Rating.update({"_id": content._id}, {
				'record': currentProject.record,
				'scoreResult': currentProject.scoreResult,
				'votingResult': currentProject.votingResult,
				'projectOption': newOption
			})
			let tips = content.projectType === 1 ? '评分成功' : '投票成功'
			ctx.body = Result.success(tips)
		} catch (err) {
			console.log(err)
			ctx.body = Result.error(err)
		}
  }
  
  // 删除投票/评分
  // ----------------------------
  static async deleteProject (ctx) {
		let del = ctx.request.body
		try {
			let res = await Rating.remove(del)
			ctx.body = Result.success("删除成功")
		} catch (err) {
			ctx.body = Result.error(err)
		}
	}

  // 评分/投票详情
  // -----------------------------
	static async projectDetails (ctx) {
    let content = ctx.request.body
    console.log(content)
		try {
      let project = await Rating.findOne({_id: content._id})
      ctx.body = Result.success("查询成功", project)
		} catch (err) {
      console.log('err', err)
			ctx.body = Result.error(err)
		}
	}

  // 投票/评分项目统计
  // ----------------------------
  static async projectStatic (ctx) {
		let { projectType, projectStatus, limit, page, keywords, timeStart, timeEnd } = ctx.request.body
		let start = (page - 1) * limit
		let reg = new RegExp(keywords, 'i')
		let filedsTime = projectType === 1 ? 'shareTime' : 'createAt'
		let sortFilter = {}
		sortFilter[filedsTime] = -1
		let filterObj = {
			votingType: projectType,
			record: {$exists : true}
		}
    // 评分项目
		if (projectType === 1) {
			filterObj.$or = [
				{projectName : {$regex : reg}},
				{teacherName: {$regex : reg}}
			]
    }
    // 投票项目
		if (projectType === 2) {
			filterObj['$or'] = [
				{projectName : {$regex : reg}},
				{publisher: {$regex : reg}}
			]
		}
		if (timeStart) {
			filterObj[filedsTime] = {$gte: timeStart, $lt: timeEnd}
		}
		if (projectStatus && projectStatus !== 0) {
			let status
			if (projectStatus === 1) {
				status = true
			}
			if (projectStatus === 2) {
				status = false
			}
			filterObj.projectStatus = status
		}
		try {
			let res = await Rating.find(filterObj).skip(start).limit(limit).sort(sortFilter)
			let total = await Rating.find(filterObj).count()
			let result = {}
			result.limit = limit
			result.total = total
			result.list = res
      ctx.body = Result.success('查询成功', result)
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }
  
  // 1 待评分/ 2投票项目列表, 已评分/投票项目列表, 我发起的评分/投票 数据列表
  // --------------------------
	static async projectList (ctx) {
		// myProjectType: 'wait' 待评分/投票项目
		// myProjectType: 'operated' 已评分/投票项目
		// myProjectType: 'initiated' 我发起的评分/投票项目
		// myProjectType: 'shared' 我分享的项目
	try {
		let { myProjectType, projectType, projectStatus, limit, page, keywords, timeStart, timeEnd } = ctx.request.body
		let userId = ctx.session.userId
		let start = (page - 1) * limit
		let reg = new RegExp(keywords, 'i')
		let filedsTime = projectType === 1 ? 'shareTime' : 'createAt'
		let sortFilter = {}
		sortFilter[filedsTime] = -1
		let filterObj = {
			votingType: projectType
		}
		if (projectStatus && projectStatus !== 0) {
			let status
			if (projectStatus === 1) {
				status = true
			}
			if (projectStatus === 2) {
				status = false
			}
			filterObj.projectStatus = status
		}
		if (keywords) {
			filterObj.projectName = {$regex : reg}
		}
		if (timeStart) {
			filterObj[filedsTime] = {$gte: timeStart, $lt: timeEnd}
		}
		// 我发起的评分/投票项目
		if (myProjectType === 'initiated') {
			if (filterObj.publisher === undefined) {
				filterObj.publisher = {}
			}
			filterObj.publisher = ctx.session.userName
    }
    // 我分享的评分项目
		if (myProjectType === 'shared') {
			filterObj.teacherName = ctx.session.userName
    }
    // 已评分/已投票项目
		if (myProjectType === 'operated') {
			filterObj.record = {
				"$elemMatch": {
					'userId': userId
				},
				"$exists": true
			}
    }
    // 待评分/待投票项目
		if (myProjectType === 'wait') {
			filterObj.$or = [
				{
					record: {"$exists": false}
        },
        {
          'record.userId': {
            "$ne": userId
          }
        }
			]
		}

			let res = await Rating.find(filterObj).skip(start).limit(limit).sort(sortFilter)
      res.forEach(project => {
        if (project.record && project.record.length) {
          project.isOperated = project.record.some(item => {
            return mongoose.Types.ObjectId(item.userId).toString() === mongoose.Types.ObjectId(ctx.session.userId).toString()
          })
        }
      })
			let total = await Rating.find(filterObj).count()
			let result = {}
			result.limit = limit
			result.total = total
			result.list = res
      ctx.body = Result.success('查询成功', result)
		} catch (err) {
			console.log('err', err)
			ctx.body = Result.error(err)
		}
  }
  
  // 待评分，待投票数目
  // --------------------------------
	static async waitOperateCounts (ctx) {
		try {
			let userId = ctx.session.userId
			let filterObj = {
        votingType: ctx.request.body.votingType,
        projectStatus: true
			}
			filterObj.$or = [
				{
					record: {"$exists": false}
        },
        {
          'record.userId': {
            "$ne": userId
          }
        }
			]
			let total = await Rating.find(filterObj).count()
			let result = {}
			result.total = total
			ctx.body = Result.success('查询成功', result)
		} catch (err) {
			ctx.body = Result.error(err)
		}
  }
  
  // 更改项目状态
  // ------------------
  static async changeProjectStatus (ctx) {
    let newValue = ctx.request.body
    try {
      await Rating.update({"_id": newValue.id}, {
        'projectStatus': newValue.projectStatus
      })
      if (newValue.projectStatus) {
        ctx.body = Result.success("项目已开启")
      } else {
        ctx.body = Result.success("项目已关闭")
      }
    } catch (err) {
      ctx.body = Result.error(err)
    }
  }


  // 上传文件
  // ------------------
  static async uploadProjectFile (ctx) {
    const file = ctx.request.files.file // 获取上传文件
    console.log('files', file)
      // 创建可读流
      console.log('1', 1)
      const reader = fs.createReadStream(file.path)
      // 获取上传文件扩展名
      console.log('2', 2)
      let filePath = path.join(__dirname, 'upload/') + `${file.name}`
      // 创建可写流
      const upStream = fs.createWriteStream(filePath)
      // 可读流通过管道写入可写流
      reader.pipe(upStream)
      console.log('3', filePath)
      let result = {name: file.name, url: filePath}
      ctx.body = Result.success('上传成功', result)
  }
}
module.exports = RatingController