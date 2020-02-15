<template>
  <div id="myChart" ref="chart" :style="{height: '360px'}"></div>
</template>
<script>
  import {getLineChart} from '@/api/manage'
  import moment from 'moment'

  export default {
    name: 'ReportBar',
    data() {
      return {
        myChart: {},
        testData: [
          {time: 'asdasdasda', num: 1},
          {time: 'asdasdasda', num: 2},
          {time: 'asdasdasda', num: 3},
          {time: 'asdasdasda', num: 4},
          {time: 'asdasdasda', num: 5},
          {time: 'asdasdasda', num: 6},
          {time: 'asdasdasda', num: 7},
          {time: 'asdasdasda', num: 8},
          {time: 'asdasdasda', num: 9}
        ],
        data: [],
        data1: {},
        intnum: undefined
      }
    },
    mounted() {
      this.draw()
      this.intnum = setInterval(_ => {
        this.updateChart()
      }, 60 * 1000 * 10)
    },
    Stop() {
      clearInterval(this.intnum)
    },
    methods: {
      draw() {
        // 基于准备好的dom，初始化echarts实例
        const myChart = this.$echarts.init(this.$refs.chart)
        const obj = this
        this.myChart = myChart
        window.onresize = function () {
          myChart.resize()
        }

        getLineChart().then(function (data) {
          //console.log("data", data)
          data = data["data"]
          obj.drawMap(data)
        })
      },
      drawMap(datas) {
        this.data1 = this.splitData(datas)
        //console.log("this.data1", this.data1)
        const a = this
        // 绘制图表
        const option = {
          backgroundColor: '#fff',
          animation: false,
          legend: {
            bottom: 10,
            left: 'center',
            data: ['report number']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
              let obj = { top: 10 }
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
              return obj
            },
            formatter: function (datas) {
              let res = datas[0].name + '<br/>'
              res += datas[0].marker + datas[0].seriesName + '：' +
                datas[0].value + '<br/>'
              return res
            }
          },
          axisPointer: {
            link: { xAxisIndex: 'all' },
            label: {
              backgroundColor: '#777'
            }
          },
          toolbox: {
            show: false
          },
          brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
              colorAlpha: 0.1
            }
          },
          grid: [
            {
              left: '15%',
              right: '8%',
              height: '50%',
              top: '5%'
            },
            {
              left: '15%',
              right: '8%',
              top: '65%',
              height: '16%'
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: a.data1.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              splitLine: { show: false },
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax',
              axisPointer: {
                z: 100
              }
            },
            {
              type: 'category',
              gridIndex: 1,
              data: a.data1.categoryData,
              scale: true,
              boundaryGap: false,
              axisLine: { onZero: false },
              axisTick: { show: false },
              splitLine: { show: false },
              axisLabel: { show: false },
              splitNumber: 20,
              min: 'dataMin',
              max: 'dataMax'
            }
          ],
          yAxis: [
            {
              scale: true,
              splitArea: {
                show: false
              },
              splitLine: {
                show: false
              }
            },
            {
              scale: true,
              gridIndex: 1,
              splitNumber: 2,
              axisLabel: { show: false },
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: { show: false }
            }
          ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0, 1],
              start: 50,
              end: 100
            },
            {
              show: true,
              xAxisIndex: [0, 1],
              type: 'slider',
              top: '90%',
              start: 50,
              end: 100
            }
          ],
          series: [
            {
              name: '口罩销量',
              type: 'line',
              data: a.data1.values,
              smooth: false,
              lineStyle: {
                normal: {
                  opacity: 0.5,
                  color: '#1890ff'
                }
              },
              itemStyle: {
                normal: {
                  color: '#1890ff'
                }
              }
            },
            {
              position: 'relative',
              name: '口罩销量',
              type: 'bar',
              xAxisIndex: 1,
              yAxisIndex: 1,
              data: a.data1.values,
              itemStyle: {
                normal: {
                  color: '#1890ff'
                }
              }
            }
          ]
        }
        this.myChart.setOption(option, true)
        //console.log(this.data1.values)
      },
      splitData(rawData) {
        const data = rawData
        const categoryData = []
        const values = []
        //console.log(data)
        for (const i in data) {
          categoryData.push(data[i].time)
          values.push(data[i].num)
        }
        return {
          categoryData: categoryData,
          values: values
        }
      },
      updateChart() {
        let obj = this
        getLineChart().then(function (data) {
          data = data["data"]
          obj.data1 = obj.splitData(data)
          obj.myChart.setOption({
            xAxis: [
              {
                data: obj.data1.categoryData
              },
              {
                data: obj.data1.categoryData
              }
            ],
            series: [
              {
                data: obj.data1.values,
              },
              {
                data: obj.data1.values
              }
            ]
          })
        })
      }
    }
  }
</script>
