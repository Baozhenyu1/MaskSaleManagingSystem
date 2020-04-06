<template>
  <div>
    <div  id="main" style="height: 600px;width: 60%"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getSellReservation } from '@/api/manage'

export default {
  name: 'LineChart',
  data () {
    return {
      rate: [],
      myChart: {},
      appointmentTotal: [],
      axisX: [],
      saleTotal: [],
      option: {}
    }
  },
  mounted () {
    this.loadData();
  },
  methods: {
    draw () {
      this.myChart = echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      const obj = this
      this.option = {
        backgroundColor: '#FBFBFB',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['累计预约量', '累计销售量'],
          top:20
        },
        grid: {
          left: 50,
          right: 50,
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: obj.axisX,
          axisTick: {
            alignWithLabel: true
          },
          boundaryGap:true,
          axisLine: {
            onZero: false,
          },
        },
        yAxis: {
          name: '户数(万户)',
          nameLocation: 'middle',
          nameGap:40,
          type: 'value'
        },
        series: [
          {
            name: '累计预约量',
            type: 'line',
            symbolSize:10,
            color:['#3FA7DC'],
            symbol: 'circle',
            smooth: true,
            data: obj.appointmentTotal,
            itemStyle : { normal: {label : {show: true}}}
          },
          {
            name: '累计销售量',
            type: 'line',
            symbolSize:10,
            color:['orange'],
            symbol: 'circle',
            smooth: true,
            data: obj.saleTotal,
            itemStyle : { normal: {label : {show: true}}}
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(this.option)
    },
    dateFormat(date){
     const splits = date.split('-');
     const month = parseInt(splits[0]);
     const day = parseInt(splits[1]);
     return month + '月' + day + '日'
    },
    loadData(){
      let that = this;
      getSellReservation().then(data=>{
        console.log(data)
        that.appointmentTotal = [];
        that.axisX = [];
        that.saleTotal = [];
        for(let index in data){
          if(index === '03-03'){
            continue;
          }
          that.axisX.push(that.dateFormat(index))
          that.appointmentTotal.push((data[index]['reserve'] / 10000).toFixed(1))
          that.saleTotal.push((data[index]['sell'] / 10000).toFixed(1))
        }
        that.draw();
      })
    }
  }
}
</script>

<style scoped>

</style>
