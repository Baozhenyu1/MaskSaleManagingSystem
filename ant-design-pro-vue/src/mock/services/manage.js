import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
import information from './information.json'
import reportDate from './reportDate.json'
import analysis from './analysis.json'
const serverList = (options) => {
  const parameters = getQueryParameters(options)
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const key = (pageNo - 1) * pageSize
  const result = []
  const sou = {
    'Weibo': '新浪微博',
    'weixin': '微信文章',
    '今日头条': '今日头条'
  }
  const datas = analysis
  const len = analysis.length
  for (let i = 3161; i > 0; i--) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: datas[i % len]['id'],
      title: datas[i % len]['title'] || sou[datas[i % len]['source']],
      source: sou[datas[i % len]['source']] || '其他',
      date: datas[i % len]['net_sendtime_ym'] || Mock.mock('@datetime'),
      reason: datas[i % len]['reason'],
      location: datas[i % len]['location'],
      editable: false
    })
  }
  const fileterResult = result.filter((item) => ((!parameters.source) || (parameters.source === 0) || (item.sourceid === parameters.source - 1)) &&
    ((!parameters.date) || (item.date === parameters.date)) &&
    ((!parameters.no) || (item.no === parameters.no)) &&
    ((!parameters.title) || (item.title.indexof(parameters.title)) !== -1))
  //  TODO:the content is not the expected one.
  const totalCount = fileterResult.length
  const totalPage = Math.ceil(totalCount / pageSize)
  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: fileterResult
  })
}
const informationList = () => {
  return builder(information)
}
const report = () => {
  return builder(reportDate)
}
const item = (options) => {
  const id = getQueryParameters(options)[0]
  for (const it in information) {
    if (information[it]['id'] === id) {
      return builder(information[it])
    }
  }
  return builder(information[0])
}
Mock.mock(/\/service/, 'get', serverList)
Mock.mock(/\/information/, 'get', informationList)
Mock.mock(/\/report/, 'get', report)
Mock.mock(/\/item/, 'get', item)
