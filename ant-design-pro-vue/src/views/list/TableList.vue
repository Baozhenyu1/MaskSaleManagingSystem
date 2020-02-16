<template>
  <page-view title="药店填报信息表" logo="">
    <a-card :bordered="true">
      <a-table
        size="small"
        class="test-table"
        :scroll="{x: 930, y: 3600}"
        :columns="districtColumns"
        :dataSource="dataTotal"
        :loading="loading"
        :pagination="districtPagination"
        :bordered="bordered">
      </a-table>
    </a-card>

    <a-card :bordered="false" style="margin-top: 12px">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">

            <a-col v-if="authority" :md="8" :sm="24">
              <a-form-item label="市辖区">
                <a-select
                  showSearch
                  placeholder="请选择市辖区"
                  optionFilterProp="children"
                  v-model="queryParam.district"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in districtList" :value="item">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="24">
              <a-form-item label="是否填报">
                <a-select v-model="queryParam.reported" placeholder="请选择" default-value="0">
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请选择日期"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="关键词">
                <a-input v-model="queryParam.keyword" placeholder="请输入关键词"/>
              </a-form-item>
            </a-col>


            <a-col :md="authority ? 8 : 20" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="authority ? { float: 'left', overflow: 'hidden' } : { float: 'right', overflow: 'hidden' }">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
            </a-col>

            <a-col :md="authority ? 8 : 4" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>


      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <template>
              <div>
                <a :href="record.url" target="_blank">{{record.pharmacyName}}</a>
              </div>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
  import moment from 'moment'
  import {getTableList} from '@/api/manage'
  import {PageView} from '@/layouts'
  import user from '@/store/modules/user'
  import {getAnalysisList} from '@/api/manage'

  function table2excel(jsonData, tips) {
    //要导出的json数据
    let str = 'ID,市辖区,药店名,药店地址,联系人,联系电话,配额,进货量,昨日结余,已售数量,损耗量,剩余库存量,修改时间\n';
    for (let i = 0; i < jsonData.length; i++) {
      for (let item in jsonData[i]) {
        let new_str = String(jsonData[i][item]).replace(/,/g, '、')
        str += `${new_str},`;
      }
      str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "药店信息填报表(" + tips+ ").csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export default {
    name: 'TableList',
    components: {
      PageView
    },
    mounted() {
      this.refreshed = false
    },
    data() {
      return {
        districtList: [],
        refreshed: false,
        pageTitle: '药店列表',
        logo: '',
        queryParam: {},
        districtPagination:{pageSize: 20, hideOnSinglePage: true},
        pagination: {},
        bordered: true,
        resetted: false,
        loading: false,
        pageSize: 10,
        data: [],
        // 表头
        columns: [
          {key: 1, title: '市辖区', dataIndex: 'district', width: '100px', className: 'table-header'},
          {key: 2, title: '药店名', dataIndex: 'pharmacyName', width: '300px', className: 'table-header', scopedSlots: {customRender: 'action'}},
          {key: 3, title: '配额', dataIndex: 'distribution', width: '80px', className: 'table-header'},
          {key: 4, title: '进货量', dataIndex: 'distributed', width: '80px', className: 'table-header'},
          {key: 5, title: '昨日结余', dataIndex: 'remain', width: '80px', className: 'table-header'},
          {key: 6, title: '已售数量', dataIndex: 'sold', width: '80px', className: 'table-header'},
          {key: 7, title: '损耗量', dataIndex: 'loss', width: '80px', className: 'table-header'},
          {key: 8, title: '当前库存', dataIndex: 'inventory', width: '90px', className: 'table-header'},
          {key: 9, title: '修改时间', dataIndex: 'modificationTime', width: '110px', className: 'table-header'}
        ],
        districtColumns:[
          {dataIndex: 'district', key: '1', title: '市辖区', className: 'table-header', width: '90px', align: 'center'},
          {dataIndex: 'store_num', key: '2', title: '指定药店数量', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'post_num', key: '3', title: '上报药店数量', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'quota', key: '4', title: '上报药店配额', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'purchased', key: '5', title: '上报药店进货量', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'yesterday', key: '6', title: '上报药店昨日结余', className: 'table-header', width: '110px', align: 'center'},
          {dataIndex: 'loss', key: '7', title: '上报药店损耗量', className: 'table-header', width: '90px', align: 'center'},
          {dataIndex: 'sell', key: '8', title: '上报药店售出量', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'remain', key: '9', title: '上报药店当前库存', className: 'table-header', width: '110px', align: 'center'}
        ],
        dataTotal:[],
        authority: 1
      }
    },
    created() {
      this.authority = user.state.name == "shanghai"
      this.init()
      this.districtList = ["全上海市", "黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"];
    },
    methods: {
      cal_total(){

      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      pushList(datas) {
        this.data = []
        for (let item in datas) {
          this.data.push({
            district: datas[item]['district'],
            pharmacyName: datas[item]['phar_name'],
            distribution: datas[item]['phar_quota'],
            distributed: datas[item]['phar_data_purchased'],
            remain: datas[item]['remain'],
            sold: datas[item]['phar_data_issued'],
            loss: datas[item]['loss'],
            inventory: datas[item]['phar_data_balance'],
            modificationTime: datas[item]["phar_data_phar_date"],
            url: '/profile/basic?id=' + datas[item]['phar_id']
          })
          if (!this.refreshed)
            this.refreshed = true
        }
      },
      init() {
        if (!this.resetted)
          this.refreshed = false
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: this.pageSize})
        const pagination = {...this.pagination};

        this.loading = true
        getTableList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"])
          obj.loading = false
        })
        getAnalysisList({'date':para['date'], district: '区'}).then(function(data) {
          obj.dataTotal = [];
          let district = user.state.name === "shanghai"?'上海市':user.state.name;
          if('data' in data){
            data['data'].forEach(item=>{
              if(item['district'] === district){
                obj.dataTotal.push(item);
              }
            })
          }
        });
      },
      handleSearch() {
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: this.pageSize})
        this.loading = true
        const pagination = {...this.pagination};

        getTableList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          pagination.current = 1;
          obj.pushList(data["data"])
          obj.loading = false
        });
        getAnalysisList({'date':para['date']}).then(function(data) {
          obj.dataTotal = [];
          let district = user.state.name === "shanghai"?'上海市':user.state.name;
          if('data' in data){
            data['data'].forEach(item=>{
              if(item['district'] === district){
                obj.dataTotal.push(item);
              }
            })
          }
        });
      },
      handleTableChange(pagination, filters, sorter) {
        const obj = this
        const para = this.getPara({pageNo: pagination.current, pageSize: pagination.pageSize})
        const raw_pagination = {...this.pagination};
        raw_pagination.current = pagination.current
        this.pagination = raw_pagination
        this.loading = true
        getTableList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"])
          obj.loading = false
        })
      },
      reset() {
        this.queryParam = {}
        this.resetted = true
        this.pagination = {
          current: 1,
          pageSize: 10
        }
        this.init()
      },
      getPara(parameter) {
        let para = {...parameter}
        para.district = this.queryParam.district ? (this.queryParam.district == "全上海市" ? "" : this.queryParam.district) : '';
        para.reported = this.queryParam.reported || 1;
        para.date = (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"));
        para.keyword = this.queryParam.keyword || ''
        return para
      },
      download() {
        let para = {
          district: this.queryParam.district || '',
          reported: this.queryParam.reported || 1,
          date: (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")),
          keyword: this.queryParam.keyword || ''
        }
        let obj = this
        getTableList(para).then(function(datas) {
          let downloadList = []
          datas = datas["data"]
          for (let item in datas) {
            downloadList.push({
              id: datas[item]['phar_id'],
              district: datas[item]['district'],
              pharmacyName: datas[item]['phar_name'],
              address: datas[item]['phar_addr'],
              con: datas[item]['phar_con_per'],
              tel: datas[item]['phar_con_tel'],
              distribution: datas[item]['phar_quota'],
              distributed: datas[item]['phar_data_purchased'],
              remain: datas[item]['remain'],
              sold: datas[item]['phar_data_issued'],
              loss: datas[item]['loss'],
              inventory: datas[item]['phar_data_balance'],
              modificationTime: datas[item]["phar_data_phar_date"]
            })
          }
          let districtString = para.district == '' ? (obj.authority ? '全上海市' : user.state.name) : para.district
          let reportedString = para.reported == 1 ? '已填报' : '未填报'

          let tips = districtString + '_' + reportedString + (para.keyword == '' ? '' : ('_' + para.keyword)) + '_' + para.date
          table2excel(downloadList, tips)
        })
      }

    }
  }
</script>
