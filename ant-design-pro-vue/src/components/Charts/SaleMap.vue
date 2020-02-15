<template>
  <div id="saleMap" :style="{height: '800px'}"></div>
</template>

<script>
  import mapGeojson from '@/assets/geojson/shmap.json';
  import { getSaleData } from '@/api/manage'

  export default {
    name: 'SaleMap',
    data () {
      return {
        myChart:null
      }
    },
    mounted () {
      console.log("District", this.district)
      this.drawMap();
      this.updateData();
    },
    methods: {
      drawMap () {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(document.getElementById("saleMap"))
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
              return '销售比例<br/>' + params.name.substr(0,2) + ': ' + value
            }
          },
          visualMap: {
            min: 0,
            max: 1,
            left: 'right',
            top:'top',
            precision: 2, //小数精度为两位小数
            inRange:{
              color: ['#E0FFFF', '#BBE7F9','#95CFF4','#70B7EE', '#006EDD'],
            },
            text: ['100%','0%']
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
              name: '上海口罩销售情况',
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
        getSaleData().then(function (data) {
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
      },
      showHighlight(district, timeSlot=900, times=3) {
        const that = this;
        let h = setInterval(function() {
          that.myChart.dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            name: district
          })
          setTimeout(function() {
            that.myChart.dispatchAction({
              type: 'downplay',
              seriesIndex: 0,
              name: district
            })
          }, timeSlot)
        }, timeSlot * 2);
        setTimeout(function() {
          clearInterval(h);
        }, times * timeSlot * 2);
      }
    },
    props: {
      'district': String
    },
    watch: {
      'district': function(val) {
          console.log("District changed", val)
          this.showHighlight(val.replace(/ /g, ''))
        }
    }
  }
</script>