const mongoose = require('../dbHelper');
const Schema = mongoose.Schema
const VotingRatingSchema = new Schema ({
    // 项目名称
    projectName: {
        type: String,
        require: true
    },
    // 项目描述
    projectDesc: {
        type: String,
        require: false
    },
    // 项目附件（评分）
    projectFiles: {
        type: Array,
        require: false
    },
    // 项目选项
    projectOption: {
        type: Array,
        require: true
    },
    // 项目类型 （1评分 2投票）
    votingType: {
        type: Number,
        require: true
    },
    // 投票结果
    votingResult: {
        type: String,
        require: false
    },
    // 评分结果
    scoreResult: {
        type: Number,
        require: false
    },
    // 项目状态
    projectStatus: {
        type: Boolean,
        require: true,
        default: false
    },
    // 讲师姓名 （评分）
    teacherName: {
        type: String,
        require: false
    },
    // 分享时间 （评分）
    shareTime: {
        type: Number,
        require: false
    },
    // 起始时间
    timeStart: {
        type: Number,
        require: true
    },
    // 终止时间
    timeEnd: {
        type: Number,
        require: true
    },
    // 创建时间
    createAt: {
        type: Number,
        default: new Date().getTime()
    },
    // 发布人
    publisher: {
        type: String,
        require: true
    },
    // 当前用户是否对该项目进行了操作
    isOperated: {
        type: Boolean,
        default: false
    },
    // 当前项目的评分/投票结果
    record: {
        type: Object,
        require: false
    }
})
module.exports = mongoose.model('Rating', VotingRatingSchema);