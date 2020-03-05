<template>
  <page-view title="" logo="">
    <!--    <a-card title="上海市累计预约销售情况" :bordered="true">-->
    <!--      <line-chart/>-->
    <!--    </a-card>-->
    <a-card title="预约销售统计表" :bordered="true" style="margin-top: 15px">
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
import { PageView } from '@/layouts'
// import {LineChart} from '@/components'
import moment from 'moment'
import { getSellReserveList } from '@/api/manage'
import { USER_DISTRICT } from '@/store/mutation-types'
import Vue from 'vue'
import json2excel from '@/utils/json2excel'

function table2excel (jsonData, date, district) {
  // 要导出的json数据
  const head = ['区', '当日预约户数', '累计预约户数', '累计预约户数占比', '当日销售个数', '累计销售个数', '实际购买到口罩户数', '销售数/预约数']
  const keys = ['district', 'day_reserve', 'total_reserve', 'reserve_proportion', 'day_sell', 'total_sell', 'total_buy', 'sell_reserve']
  let title = district + '口罩预约销售统计表(' + date + ')'
  const data = []
  if (district !== '上海市') {
    jsonData.forEach(item => {
      if (item['district'] === district) {
        item['district'] = String(item['district']).substr(0, 2)
        data.push(item)
      }
    })
    jsonData = data
  } else {
    title = '全市口罩预约销售统计表(' + date + ')'
    jsonData.forEach(item => {
      item['district'] = String(item['district']).substr(0, 2)
    })
  }
  json2excel(jsonData, head, keys, title)
}

export default {
  name: 'AppointmentList',
  components: {
    PageView
  },
  data () {
    return {
      columns: [
        { dataIndex: 'district', key: '1', title: '市辖区', className: 'table-header', width: '90px', align: 'center' },
        { dataIndex: 'day_reserve', key: '2', title: '当日预约户数', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'total_reserve', key: '3', title: '累计预约户数', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'reserve_proportion', key: '4', title: '累计预约户数占比', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'day_sell', key: '5', title: '当日销售个数', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'total_sell', key: '6', title: '累计销售个数', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'total_buy', key: '7', title: '实际购买到口罩户数', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'sell_reserve', key: '8', title: '销售数/预约数', className: 'table-header', width: '130px', align: 'center' }
      ],
      data: [],
      loading: false,
      bordered: true,
      pagination: { pageSize: 20, hideOnSinglePage: true },
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
      let sum_total_reserve = 0
      data.forEach(item => {
        sum_total_reserve += parseInt(item['total_reserve'])
      })
      this.data = []
      let today_reserve
      let total_reserve
      let total_buy
      const total = { 'district': '合计', 'day_reserve': 0, 'total_reserve': 0, 'day_sell': 0, 'total_sell': 0, 'total_buy': 0 }
      const sumKeys = ['day_reserve', 'total_reserve', 'day_sell', 'total_sell', 'total_buy']
      const district = Vue.ls.get(USER_DISTRICT)
      if (district !== '上海市') {
        data.forEach(item => {
          if (item['district'] === district) {
            today_reserve = parseInt(item['day_reserve'])
            total_reserve = parseInt(item['total_reserve'])
            total_buy = parseInt(item['total_buy'])
            item['reserve_proportion'] = sum_total_reserve > 0 ? ((100 * total_reserve / sum_total_reserve).toFixed(2) + '%') : '0.00%'
            item['sell_reserve'] = total_reserve > 0 ? ((100 * total_buy / total_reserve).toFixed(2) + '%') : '0.00%'
            this.data.push(item)
          }
        })
        return
      }
      data.forEach(item => {
        today_reserve = parseInt(item['day_reserve'])
        total_reserve = parseInt(item['total_reserve'])
        total_buy = parseInt(item['total_buy'])
        item['reserve_proportion'] = sum_total_reserve > 0 ? ((100 * total_reserve / sum_total_reserve).toFixed(2) + '%') : '0.00%'
        item['sell_reserve'] = total_reserve > 0 ? ((100 * total_buy / total_reserve).toFixed(2) + '%') : '0.00%'
        sumKeys.forEach(key => {
          total[key] += item[key]
        })
        this.data.push(item)
      })
      today_reserve = parseInt(total['day_reserve'])
      total_reserve = parseInt(total['total_reserve'])
      total_buy = parseInt(total['total_buy'])
      total['reserve_proportion'] = sum_total_reserve > 0 ? ((100 * total_reserve / sum_total_reserve).toFixed(2) + '%') : '0.00%'
      total['sell_reserve'] = total_reserve > 0 ? ((100 * total_buy / total_reserve).toFixed(2) + '%') : '0.00%'
      this.data.push(total)
    },
    init () {
      const obj = this
      this.loading = true
      // 不传参数是今日的
      getSellReserveList({}).then(function (data) {
        data = data['data']
        obj.pushList(data)
        obj.loading = false
      })
    },
    download () {
      table2excel(this.data, this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        Vue.ls.get(USER_DISTRICT))
    },
    handleSearch () {
      const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      const para = { date: date }
      const obj = this
      this.loading = true
      getSellReserveList(para).then(function (data) {
        data = data['data']
        obj.pushList(data)
        obj.loading = false
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
