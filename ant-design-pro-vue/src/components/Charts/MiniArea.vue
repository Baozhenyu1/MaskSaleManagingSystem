<template>
  <div class="mini-area">
    <div class="chart-wrapper" :style="{ height: 46 }">
      `<div force-fit="true" id="main" style="left: -10%; width: 120%; height: 80%;"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'MiniArea',
  data1: {},
  data () {
    return {
      rate: [],
      myChart: {},
      timeStamp: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      testData: [322, 113, 443, 123, 143, 445, 661, 627, 103, 629],
      option: {}
    }
  },
  mounted () {
    this.draw()
    this.test()
  },
  methods: {
    draw () {
      this.rate = this.areaData
      this.myChart = echarts.init(document.getElementById('main'))

      // 指定图表的配置项和数据
      this.option = {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.timeStamp,
          show: false
        },
        yAxis: {
          type: 'value',
          show: false
        },
        grid: {
          show: false
        },
        series: [{
          data: this.areaData,
          type: 'line',
          smooth: true,
          itemStyle: { normal: { areaStyle: { type: 'default' } } }
        }],
        animationDurationUpdate: 800,
        animationEasingUpdate: 'quinticOut',
        animationDuration: 100,
        color: ['#0080ff', '#4cd5ce'],
        trigger: 'axis',
        tooltip: {
          show: true,
          hideDelay: 500
        }
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(this.option)
    },
    test () {
      this.intnum = setInterval(_ => {
        this.timeStamp.splice(0, 1)
        this.timeStamp.push(this.timeStamp[this.timeStamp.length - 1] + 1)
        this.myChart.setOption({
          xAxis: {
            data: this.timeStamp
          },
          series: [{
            data: this.areaData
          }]
        })
        // this.sendData()
      }, 1000)
    }
  },
  props: {
    areaData: Array
  },
  watch: {
    areaData: {
      deep: true,
      handler (val, oldVal) {
        this.timeStamp.splice(0, 1)
        this.timeStamp.push(this.timeStamp[this.timeStamp.length - 1] + 1)
        this.myChart.setOption({
          xAxis: {
            data: this.timeStamp
          },
          series: [{
            data: this.areaData
          }]
        })
      }
    }
  }
}
</script>
<style scoped>
  * {
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
