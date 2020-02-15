<template>
  <div class="page-header-index-wide">

    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="今日上报药店数量" :total="pharmacyReported">
          <a-tooltip title="今日上报药店数量" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-bar :show_data="reportList"/>
          </div>
          <template slot="footer">指定药店总数量<span>&nbsp;{{ pharmacySelected }}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="药店进货总量" :total="distributed">
          <a-tooltip title="药店进货总量" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            {{"损耗：" + loss}}
          </div>
          <template slot="footer">政府配额总量<span> {{ distributedTotal }}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="今日全市口罩销售量" :total="saleNum">
          <a-tooltip title="今日全市口罩销售量" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-bar :show_data="saleNumList"/>
          </div>
          <template slot="footer">历史累计销售量<span>&nbsp;{{ saleNumTotal }}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="今日药店口罩剩余库存" :total="inventory">
          <a-tooltip title="全市药店口罩剩余库存" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <template slot="footer">昨日结余量<span>&nbsp;{{ inventoryTotal }}</span></template>
        </chart-card>
      </a-col>


    </a-row>


    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="药店上报比例" :total="reportPercentage + ' %'">
          <a-tooltip title="今日上报药店数量/指定药店总数量" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <a-tooltip :title="pharmacyReported + '/' + pharmacySelected">
            <a-progress :percent="reportPercentage"/>
          </a-tooltip>
          <template slot="footer"><span>&nbsp;</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="售空药店数量" :total="soldOut">
          <a-tooltip title="当前库存为 0" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <a-tooltip :title="soldOut + '/' + pharmacyReported">
            <a-progress :percent="soldOutPercentage"/>
          </a-tooltip>
          <template slot="footer">售空药店比例<span> {{ soldOutPercentage + ' %'}}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="口罩售出比例" :total="salePercentage + ' %'">
          <a-tooltip title="今日全市口罩销售量/（今日全市口罩销售量+今日药店口罩剩余库存）" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <a-tooltip :title="saleNum + '/' + (inventory+ saleNum)">
            <a-progress :percent="salePercentage"/>
          </a-tooltip>
          <template slot="footer"><span>&nbsp;</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '12px' }">
        <chart-card :loading="loading" title="实时填报量" :total="realTimeReport">
          <a-tooltip title="10s 内填报次数" slot="action">
            <a-icon type="info-circle-o"/>
          </a-tooltip>
          <div>
            <mini-area :style="{ marginBottom: '-25px'}" :show_data="realTimeList"/>
          </div>
          <template slot="footer">今日填报次数<span>&nbsp;{{ reportTimes }}</span></template>
        </chart-card>
      </a-col>

    </a-row>

    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
        <a-card :bordered="false" title="信息流" :style="{ height: '460px'}">
          <div>
            <information-liquid/>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
        <a-card :bordered="false" title="口罩销量趋势" :style="{ height: '460px'}">
          <div style="margin-top: 0px">
            <report-bar/>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
        <a-card :bordered="false" title="各市辖区销售预约比" :style="{ height: '650px'}">
          <div>
            <SaleReservationMap/>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="12" :style="{ marginBottom: '12px' }">
        <a-card :bordered="false" title="各市辖区销售比例" :style="{ height: '650px'}">
          <div style="margin-top: 0px">
            <SaleMap :district="highlight"/>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card title="实时全市统计表" style="margin-bottom: 12px">
      <a-table
        size="small"
        class="test-table"
        :scroll="{x: 930, y: 3600}"
        :columns="columns"
        :dataSource="dataTotal"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered">
      </a-table>
    </a-card>

    <a-card title="实时区域信息表">

      <template>
        <a-table
          size="small"
          :columns="columns"
          :dataSource="data"
          :scroll="{ x: 1000, y: 3600 }"
          :loading="loading"
          :bordered="bordered"
          :pagination="pagination"
          @change="handleTableChange">

          <template slot="footer" slot-scope="currentPageData">
            <div style="text-align: right">
              {{footer}}
            </div>
          </template>
        </a-table>
      </template>


    </a-card>


  </div>
</template>


<script>

  import moment from 'moment'
  import {
    MapInformation,
    ChartCard,
    MiniBar,
    MiniArea,
    MiniProgress,
    InformationLiquid,
    ReportBar,
    SaleMap,
    SaleReservationMap
  } from '@/components'
  import {mixinDevice} from '@/utils/mixin'
  import {getAnalysisList} from '@/api/manage'

  function sortByKey(array, key) {
    return array.sort(function (a, b) {
      let x = a[key];
      let y = b[key];
      return ((x - y > 0) ? -1 : ((x - y < 0) ? 1 : 0));
    })
  }


  export default {
    name: 'Analysis',
    mixins: [mixinDevice],
    components: {
      SaleMap,
      SaleReservationMap,
      ChartCard,
      MiniBar,
      MiniProgress,
      MiniArea,
      InformationLiquid,
      ReportBar
    },
    data() {
      return {
        pharmacyReported: 0,
        pharmacySelected: 0,
        reportList: [],
        saleNum: 0,
        saleNumTotal: 0,
        saleNumList: [],
        inventory: 0,
        inventoryTotal: 0,
        salePercentage: 0,
        reportPercentage: 0,
        distributed: 0,
        distributedTotal: 0,
        soldOut: 0,
        soldOutPercentage: 0,
        realTimeReport: 0,
        realTimeList: [],
        reportTimes: 0,
        queryParam: {},
        bordered: true,
        data: [],
        dataTmp: [],
        loading: true,
        pagination: {pageSize: 20, hideOnSinglePage: true},
        footer: '',
        columns: [],
        path: "ws://111.229.63.2:8000/ws",
        socket: null,
        intnum: undefined,
        loss: 0,
        dataTotal: [],
        dataTotalTmp: [],
        highlight: ''
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      //this.testHighlight()
      this.initWebSocket();
      this.loadAnalysisList();
    },
    methods: {
      testHighlight() {
        console.log("Start test")
        let districtList= ["黄浦区","徐汇区","长宁区","静安区","普陀区",
          "虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"]
        let i = 0
        let obj = this
        let h = setInterval(_ =>{
          obj.highlight = districtList[i]
          i = (i + 1) % 16
        }, 20 * 1000)
      },
      loadAnalysisList() {
        this.columns = [
          {dataIndex: 'area', key: '1', title: '市辖区', width: 90, className: 'table-header', align: 'center'},
          {dataIndex: 'pharmacy', key: '2', title: '指定药店数量', width: 110, className: 'table-header', align: 'center'},
          {dataIndex: 'reported', key: '3', title: '上报药店数量', width: 110, className: 'table-header', align: 'center'},
          {
            dataIndex: 'distribution',
            key: '4',
            title: '上报药店配额',
            width: 110,
            className: 'table-header',
            align: 'center'
          },
          {
            dataIndex: 'distributed',
            key: '5',
            title: '上报药店进货量',
            width: 120,
            className: 'table-header',
            align: 'center'
          },
          {dataIndex: 'yesterday', key: '6', title: '昨日售后结余', width: 110, className: 'table-header', align: 'center'},
          {dataIndex: 'loss', key: '7', title: '损耗量', width: 80, className: 'table-header', align: 'center'},
          {dataIndex: 'soldNum', key: '8', title: '上报药店售出量', width: 140, className: 'table-header', align: 'center'},
          {dataIndex: 'inventory', key: '9', title: '当前库存', width: 100, className: 'table-header', align: 'center'}
        ];
        this.updateAnalysisList()
        this.intnum = setInterval(_ => {
          this.updateAnalysisList()
        }, 60 * 1000)
      },
      updateAnalysisList() {
        this.dataTmp = []
        //console.log("Analysis List updated")
        this.footer = "统计截至： " + moment().format("YYYY-MM-DD HH:mm:ss");

        let obj = this;
        getAnalysisList({district: '区', date: moment().format("YYYY-MM-DD")}).then(function (data) {
          //console.log("AnalysisList", data);
          data = data["data"]
          for (let i = 0; i < 16; i++) {
            obj.dataTmp.push({
              key: i,
              area: data[i]["district"],
              pharmacy: data[i]["store_num"],
              reported: data[i]["post_num"] + ' (' + String((data[i]["post_percent"] * 100).toFixed(1)) + '%)',
              reportPercentageValue: (data[i]["post_percent"] * 100).toFixed(1),
              distribution: data[i]["quota"],
              distributed: data[i]["purchased"],
              yesterday: data[i]["yesterday"],
              loss: data[i]["loss"],
              soldNum: data[i]["sell"] + ' (' + String((data[i]["sell_percent"] * 100).toFixed(1)) + '%)',
              inventory: data[i]["remain"]
            })
          }
          //console.log("sorted",sortByKey(obj.data, 'reportPercentage'))
          obj.data = sortByKey(obj.dataTmp, 'reportPercentageValue')
          //for (let i = 0; i < 16; i++) {
          //  obj.data[i].reportPercentage = String(obj.data[i].reportPercentage) + '%'
          //}
        })

        this.dataTotalTmp = []
        getAnalysisList({district: '上海市', date: moment().format("YYYY-MM-DD")}).then(function (data) {
          //console.log("Total updated", data);
          data = data["data"]
          obj.dataTotalTmp.push({
            key: 1,
            area: data[0]["district"],
            pharmacy: data[0]["store_num"],
            reported: data[0]["post_num"] + ' (' + String((data[0]["post_percent"] * 100).toFixed(1)) + '%)',
            reportPercentageValue: (data[0]["post_percent"] * 100).toFixed(1),
            distribution: data[0]["quota"],
            distributed: data[0]["purchased"],
            yesterday: data[0]["yesterday"],
            loss: data[0]["loss"],
            soldNum: data[0]["sell"] + ' (' + String((data[0]["sell_percent"] * 100).toFixed(1)) + '%)',
            inventory: data[0]["remain"]
          })
          obj.dataTotal = obj.dataTotalTmp
        })
      },
      updateReportPercentage() {
        if (this.pharmacySelected != 0) {
          this.reportPercentage = parseFloat((this.pharmacyReported / this.pharmacySelected * 100).toFixed(2))
        } else {
          this.reportPercentage = 0;
        }

      },
      updateSalePercentage() {
        if (this.inventory + this.saleNum != 0) {
          this.salePercentage = parseFloat((this.saleNum / (this.inventory + this.saleNum) * 100).toFixed(2))
        } else {
          this.salePercentage = 0
        }

      },
      updateSoldOutPercentage() {
        if (this.pharmacyReported != 0) {
          this.soldOutPercentage = parseFloat((this.soldOut / this.pharmacyReported * 100).toFixed(2))
        } else {
          this.soldOutPercentage = 0;
        }
      },
      initWebSocket() {
        if (typeof (WebSocket) === "undefined") {
          alert("您的浏览器不支持socket")
        } else {
          // 实例化socket
          this.socket = new WebSocket(this.path)

          console.log("链接成功")
          // 监听socket连接
          this.socket.onopen = this.websocketonopen
          // 监听socket错误信息
          this.socket.onerror = this.websocketonerror
          // 监听socket消息
          this.socket.onmessage = this.websocketonmessage

        }
      },
      websocketonmessage(e) {
        let tmp = e.data.split('/');
        let beginDay = (((new Date()).getTime()) - 24 * 60 * 60 * 1000 * 9);

        if (tmp[0] == 'P') {
          this.pharmacyReported = parseInt(tmp[10]);
          this.reportList = [];
          for (let i = 0; i < 10; i++) {
            this.reportList.push({
              x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
              y: parseInt(tmp[i + 1])
            });
          }
          this.updateReportPercentage();
          this.updateSoldOutPercentage()
        } else if (tmp[0] == "RP") {
          this.pharmacySelected = parseInt(tmp[1]);
          this.updateReportPercentage();
        } else if (tmp[0] == "S") {
          this.saleNum = parseInt(tmp[10]);
          this.saleNumTotal = parseInt(tmp[11]);
          this.saleNumList = [];
          for (let i = 0; i < 10; i++) {
            this.saleNumList.push({
              x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
              y: parseInt(tmp[i + 1])
            });
          }
          this.updateSalePercentage()
        } else if (tmp[0] == "RM") {
          this.inventory = parseInt(tmp[1]);
          this.inventoryTotal = parseInt(tmp[2]);
          this.updateSalePercentage()
        } else if (tmp[0] == "D") {
          //console.log("loss", tmp)
          this.distributed = parseInt(tmp[1]);
          this.distributedTotal = parseInt(tmp[2]);
          this.loss = parseInt(tmp[3])
        } else if (tmp[0] == "SO") {
          this.soldOut = parseInt(tmp[1]);
          this.updateSoldOutPercentage()
        } else if (tmp[0] == "T") {
          this.realTimeReport = parseInt(tmp[10])
          this.realTimeList = []
          for (let i = 0; i < 10; i++) {
            this.realTimeList.push(parseInt([tmp[i + 1]]))
          }
        } else if (tmp[0] == "C") {
          this.reportTimes = parseInt(tmp[1]);
        } else if (tmp[0] == "MAP") {
          console.log("highlight")
          if (tmp[1] == this.highlight) {
            this.highlight = tmp[1] + ' '
          } else {
            this.highlight = tmp[1]
          }
        } else {
          //console.log("Unknown message", tmp)
        }
      },
      websocketonerror() {
        console.log("连接失败，尝试重启")
        //this.initWebSocket()
      },
      websocketsend(Data) {//数据发送
        this.socket.send(Data);
      },
      websocketclose(e) {  //关闭
        //this.openNotification("websocket closed")
        console.log('断开连接', e);
      },
      websocketonopen() {
        //this.websocketsend("dashboard")
        console.log("我，准备好了")
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      handleTableChange(pagination, filters, sorter) {

      }
    },
    destroyed() {
      this.socket.close() //离开路由之后断开websocket连接
    },
    Stop() {
      clearInterval(this.intnum)
    }
  }
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, .45);
    cursor: pointer;
    transition: color .32s;
    color: black;
  }
</style>
