<template>
  <page-view title="区域信息统计表" logo="">
    <a-card :bordered="true">
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

    <a-card :bordered="true" style="margin-top: 12px">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">

            <a-col :md="8" :sm="24">
              <a-form-item label="日期">
                <a-date-picker
                  v-model="queryParam.date"
                  style="width: 100%"
                  @change="handleSearch"
                  placeholder="请选择日期"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="{ float: 'left', overflow: 'hidden' }">
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>


      <a-table
        size="small"
        :scroll="{x: 930, y: 3600}"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered">
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
  import {getAnalysisList} from '@/api/manage'
  import {PageView} from '@/layouts'
  import moment from 'moment'


  function table2excel(jsonData, date) {
    //要导出的json数据
    let str = '市辖区,指定药店数量,上报药店数量,上报比例,上报药店配额,上报药店进货量,昨日售后结余,损耗量,上报药店售出量,售出比例,当前库存\n';
    for (let i = 0; i < jsonData.length; i++) {
      for (let item in jsonData[i]) {
        if (item == "reported" || item == "sale") {
          let new_str = jsonData[i][item].replace(" ", "").replace("(", ",").replace(")", ",")
          str += new_str;
        } else {
          str += `${jsonData[i][item]},`;
        }
      }
      str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "上海市口罩销售区域统计表(" + date + ").csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export default {
    name: "DistrictList",
    components: {
      PageView
    },
    data() {
      return {
        columns: [
          {dataIndex: 'district', key: '1', title: '市辖区', className: 'table-header', width: '90px', align: 'center'},
          {dataIndex: 'pharmacy', key: '2', title: '指定药店数量', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'reported', key: '3', title: '上报药店数量', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'quota', key: '4', title: '上报药店配额', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'purchased', key: '5', title: '上报药店进货量', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'yesterday', key: '6', title: '昨日售后结余', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'loss', key: '7', title: '损耗量', className: 'table-header', width: '90px', align: 'center'},
          {dataIndex: 'sale', key: '8', title: '上报药店售出量', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'inventory', key: '9', title: '当前库存', className: 'table-header', width: '110px', align: 'center'}
        ],
        data: [],
        loading: false,
        bordered: true,
        pagination: {pageSize: 20, hideOnSinglePage: true},
        quotaTotal: 0,
        count: 0,
        queryParam: {},
        defaultTime: moment().format("YYYY-MM-DD"),
        dataTotal: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      pushList(data) {
        this.data = []
        for (let i = 0; i < data.length; i++) {
          this.data.push({
            district: data[i]["district"],
            pharmacy: data[i]["store_num"],
            reported: data[i]["post_num"] + ' (' + (data[i]["post_percent"] * 100).toFixed(1) + '%)',
            quota: data[i]["quota"],
            purchased: data[i]["purchased"],
            yesterday: data[i]["yesterday"],
            loss: data[i]["loss"],
            sale: data[i]["sell"] + ' (' + (data[i]["sell_percent"] * 100).toFixed(1) + '%)',
            inventory: data[i]["remain"]
          })
        }
      },
      init() {
        let obj = this
        this.loading = true
        getAnalysisList({district: '区', date: obj.defaultTime}).then(function (data) {
          data = data["data"]
          obj.pushList(data)
          obj.loading = false
        })
        this.loading = true
        this.dataTotal = []
        getAnalysisList({district: '上海市', date: obj.defaultTime}).then(function (data) {
          data = data["data"]
          obj.dataTotal.push({
            district: data[0]["district"],
            pharmacy: data[0]["store_num"],
            reported: data[0]["post_num"] + ' (' + (data[0]["post_percent"] * 100).toFixed(1) + '%)',
            quota: data[0]["quota"],
            purchased: data[0]["purchased"],
            yesterday: data[0]["yesterday"],
            loss: data[0]["loss"],
            sale: data[0]["sell"] + ' (' + (data[0]["sell_percent"] * 100).toFixed(1) + '%)',
            inventory: data[0]["remain"]
          })
          obj.loading = false
        })


      },
      download() {
        console.log("download here")
        table2excel(this.data, this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"))
      },
      handleSearch() {
        let date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")
        let para = {district: '区', date: date}
        let obj = this
        this.loading = true
        getAnalysisList(para).then(function(data) {
          data = data["data"]
          obj.pushList(data)
          obj.loading = false
        })

        this.loading = true
        this.dataTotal = []
        getAnalysisList({district: '上海市', date: date}).then(function (data) {
          console.log("Shanghai data", data)
          data = data["data"]
          obj.dataTotal.push({
            district: data[0]["district"],
            pharmacy: data[0]["store_num"],
            reported: data[0]["post_num"] + ' (' + (data[0]["post_percent"] * 100).toFixed(1) + '%)',
            quota: data[0]["quota"],
            purchased: data[0]["purchased"],
            yesterday: data[0]["yesterday"],
            loss: data[0]["loss"],
            sale: data[0]["sell"] + ' (' + (data[0]["sell_percent"] * 100).toFixed(1) + '%)',
            inventory: data[0]["remain"]
          })
          obj.loading = false
        })

      },
      reset() {
        this.queryParam = {}
        this.init()
      }
    }
  }
</script>

<style scoped>

</style>