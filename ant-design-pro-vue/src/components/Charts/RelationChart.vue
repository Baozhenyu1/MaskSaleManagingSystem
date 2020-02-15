<template>
  <div id="myMapChart" ref="chart" :style="{height: '500px'}"></div>
</template>

<script>
import { getCompanyDrugCount } from '@/api/manage'

export default {
  name: "RelationChart",
  components: {
    getCompanyDrugCount
  },
  myChart: {},
  data () {
    return {

    }
  },
  mounted () {
    this.drawMap()
  },
  methods: {
    drawMap() {
      const obj = this
      this.myChart = this.$echarts.init(this.$refs.chart)
      const echarts = this.$echarts
      this.myChart.showLoading()

      getCompanyDrugCount(40).then(function (data){

        console.log(data)

        obj.myChart.hideLoading()

        let graph = data
        graph.categories = [{name:'公司'},{name:'药品'}];

        let min = graph.nodes[0].value
        let max = graph.nodes[0].value

        for (let node in graph.nodes) {
          if (graph.nodes[node].value > max) max = graph.nodes[node].value
          if (graph.nodes[node].value < min) min = graph.nodes[node].value
        }

        //console.log(max, min)

        for (let node in graph.nodes) {
          graph.nodes[node]["symbolSize"] = 10 + (graph.nodes[node].value - min) / (max - min) * 40
        }

        min = graph.links[0].weight
        max = graph.links[0].weight

        for (let link in graph.links) {
          if (graph.links[link].weight > max) max = graph.links[link].weight
          if (graph.links[link].weight < min) min = graph.links[link].weight
        }

        for (let i in graph.links) {
          graph.links[i]["lineStyle"] = {normal: {width: 1 + (graph.links[i].weight - min) / (max - min) * 9, show : true, color: 'target', curveness: 0.3}}
        }



        let option = {
          tooltip : {//提示框，鼠标悬浮交互时的信息提示
            trigger: 'item',//数据触发类型
            formatter: function(params){//触发之后返回的参数，这个函数是关键
              if (params.data.category != undefined) {//如果触发节点
                //console.log(params.data)
                return params.data.name;//返回标签
              }else {//如果触发边
                //console.log(params.data)
                //return '关系:'+params.data;
              }
            },
          },
          //工具箱，每个图表最多仅有一个工具箱
          toolbox: {
            show : true,
            feature : {//启用功能
              //dataView数据视图，打开数据视图，可设置更多属性,readOnly 默认数据视图为只读(即值为true)，可指定readOnly为false打开编辑功能
              dataView: {show: true, readOnly: true},
              restore : {show: true},//restore，还原，复位原始图表
              saveAsImage : {show: true}//saveAsImage，保存图片
            }
          },
          //全局颜色，图例、节点、边的颜色都是从这里取，按照之前划分的种类依序选取
          color:['rgb(194,53,49)','rgb(100,70,150)'],
          //图例，每个图表最多仅有一个图例

          legend: [{
            x: 'left',//图例位置
            //图例的名称，这里返回短名称，即不包含第一个，当然你也可以包含第一个，这样就可以在图例中选择主干人物
            data: graph.categories.map(function (a) {
              return a.name;
            })
          }],
          //sereis的数据: 用于设置图表数据之用
          series : [
            {
              name: '人际关系网络图',//系列名称
              type: 'graph',//图表类型
              layout: 'force',//echarts3的变化，force是力向图，circular是和弦图
              draggable: true,//指示节点是否可以拖动
              data: graph.nodes,//节点数据
              links: graph.links,//边、联系数据
              categories: graph.categories,//节点种类
              focusNodeAdjacency:true,//当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点
              roam: true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
              label: {//图形上的文本标签，可用于说明图形的一些数据信息
                normal: {
                  show : true,//显示
                  position: 'right',//相对于节点标签的位置
                  //回调函数，你期望节点标签上显示什么
                  formatter: function(params){
                    //console.log(params)
                    return params.data.name;
                  },
                }
              },
              //节点的style
              itemStyle:{
                normal:{
                  opacity:0.9,//设置透明度为0.8，为0时不绘制
                },
              },
              // 关系边的公用线条样式
              //lineStyle: {
              //  normal: {
              //    show : true,
              //    color: 'target',//决定边的颜色是与起点相同还是与终点相同
              //    curveness: 0.3,//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
              //  }
              //},
              force: {
                edgeLength: [100,200],//线的长度，这个距离也会受 repulsion，支持设置成数组表达边长的范围
                repulsion: 120,//节点之间的斥力因子。值越大则斥力越大
                gravity: 0.045
              }
            }
          ]
        };

        for (let node in graph.nodes) {
          graph.nodes[node].label = {normal: {
              show: graph.nodes[node].symbolSize > 10
            }}
        }

        //console.log(option)

        obj.myChart.setOption(option)


        /*
        graph.nodes = [
          {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）', symbolSize: 50},
          {category:1, name: '丽萨-乔布斯',value : 2},
          {category:1, name: '保罗-乔布斯',value : 3},
          {category:1, name: '克拉拉-乔布斯',value : 3},
          {category:1, name: '劳伦-鲍威尔',value : 7},
          {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
          {category:2, name: '奥巴马',value : 8},
          {category:2, name: '比尔-盖茨',value : 9},
          {category:2, name: '乔纳森-艾夫',value : 4},
          {category:2, name: '蒂姆-库克',value : 4},
          {category:2, name: '龙-韦恩',value : 1},
        ]

        graph.links = [
          {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
          {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
          {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
          {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
          {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
          {source : '奥巴马', target : '乔布斯', weight : 1},
          {source : '比尔-盖茨', target : '乔布斯', weight : 6, name: '竞争对手'},
          {source : '乔纳森-艾夫', target : '乔布斯', weight : 1, name: '爱将'},
          {source : '蒂姆-库克', target : '乔布斯', weight : 1},
          {source : '龙-韦恩', target : '乔布斯', weight : 1},
          {source : '克拉拉-乔布斯', target : '保罗-乔布斯', weight : 1},
          {source : '奥巴马', target : '保罗-乔布斯', weight : 1},
          {source : '奥巴马', target : '克拉拉-乔布斯', weight : 1},
          {source : '奥巴马', target : '劳伦-鲍威尔', weight : 1},
          {source : '奥巴马', target : '史蒂夫-沃兹尼艾克', weight : 1},
          {source : '比尔-盖茨', target : '奥巴马', weight : 6},
          {source : '比尔-盖茨', target : '克拉拉-乔布斯', weight : 1},
          {source : '蒂姆-库克', target : '奥巴马', weight : 1}
        ]
        graph.categories = [{name:'主干人物'},{name:'家人'},{name:'朋友'} ];
        */



      })





      this.myChart.hideLoading()

    }
  }
}
</script>

<style scoped>

</style>