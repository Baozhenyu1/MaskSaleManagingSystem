<template>
  <div id="saleReservation" :style="{height: '650px',marginTop:'-15px'}"></div>
</template>

<script>
import mapGeojson from '@/assets/geojson/shmap.json'
import { getSaleReservationData } from '@/api/manage'
export default {
  name: 'SaleReservationMap',
  data1: {},
  data2: {},
  myChart: {},
  data () {
    return {
    }
  },

  mounted () {
    this.drawMap()
    this.updateData()
    const that = this
    setInterval(function () {
      that.updateData()
    }, 10 * 1000)
  },
  methods: {
    drawMap () {
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.getElementById('saleReservation'))
      const echarts = this.$echarts
      this.myChart.showLoading()
      const json = {}
      json['type'] = 'FeatureCollection'
      json['features'] = []
      for (const index in mapGeojson['features']) {
        const feature = {}
        feature['id'] = index + 1
        feature['type'] = 'Feature'
        feature['properties'] = { 'name': mapGeojson['features'][index]['properties']['ADMINNAME'] }
        feature['geometry'] = mapGeojson['features'][index]['geometry']
        json['features'].push(feature)
      }
      const option = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            const value = (params.value * 100).toFixed(1) + '%'
            return '销售预约比<br/>' + params.name.substr(0, 2) + ': ' + value
          }
        },
        visualMap: {
          left: 'right',
          top: 'top',
          precision: 2, // 小数精度为两位小数
          inRange: {
            color: ['#8A2128', '#D23338', '#EA5F58', '#F9A78F', '#FAF1D0']
          },
          text: ['100%', '0%']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '上海口罩销售预约情况',
            type: 'map',
            roam: false,
            map: 'SH'
          }
        ]
      }
      echarts.registerMap('SH', json, {})
      this.myChart.hideLoading()
      this.myChart.setOption(option)
    },
    calMin (data) {
      const districts = ['宝山区', '崇明区', '奉贤区', '虹口区',
        '黄浦区', '嘉定区', '金山区', '静安区',
        '闵行区', '浦东新区', '普陀区', '青浦区',
        '松江区', '徐汇区', '杨浦区', '长宁区']
      let min = 1
      districts.forEach(district => {
        if (data[district] < min) {
          min = data[district]
        }
      })
      return min
    },
    calMax (data) {
      const districts = ['宝山区', '崇明区', '奉贤区', '虹口区',
        '黄浦区', '嘉定区', '金山区', '静安区',
        '闵行区', '浦东新区', '普陀区', '青浦区',
        '松江区', '徐汇区', '杨浦区', '长宁区']
      let max = 0
      districts.forEach(district => {
        if (data[district] > max) {
          max = data[district]
        }
      })
      return max
    },
    updateData () {
      const districts = ['宝山区', '崇明区', '奉贤区', '虹口区',
        '黄浦区', '嘉定区', '金山区', '静安区',
        '闵行区', '浦东新区', '普陀区', '青浦区',
        '松江区', '徐汇区', '杨浦区', '长宁区']
      const obj = this
      getSaleReservationData().then(function (data) {
        const handledData = districts.map(district => {
          return { 'name': district, 'value': data[district] }
        })
        const min = obj.calMin(data)
        const max = obj.calMax(data)
        const minText = (min * 100).toFixed(2) + '%'
        const maxText = (max * 100).toFixed(2) + '%'
        obj.myChart.setOption({
          visualMap: {
            min: min,
            max: max,
            text: [maxText, minText]
          },
          series: [
            {
              type: 'map',
              map: 'SH',
              data: handledData
            }
          ]
        })
      })
    }
  }
}
</script>
