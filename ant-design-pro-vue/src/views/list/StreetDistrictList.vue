<template>
  <page-view title="" logo="">
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
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'left', overflow: 'hidden' }">
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>

            <a-col :md="8" :sm="24">
              <span
                class="table-page-search-submitButtons"
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
import { getStreetDistrictList } from '@/api/manage'
import { PageView } from '@/layouts'
import moment from 'moment'
import { USERNAME } from '@/store/mutation-types'
import Vue from 'vue'
import json2excel from '@/utils/json2excel'

function table2excel (jsonData, date) {
  // 要导出的json数据
  const head = ['市辖区', '指定街道数量', '上报街道数量', '上报比例', '上报街道今日预约量', '上报街道累计预约量', '统计日期']
  const keys = ['district', 'street_num', 'report_num', 'report_proportion', 'today_r', 'total_r', 'date']
  const title = '上海市口罩预约区域统计表(' + date + ')'
  json2excel(jsonData, head, keys, title)
}

export default {
  name: 'StreetDistrictList',
  components: {
    PageView
  },
  data () {
    return {
      columns: [
        { dataIndex: 'district', key: '1', title: '市辖区', className: 'table-header', width: '60px', align: 'center' },
        { dataIndex: 'street_num', key: '2', title: '指定街道数量', className: 'table-header', width: '60px', align: 'center' },
        { dataIndex: 'report_num', key: '3', title: '上报街道数量', className: 'table-header', width: '60px', align: 'center' },
        { dataIndex: 'report_proportion', key: '4', title: '上报比例', className: 'table-header', width: '60px', align: 'center' },
        { dataIndex: 'today_r', key: '5', title: '上报街道今日预约登记户数', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'total_r', key: '6', title: '上报街道累计预约登记户数', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'date', key: '7', title: '统计日期', className: 'table-header', width: '110px', align: 'center' }
      ],
      data: [],
      loading: false,
      bordered: true,
      pagination: { pageSize: 20, hideOnSinglePage: true },
      quotaTotal: 0,
      count: 0,
      queryParam: {},
      defaultTime: moment().format('YYYY-MM-DD'),
      dataTotal: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    pushList (data) {
      this.data = []
      const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      data.forEach(item => {
        const proportion = (item['report_num'] / item['street_num'] * 100).toFixed(1) + '%'
        this.data.push({ ...item, date: date, 'report_proportion': proportion })
      })
    },
    calTotal (data) {
      const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      this.dataTotal = []
      const total = {}
      const calKeys = ['street_num', 'report_num', 'today_r', 'total_r']
      data.forEach(item => {
        calKeys.forEach(key => {
          total[key] = key in total ? parseInt(total[key] + item[key]) : parseInt(item[key])
        })
      })
      if ('street_num' in total) {
        total['date'] = date
        total['district'] = '全上海市'
        total['report_proportion'] = (total['report_num'] / total['street_num'] * 100).toFixed(1) + '%'
        this.dataTotal = [total]
      }
    },
    init () {
      const obj = this
      this.loading = true
      getStreetDistrictList({ date: obj.defaultTime }).then(function (data) {
        obj.loading = false
        data = data['data']
        obj.pushList(data)
        obj.calTotal(data)
      })
    },
    download () {
      table2excel(this.data, this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    },
    handleSearch () {
      const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      const para = { date: date }
      const obj = this
      this.loading = true
      getStreetDistrictList(para).then(function (data) {
        obj.loading = false
        data = data['data']
        obj.pushList(data)
        obj.calTotal(data)
      })
    },
    reset () {
      this.queryParam = {}
      this.init()
    }
  }
}
</script>

<style scoped>

</style>
