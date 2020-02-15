import Mock from 'mockjs2'
import { builder,getQueryParameters} from '../util'
import data from './china.json'
import values from './report'
// import jquery from "jquery";
const geoList = () =>{
  return builder(data)
}
const dateList = (para)=>{
  let result = []
  para = getQueryParameters(para)[0]
  const start = para.split("|")[0]
  const end = para.split("|")[1]
  for(let item in values){
    item = values[item]
    const time = item["year"] + item["month"];
    if(time >= start && time <= end){
      result.push(item)
    }
  }
  return result
}
const list = (para) => {
  let values = dateList(para)
  let datas = []
  for(let item in values){
    item = values[item]
    if(item["province"] in datas){
      datas[item["province"]] += item["count"]
    }else{
      datas[item["province"]] = 0
    }
  }
  return datas
}
const reList = (para) =>{
  let datas = list(para)
  let result = [{name: '浙江', value: 7},
    {name: '云南', value: 3},
    {name: '新疆', value: 0},
    {name: '香港', value: 5},
    {name: '西藏', value: 1},
    {name: '台湾', value: 2},
    {name: '四川', value: 6},
    {name: '陕西', value: 0},
    {name: '山西', value: 6},
    {name: '山东', value: 4},
    {name: '青海', value: 6},
    {name: '宁夏', value: 9},
    {name: '内蒙古', value: 9},
    {name: '辽宁', value: 6},
    {name: '江西', value: 0},
    {name: '吉林', value: 3},
    {name: '湖南', value: 2},
    {name: '湖北', value: 5},
    {name: '黑龙江', value: 10},
    {name: '河南', value: 5},
    {name: '北京', value: 4},
    {name: '天津', value: 5},
    {name: '海南', value: 9},
    {name: '贵州', value: 6},
    {name: '广西', value: 0},
    {name: '甘肃', value: 6},
    {name: '福建', value: 1},
    {name: '澳门', value: 1},
    {name: '安徽', value: 2},
    {name: '上海', value: 0},
    {name: '重庆', value: 2},
    {name: '江苏', value: 8},
    {name: '广东', value: 8},
    {name: '河北', value: 5}]
  for(let item in result){
    result[item]["value"] = datas[result[item]["name"]]
  }
  return builder(result)
}
const pieList = (para) =>{
  let datas = list(para)
  let result = [ {item:'未知',count:10},
    {item: '浙江', count: 7},
    {item: '云南', count: 3},
    {item: '新疆', count: 0},
    {item: '香港', count: 5},
    {item: '西藏', count: 1},
    {item: '台湾', count: 2},
    {item: '四川', count: 6},
    {item: '陕西', count: 0},
    {item: '山西', count: 6},
    {item: '山东', count: 4},
    {item: '青海', count: 6},
    {item: '宁夏', count: 9},
    {item: '内蒙古', count: 9},
    {item: '辽宁', count: 6},
    {item: '江西', count: 0},
    {item: '吉林', count: 3},
    {item: '湖南', count: 2},
    {item: '湖北', count: 5},
    {item: '黑龙江', count: 10},
    {item: '河南', count: 5},
    {item: '北京', count: 4},
    {item: '天津', count: 5},
    {item: '海南', count: 9},
    {item: '贵州', count: 6},
    {item: '广西', count: 0},
    {item: '甘肃', count: 6},
    {item: '福建', count: 1},
    {item: '澳门', count: 1},
    {item: '安徽', count: 2},
    {item: '上海', count: 0},
    {item: '重庆', count: 2},
    {item: '江苏', count: 8},
    {item: '广东', count: 8},
    {item: '河北', count: 5}
    ]
  for(let item in result){
    result[item]['count'] = datas[result[item]["item"]]
  }
  return builder(result)
}
Mock.mock(/\/map\/geo/, 'get', geoList)
Mock.mock(/\/map\/re/, 'get', reList)
Mock.mock(/\/pie/, 'get', pieList)