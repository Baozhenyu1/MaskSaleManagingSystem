<template>
  <div id="saleReservation" :style="{height: '800px'}"></div>
</template>

<script>
  import mapGeojson from '@/assets/geojson/shmap.json';
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
      this.drawMap();
      this.updateData();
      const that = this;
      setInterval(function() {
        that.updateData();
      },10*1000)
    },
    methods: {
      drawMap () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(document.getElementById("saleReservation"))
        const echarts = this.$echarts;
        this.myChart.showLoading();
        let json = {};
        json['type'] = 'FeatureCollection';
        json['features'] = [];
        for(let index in mapGeojson['features']) {
          let feature = {};
          feature['id'] = index + 1;
          feature['type'] = 'Feature';
          feature['properties'] = { 'name': mapGeojson['features'][index]['properties']['ADMINNAME'] };
          feature['geometry'] = mapGeojson['features'][index]['geometry']
          json['features'].push(feature)
        }
        const option = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: function (params) {
            let value = (params.value * 100).toFixed(1) + '%';
            return '销售预约比<br/>' + params.name.substr(0,2) + ': ' + value
          }
        },
        visualMap: {
          type:'piecewise',
          left: 'right',
          top:'top',
          precision: 2, //小数精度为两位小数
          pieces:[
            {'min':0,'max':0.50, label:'0%-50%'},
            {'min':0.5,'max':0.6, label:'50%-60%'},
            {'min':0.6,'max':0.7, label:'60%-70%'},
            {'min':0.7,'max':0.9, label:'70%-90%'},
            {'min':0.9,'max':1.0, label:'90%-100%'},
          ],
          color: ['#FAF1D0','#F9A78F','#EA5F58', '#D23338','#8A2128']
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        series: [
          {
            name: '上海口罩销售预约情况',
            type: 'map',
            roam: false,
            map: 'SH',
          }
        ]
        };
        echarts.registerMap('SH', json,{});
        this.myChart.hideLoading();
        this.myChart.setOption(option);
      },
      updateData () {
        let districts = ['宝山区', '崇明区', '奉贤区', '虹口区',
          '黄浦区', '嘉定区', '金山区', '静安区',
          '闵行区', '浦东新区', '普陀区', '青浦区',
          '松江区', '徐汇区', '杨浦区', '长宁区'];
        const obj = this;
        getSaleReservationData().then(function (data) {
          let handledData = districts.map(district=>{
            return {'name':district, 'value':data[district]}
          });
          obj.myChart.setOption({
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