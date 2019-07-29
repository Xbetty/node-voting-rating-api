const Controller = require('../controller/userController.js')
const RatingController = require('../controller/vRatingController.js')
const router = require('koa-router')()
// users
// ------------------------
// 登录
router.post('/user/userLogin', Controller.userLogin)
// 获取用户数据列表
router.post('/user/getInfos', Controller.getInfos)
// 添加用户
router.post('/user/addInfos', Controller.addInfos)
// 删除用户
router.post('/user/removeInfos', Controller.removeInfos)
// 更新用户信息
router.post('/user/updateInfos', Controller.updateInfos)
// 修改密码
router.post('/user/updatePassword', Controller.updatePassword)
// 用户统计
router.post('/user/userStatic', Controller.userStatic)

// rating
// -------------------------
// 发起评分/投票
router.post('/project/initiateScoreOrVote', RatingController.initiateScoreOrVote)
// 删除项目
router.post('/project/deleteProject', RatingController.deleteProject)
// 评分/投票项目统计
router.post('/project/projectStatic', RatingController.projectStatic)
// 我发起的/已评分/我分享的数据列表
router.post('/project/projectList', RatingController.projectList)
// 用户评分/投票
router.post('/project/userOperate', RatingController.userOperate)
// 评分/投票项目详情
router.post('/project/projectDetails', RatingController.projectDetails)
// 待评分/待投票数据列表
router.post('/project/waitOperateCounts', RatingController.waitOperateCounts)
// 更改项目状态
router.post('/project/changeProjectStatus', RatingController.changeProjectStatus)
// 上传文件
router.post('/project/uploadProjectFile', RatingController.uploadProjectFile)
module.exports = router