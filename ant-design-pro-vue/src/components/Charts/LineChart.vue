<template>
  <div force-fit="true" id="main" style="width: 100%; height: 360px;"></div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "LineChart",
    data() {
      return {
        rate: [],
        myChart: {},
        appointmentTotal: [1087.7, 1530.7, 1785.2, 1976.8, 2100.5, 2193.3, 2325.3, 2450.7, 2622.0],
        axisX: ['2月2日', '2月3日', '2月4日', '2月5日', '2月6日', '2月7日', '2月8日', '2月9日', '2月10日'],
        saleTotal: [undefined, 166.4, 336.4, 511.9, 686.2, 862.1, 1035.8, 1190.3, 1343.1],
        option: {}
      }
    },
    mounted() {
      this.draw()
    },
    methods: {
      draw() {
        this.myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        let obj = this
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['累计预约量', '累计销售量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: obj.axisX
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '累计预约量',
              type: 'line',
              data: obj.appointmentTotal
            },
            {
              name: '累计销售量',
              type: 'line',
              data: obj.saleTotal
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(this.option);
      },
      test() {
        this.intnum = setInterval(_ => {
          this.timeStamp.splice(0, 1)
          this.timeStamp.push(this.timeStamp[this.timeStamp.length - 1] + 1)
          this.myChart.setOption({
            xAxis: {
              data: this.timeStamp
            },
            series: [{
              data: this.show_data
            }]
          });
        }, 1000)
      }
    }
  }
</script>

<style scoped>

</style>