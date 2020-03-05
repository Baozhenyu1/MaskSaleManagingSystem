import { axios } from '@/utils/request'

const api = {
  test: '/mask/api-backend/ntest/?format=json',
  tableList: '/mask/api-backend/StoreTable/?format=json',
  analysisList: '/mask/api-backend/SellTable/?format=json',

  // 预约区域统计表
  streetDistrictList: '/mask/api-backend/reserveTable/',

  // 预约销售统计表
  sellReserveList: '/mask/api-backend/sellReserveTable/',

  // 修改基础信息
  editStoreBasicInfo: '/mask/api-backend/editStoreBasicInfo/',

  // 修改历史数据
  editStoreHistory: '/mask/api-backend/editStoreDaysData/',

  // 居村配额
  committeeQuota: '/mask/api-backend/comQuota/',

  // 修改密码
  editPassword: '/mask/api-backend/api-edit_password/',

  //修改居委提交的某日预约数据
  editCommData: '/mask/api-backend/',

  //获得居委的详情数据
  commDetail: '/mask/api-backend/',


  deliveryList: '/mask/api-backend/deliveryTable/?format=json',
  quotaLIst: '/mask/api-backend/quotaTable/?format=json',
  lineChart: '/mask/api-backend/sellLineChart/?format=json',
  storeDetail: '/mask/api-backend/storeDetail/?format=json',
  // 两张地图
  saleData: '/mask/api-backend/SellTable/',
  saleReservationData: '/mask/api-backend/SaleReservationRatio/',

  streetList: '/mask/api-backend/streetTable/?format=json',
  streetDetail: '/mask/api-backend/streetDetail/?format=json',

  user: '/user',
  role: '/role',
  service: '/mask/api-backend/ManShortagedataTable/?format=json',
  mapGeo: '/mask/api-backend/ProvincialAdministrativeDivision/?format=json',
  reNum: '/mask/api-backend/ProDrugCnt/?format=json',
  item: '/mask/api-backend/ManShortagedata/?format=json',
  info: '/mask/api-backend/ManShortagedataList/?format=json',
  report: '/mask/api-backend/ManShortagedataReport/?format=json',
  reportItem: '/mask/api-backend/ManShortagedataReportTable/?format=json',
  drugcount: '/mask/api-backend/DrugCount/?format=json',
  rank: '/mask/api-backend/DayRanking/?format=json',
  company: '/mask/api-backend/CompanyDrugCount/?format=json',
  subscribeList: '/mask/api-backend/Subscribe/?format=json',
  subscribeAdd: '/mask/api-backend/SubscribeAdd/?format=json',
  subscribeUpdate: '/mask/api-backend/SubscribeUpdate/?format=json',
  subscribeDelete: '/mask/api-backend/SubscribeDelete/?format=json',
  noticeGet: '/mask/api-backend/MessageGet/?format=json',
  noticeDelete: '/mask/api-backend/MessageDelete/?format=json',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  newtable: '/mask/api-backend/NewTable/?format=json',
  subtitle: '/mask/api-backend/GetSubtitles/?format=json',
  alterDrug: '/mask/api-backend/AlternativeDrug/?format=json',
  feedbackList: '/mask/api-backend/FeedbackList/?format=json',
  feedbackAdd: '/mask/api-backend/FeedbackAdd/?format=json',
  feedbackDelete: '/mask/api-backend/FeedbackDelete/?format=json',
  drugdataList: '/mask/api-backend/DrugdataList/?format=json',
  drugbidList: '/mask/api-backend/DrugBidList/?format=json',
  drugInfo: '/mask/api-backend/DrugIndication/?',
  wordCloud: '/mask/api-backend/wordcnt/'
}

export default api

export function apiTest () {
  return axios({
    url: api.test,
    method: 'get'
  })
}

export function getStreetDetail (parameter) {
  return axios({
    url: api.streetDetail,
    method: 'get',
    params: parameter
  })
}

export function getStreetList (parameter) {
  return axios({
    url: api.streetList,
    method: 'get',
    params: parameter
  })
}

export function getSaleData () {
  return axios({
    url: api.saleData,
    method: 'get',
    params: { 'map': 1 }
  })
}
export function getSaleReservationData () {
  return axios({
    url: api.saleReservationData,
    method: 'get'
  })
}

export function getStoreDetail (parameter) {
  return axios({
    url: api.storeDetail,
    method: 'get',
    params: parameter
  })
}

export function getLineChart () {
  return axios({
    url: api.lineChart,
    method: 'get'
  })
}

export function getQuotaList (parameter) {
  return axios({
    url: api.quotaLIst,
    method: 'get',
    params: parameter
  })
}

export function getDeliveryList () {
  return axios({
    url: api.deliveryList,
    method: 'get'
  })
}

export function getTableList (parameter) {
  return axios({
    url: api.tableList,
    method: 'get',
    params: parameter
  })
}

export function getAnalysisList (parameter) {
  return axios({
    url: api.analysisList,
    method: 'get',
    params: parameter
  })
}

export function getStreetDistrictList (parameter) {
  return axios({
    url: api.streetDistrictList,
    method: 'get',
    params: parameter
  })
}

export function getComQuotaList (parameter) {
  return axios({
    url: api.committeeQuota,
    method: 'get',
    params: parameter
  })
}

export function getSellReserveList (parameter) {
  return axios({
    url: api.sellReserveList,
    method: 'get',
    params: parameter
  })
}

export function editStoreBasicInfo (data) {
  return axios({
    url: api.editStoreBasicInfo,
    method: 'post',
    data: JSON.stringify(data),
    dataType: 'json'
  })
}

export function editStoreDaysData (data) {
  return axios({
    url: api.editStoreHistory,
    method: 'post',
    data: JSON.stringify(data),
    dataType: 'json'
  })
}

export function getCommitteeDetail (parameter) {
  return axios({
    url: api.commDetail,
    method: 'get',
    params: parameter
  })
}
export function editCommData (data) {
  return axios({
    url: api.editCommData,
    method: 'post',
    data: JSON.stringify(data),
    dataType: 'json'
  })
}

export function editPassword (data) {
  return axios({
    url: api.editPassword,
    method: 'post',
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        ret = ret.substring(0, ret.lastIndexOf('&'));
        return ret
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  })
}

export function getWordCloud () {
  return axios({
    url: api.wordCloud,
    method: 'get'
  })
}

export function getDrugInfo (parameter) {
  return axios({
    url: api.drugInfo + 'medicine_name=' + parameter,
    method: 'get'
  })
}

export function getDrugBidList (parameter) {
  return axios({
    url: api.drugbidList,
    method: 'get',
    params: parameter
  })
}

export function getDrugDataList (parameter) {
  return axios({
    url: api.drugdataList,
    method: 'get',
    params: parameter
  })
}

export function sendFeedbackDelete (parameter) {
  return axios({
    url: api.feedbackDelete,
    method: 'get',
    params: parameter
  })
}

export function sendFeedbackAdd (parameter) {
  return axios({
    url: api.feedbackAdd,
    method: 'post',
    data: parameter
  })
}

export function getFeedbackList (parameter) {
  return axios({
    url: api.feedbackList,
    method: 'get',
    params: parameter
  })
}

export function getAlternative (parameter) {
  return axios({
    url: api.alterDrug,
    method: 'get',
    params: parameter
  })
}

export function getNewTable (parameter) {
  return axios({
    url: api.newtable,
    method: 'get',
    params: parameter
  })
}

export function getNoticeList () {
  return axios({
    url: api.noticeGet,
    method: 'get'
  })
}

export function getSubscribeList () {
  return axios({
    url: api.subscribeList,
    method: 'get'
  })
}

export function deleteNoticeItem (parameter) {
  return axios({
    url: api.noticeDelete + parameter,
    method: 'get'
  })
}

export function sendSubscribeAdd (parameter) {
  return axios({
    url: api.subscribeAdd,
    method: 'post',
    data: parameter
  })
}

export function sendSubscribeUpdate (parameter) {
  return axios({
    url: api.subscribeUpdate,
    method: 'post',
    data: parameter
  })
}

export function sendSubscribeDelete (parameter) {
  return axios({
    url: api.subscribeDelete + '&key=' + parameter,
    method: 'get'
  })
}

export function getUserList (parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getCompanyDrugCount (parameter) {
  return axios({
    url: api.company + '&threshold=' + parameter,
    method: 'get'
  })
}

export function getMapGeo () {
  return axios({
    url: api.mapGeo,
    method: 'get'
  })
}
export function getMapRe (parameter) {
  return axios({
    url: api.reNum + parameter,
    method: 'get'
  })
}

export function getInfo () {
  return axios({
    url: api.info,
    method: 'get'
  })
}

export function getItem (parameter) {
  return axios({
    url: api.item,
    method: 'get',
    params: parameter
  })
}

export function getSubtitle (parameter) {
  return axios({
    url: api.subtitle,
    method: 'get',
    params: parameter
  })
}

export function getReportItem (parameter) {
  return axios({
    url: api.reportItem + '&id_=' + parameter.split('id=')[1],
    method: 'get'
  })
}

export function getRoleList (parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return axios({
    url: api.service + parameter,
    method: 'get'
  })
}

export function getDayRank (parameter) {
  return axios({
    url: api.rank + parameter,
    method: 'get'
  })
}

export function getDrugCount (parameter) {
  return axios({
    url: api.drugcount + parameter,
    method: 'get'
  })
}

export function getServiceReport (parameter) {
  return axios({
    url: api.report + parameter,
    method: 'get'
  })
}

export function getPermissions (parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
