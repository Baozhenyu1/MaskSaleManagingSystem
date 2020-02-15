<template>
  <div id="myMapChart" ref="char" :style="{height: '550px'}"></div>
</template>

<script>
import { getMapGeo, getMapRe } from '@/api/manage'
import { mapTem } from '@/api/dataTemplate'

export default {
  name: 'MapInformation',
  data1: {},
  data2: {},
  myChart: {},
  data () {
    return {
      msg: 'There is no data.',
      date: '',
      option: '',
      drug: '',
      para: '',
      rawData: [],
      firstMap: true,
      para_url: "",
      dateRange: "",
    }
  },
  props: {
    'datese': String,
    'updateMapDrug': String
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(this.$refs.char)
      const echarts = this.$echarts
      this.myChart.showLoading()
      const obj = this
      window.onresize = function () {
        this.myChart.resize()
      }
      getMapGeo().then(function (datas) {
        const usaJson = datas

        console.log("mapGeo:", usaJson)

        obj.myChart.hideLoading()
        echarts.registerMap('Shanghai', usaJson, {})
        obj.option = {
          title: {
            show: true,
            text: obj.dateRange,
            top: '75%',
            textStyle: {
              fontSize: 17
            }
          },
          tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
              var value = (params.value + '').split('.')
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
              return '报道数量<br/>' + params.name + ': ' + value
            }
          },
          visualMap: {
            left: 'right',
            top: '40%',
            min: 10,
            max: 0,
            inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            text: ['High', 'Low'],
            calculable: true
          },
          series: [
            {
              top: '0%',
              data: [],
              name: 'Shanghai PopEstimates',
              type: 'map',
              selectedMode: 'single',
              roam: true,
              map: 'Shanghai',
              itemStyle: {
                emphasis: { label: { show: true } }
              },
              // 文本位置修正
              textFixed: {
                Alaska: [20, -20]
              }

            }
          ]
        }
        obj.myChart.setOption(obj.option)
        //console.log(obj.option)
        obj.myChart.on('click', function (params) {
          const len1 = ('0' + obj.date.split('|')[0].substring(4)).length
          const len2 = ('0' + (parseInt(obj.date.split('|')[1].substring(4)) + 1)).length


          const startdate = obj.date.split('|')[0].substring(0, 4) + '-' + ('0' + obj.date.split('|')[0].substring(4)).substring(len1 - 2) + '-01'

          const enddate = obj.date.split('|')[1].substring(0, 4) + '-' + ('0' + (parseInt(obj.date.split('|')[1].substring(4)) + 1)).substring(len2 - 2) + '-01'
          obj.$router.push({
            path: '/table-list?province_name=' + params.name + '&start_date=' + startdate + '&end_date=' + enddate + obj.para_url + "&category_=短缺药相关"
          })
        })

      })
    },
    handleReportData (datas, date) {
      //console.log("handleReportData dispatched")
      const start = parseInt(date.split('|')[0])
      const end = parseInt(date.split('|')[1])
      const temp = []
      for (let item in datas) {
        item = datas[item]
        const time = item['year'] * 100 + item['month']
        if (time >= start && time <= end) {
          if (item['province'] in temp) {
            temp[item['province']] += item['count']
          } else {
            temp[item['province']] = item['count']
          }
        }
      }
      //console.log(temp)
      let result = []
      Object.assign(result, mapTem)
      //console.log(mapTem)
      result.forEach(item => {
        if (item["name"] in temp)
          item['value'] = temp[item['name']]
        else
          item['value'] = 0
      })
      //console.log(result)
      return result
    },
    getMax (report) {
      let max = report[0]['value']
      for (const item in report) {
        if (max < report[item]['value']) {
          max = report[item]['value']
        }
      }
      return max
    },
    getMin (report) {
      let min = report[0]['value']
      for (const item in report) {
        if (min > report[item]['value']) {
          min = report[item]['value']
        }
      }
      return min
    },
    drawNewMap(data, date) {
      const reports = this.handleReportData(data, date)
      const max = this.getMax(reports)
      const min = this.getMin(reports)

      //console.log(reports)

      //console.log(this.option)
      this.myChart.setOption({
        title:{
          text: this.dateRange
        },
        visualMap: {
          max: max,
          min: min
        },
        series: [{
          data: reports
          //type: 'map'
        }]
      })
    },
    updateMap (date, drug, reload) {
      //console.log("start to up")
      const obj = this
      this.date = date
      this.drug = drug
      //console.log("current drug is ", this.drug)
      if (drug != ""){
        this.para = "&drug_name=" + this.drug
        this.para_url = "&drug=" + this.drug
      }
      else{
        this.para = ""
      }

      if (reload){
        getMapRe(obj.para).then(function (datas) {
          datas = datas["data"]
          //console.log(datas)
          obj.rawData = datas
          obj.drawNewMap(datas, date)
        })
      }
      else {
        //console.log("Update map without reloading")
        this.drawNewMap(this.rawData, date)
      }

    }
  },
  watch: {
    'updateMapDrug': function (val) {
      //console.log(val)
      this.updateMap(this.date, val, true)
    }
  }
}
</script>
