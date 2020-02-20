<template>
  <page-view title="街道填报信息表" logo="">
    <a-card :bordered="true">
      <a-table
        size="small"
        class="test-table"
        :scroll="{x: 930, y: 3600}"
        :columns="districtColumns"
        :dataSource="dataTotal"
        :pagination="districtPagination"
        :loading="districtLoading"
        rowKey="key"
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
                  :style="authority ? { float: 'right', overflow: 'hidden' } : { float: 'left', overflow: 'hidden' }">
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
        rowKey="key"
        :loading="loading"
        :bordered="bordered"
        @change="handleTableChange">
        <span slot="action" slot-scope="text,record">
          <template>
              <div>
                <a :href="record.url" target="_blank">{{record.street_name}}</a>
              </div>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>

</template>

<script>
  import {PageView} from '@/layouts'
  import {getStreetList} from '@/api/manage'
  import moment from 'moment'
  import { getStreetDistrictList } from '../../api/manage'
  import Vue from 'vue'
  import { USERNAME } from '@/store/mutation-types'
  import json2excel from '@/utils/json2excel';

  function table2excel(jsonData, tips) {
    //要导出的json数据
    let head = ['市辖区','街道编号','街道名','居委会数量','今日预约登记户数','修改时间'];
    let keys = ['district','id','name','com_num','appointed','m_time']
    const title = "街道填报信息表(" + tips+ ")";
    json2excel(jsonData,head,keys,title);
  }


  export default {
    name: "StreetList",
    components: {
      PageView
    },
    data() {
      return {
        columns: [
          {key: 1, title: '市辖区', dataIndex: 'district', width: '100px', className: 'table-header'},
          {key: 2, title: '街道编号', dataIndex: 'street_id', width: '80px', className: 'table-header'},
          {
            key: 3,
            title: '街道名',
            dataIndex: 'street_name',
            width: '200px',
            className: 'table-header',
            scopedSlots: {customRender: 'action'}
          },
          {key: 4, title: '居委会数量', dataIndex: 'com_num', width: '100px', className: 'table-header'},
          {key: 5, title: '今日预约登记户数', dataIndex: 'day_total', width: '100px', className: 'table-header'},
          {key: 6, title: '修改时间', dataIndex: 'm_time', width: '120px', className: 'table-header'},
          ],
        queryDate:'',
        districtPagination:{pageSize: 20, hideOnSinglePage: true},
        districtColumns:[
          {dataIndex: 'district', key: 1, title: '市辖区', className: 'table-header', width: '60px', align: 'center'},
          {dataIndex: 'street_num', key: 2, title: '指定街道数量', className: 'table-header', width: '60px', align: 'center'},
          {dataIndex: 'report_num', key: 3, title: '上报街道数量', className: 'table-header', width: '60px', align: 'center'},
          {dataIndex: 'report_proportion', key: 4, title: '上报比例', className: 'table-header', width: '60px', align: 'center'},
          {dataIndex: 'today_r', key: 5, title: '上报街道今日预约登记户数', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'total_r', key: 6, title: '上报街道累计预约登记户数', className: 'table-header', width: '130px', align: 'center'},
          {dataIndex: 'date', key: 7, title: '统计日期', className: 'table-header', width: '110px', align: 'center'}
        ],
        data: [],
        dataTotal:[],
        districtLoading:false,
        pagination: {pageNo: 1, pageSize: 10},
        loading: false,
        bordered: true,
        authority: 0,
        queryParam: {},
        districtList: ["全上海市", "黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"]
      }
    },
    created() {
      this.authority = (Vue.ls.get(USERNAME) === "shanghai")
      this.init()
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.pagination = {
          current: 1,
          pageSize: 10
        }
        this.init()
      },
      download() {
        let para = {
          district: this.queryParam.district ? (this.queryParam.district === "全上海市" ? "" : this.queryParam.district) : '',
          reported: this.queryParam.reported || 1,
          date: (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")),
          keyword: this.queryParam.keyword || ''
        }
        let obj = this
        getStreetList(para).then(function(data) {
          data = data["data"]
          let downloadList = []
          let m_time = '未提交';
          let m_day_total = '未提交';
          for (let i in data) {
            if(parseInt(para.reported)){
              m_time = data[i]["m_time"]
              m_day_total = data[i]["day_total"]
            }
            downloadList.push({
              district: data[i]["district"],
              id: data[i]["street_id"],
              name: data[i]["street_name"],
              com_num: data[i]["com_num"],
              appointed: m_day_total,
              m_time: m_time
            })
          }
          const username = Vue.ls.get(USERNAME);
          let districtString = para.district === '' ? (obj.authority ? '全上海市' : username) : para.district
          let reportedString = para.reported === 1 ? '已填报' : '未填报'
          let tips = districtString + '_' + reportedString + (para.keyword === '' ? '' : ('_' + para.keyword))
          table2excel(downloadList, tips)
        });
      },
      handleSearch() {
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: 10})
        this.loading = true
        const pagination = {...this.pagination};

        getStreetList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          pagination.current = 1;
          obj.pushList(data["data"],para.reported)
          obj.loading = false
        })
        if(para['date'] === this.queryDate){
          return;
        }
        this.queryDate = para['date'];
        this.districtLoading = true;
        getStreetDistrictList({date: para['date']}).then(function (data) {
          obj.dataTotal = []
          obj.districtLoading = false;
          // 上海市需要自己求和
          const username = Vue.ls.get(USERNAME);
          if(username === "shanghai" && 'data' in data){
            obj.dataTotal.push(obj.calTotal(data['data'],para['date']));
          } else if('data' in data){
            data['data'].forEach(item=>{
              if(item['district'] === username){
                item['report_proportion'] = (item["report_num"] / item["street_num"] * 100).toFixed(1) + "%";
                item['date'] = para['date'];
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
        getStreetList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"],para.reported)
          obj.loading = false
        });


      },
      calTotal(data,date){
        let total = {}
        let calKeys = ['street_num','report_num','today_r','total_r'];
        data.forEach(item=>{
          calKeys.forEach(key=>{
            total[key] = key in total? parseInt(total[key] + item[key]):parseInt(item[key]);
          })
        })
        if('street_num' in total){
          total['date'] = date;
          total['key'] = 'total';
          total['district'] = '全上海市';
          total['report_proportion'] = (total["report_num"] / total["street_num"] * 100).toFixed(1) + "%";
        }
        return total;
      },
      pushList(data,reported) {
        this.data = []
        for (let i in data) {
          if(!parseInt(reported)){
            data[i]["m_time"] = '未提交';
            data[i]["day_total"] = '未提交';
          }
          this.data.push({
           ...data[i],
            url: '/profile/streetInfo?id=' + data[i]["street_id"]
          })
        }
      },
      init() {
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: 10})
        const pagination = {...this.pagination};

        this.loading = true
        getStreetList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"],para.reported)
          obj.loading = false
        });
        this.districtLoading = true;
        this.queryDate = moment().format("YYYY-MM-DD")
        getStreetDistrictList({date: para['date']}).then(function (data) {
          obj.dataTotal = []
          obj.districtLoading = false;
          const username = Vue.ls.get(USERNAME);
          // 上海市需要自己求和
          if(username === "shanghai" && 'data' in data){
            obj.dataTotal.push(obj.calTotal(data['data'],para['date']));
          } else if('data' in data){
            data['data'].forEach(item=>{
              if(item['district'] === username){
                item['date'] = para['date'];
                item['report_proportion'] = (item["report_num"] / item["street_num"] * 100).toFixed(1) + "%";
                obj.dataTotal.push(item);
              }
            })
          }
        });
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getPara(parameter) {
        let para = {...parameter}
        para.district = this.queryParam.district ? (this.queryParam.district === "全上海市" ? "" : this.queryParam.district) : '';
        para.date = (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"));
        para.reported = this.queryParam.reported || 1;
        para.keyword = this.queryParam.keyword || ''
        return para
      }
    }
  }
</script>

<style scoped>

</style>