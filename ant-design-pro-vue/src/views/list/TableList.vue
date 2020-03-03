<template>
  <page-view title="" logo="">
    <a-card :bordered="true">
      <a-table
        size="small"
        class="test-table"
        :scroll="{x: 930, y: 3600}"
        :columns="districtColumns"
        :dataSource="dataTotal"
        :loading="districtLoading"
        :pagination="districtPagination"
        :bordered="bordered">
      </a-table>
    </a-card>

    <a-card :bordered="false" style="margin-top: 12px">
      <span slot="extra"><strong>是否展示预约信息 </strong>
        <a-switch slot="extra" @change="changeSwitch">
          <a-icon type="check" slot="checkedChildren"/>
          <a-icon type="close" slot="unCheckedChildren"/>
        </a-switch>
      </span>

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
                  <a-select-option v-for="item in districtList" :value="item">{{ item }}</a-select-option>
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
              <span
                class="table-page-search-submitButtons"
                :style="authority ? { float: 'left', overflow: 'hidden' } : { float: 'right', overflow: 'hidden' }">
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>

            <a-col :md="authority ? 8 : 4" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">{{ downloadText }}</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>

      <strong>若昨日结余 + 进货量 < 每日配额，则可销售量状态<span style="color: #f5222d;">不足</span>；反之，可销售量状态<span style="color: #52c41a;">充足</span>。</strong>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered"
        @change="handleTableChange"
        :scroll="{ x: 1470}"
      >
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <div>
              <a :href="record.url" target="_blank">{{ record.pharmacyName }}</a>
            </div>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
import moment from 'moment'
import { getTableList, getAnalysisList } from '@/api/manage'
import { PageView } from '@/layouts'

import { USERNAME } from '@/store/mutation-types'
import Vue from 'vue'
import json2excel from '@/utils/json2excel'

const statusMap = {
  0: {
    status: 'error',
    text: '不足'
  },
  1: {
    status: 'success',
    text: '充足'
  },
  2: {
    status: 'default',
    text: '未上报'
  }
}

function table2excel (jsonData, tips, swt) {
  // 要导出的json数据
  let head = ['ID', '市辖区', '药店名', '药店地址', '联系人', '联系电话', '配额', '进货量', '昨日结余', '已售数量', '损耗量', '剩余库存量', '可销售量状态（进货量+昨日结余<配额表示不足，反之足额）', '修改时间']
  let keys = ['phar_id', 'district', 'phar_name', 'phar_addr', 'phar_con_per', 'phar_con_tel', 'phar_quota', 'phar_data_purchased', 'remain',
    'phar_data_issued', 'loss', 'phar_data_balance', 'status', 'phar_data_phar_date']
  if (swt) {
    head = ['ID', '市辖区', '药店名', '药店地址', '联系人', '联系电话', '配额', '进货量', '昨日结余', '已售数量', '损耗量', '剩余库存量', '待满足户数', '销售预约比', '可销售量状态（进货量+昨日结余<配额表示不足，反之足额）', '修改时间']
    keys = ['phar_id', 'district', 'phar_name', 'phar_addr', 'phar_con_per', 'phar_con_tel', 'phar_quota', 'phar_data_purchased', 'remain',
      'phar_data_issued', 'loss', 'phar_data_balance', 'need', 'sale_reserve', 'status', 'phar_data_phar_date']
  }
  jsonData.forEach(item => {
    item['status'] = '充足'
    if ('total_issued' in item) {
      item['need'] = parseInt(item['total_reserve']) - Math.floor(item['total_issued'] / 5)
      item['sale_reserve'] = (Math.floor(item['total_issued'] / 5) / item['total_reserve'] * 100).toFixed(2) + '%'
      item['need'] = item['need'] < 0 ? '0' : item['need']
      item['sale_reserve'] = item['need'] < 0 ? '100.00%' : item['sale_reserve']
    }
    if (item['phar_data_purchased'] === '未上报') {
      item['status'] = '未上报'
      item['need'] = '未上报'
      item['sale_reserve'] = '未上报'
    } else {
      if (parseInt(item['remain']) + parseInt(item['phar_data_purchased']) < parseInt(item['phar_quota'])) {
        item['status'] = '不足'
      }
    }
  })
  // 对下载的文件命名
  const title = '药店填报信息表(' + tips + ')'
  json2excel(jsonData, head, keys, title)
}

export default {
  name: 'TableList',
  components: {
    PageView
  },
  mounted () {
    this.refreshed = false
  },
  data () {
    return {
      districtList: [],
      refreshed: false,
      pageTitle: '药店列表',
      logo: '',
      queryParam: {},
      districtPagination: { pageSize: 20, hideOnSinglePage: true },
      pagination: {},
      bordered: true,
      resetted: false,
      districtLoading: false,
      loading: false,
      pageSize: 10,
      queryDate: '',
      data: [],
      columns: [],
      downloadText: '下载表格',
      // 表头
      columns1: [
        { key: 1, title: '市辖区', dataIndex: 'district', width: '100px', className: 'table-header' },
        { key: 2, title: '药店名', dataIndex: 'pharmacyName', width: '290px', className: 'table-header', scopedSlots: { customRender: 'action' } },
        { key: 3, title: '配额', dataIndex: 'distribution', width: '80px', className: 'table-header' },
        { key: 4, title: '进货量', dataIndex: 'distributed', width: '80px', className: 'table-header' },
        { key: 5, title: '昨日结余', dataIndex: 'remain', width: '80px', className: 'table-header' },
        { key: 6, title: '已售数量', dataIndex: 'sold', width: '70px', className: 'table-header' },
        { key: 7, title: '损耗量', dataIndex: 'loss', width: '70px', className: 'table-header' },
        { key: 8, title: '当前库存', dataIndex: 'inventory', width: '70px', className: 'table-header' },
        {
          key: 9,
          title: '可销售量状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: '90px',
          className: 'table-header'
        },
        { key: 10, title: '修改时间', dataIndex: 'modificationTime', width: '110px', className: 'table-header' }
      ],
      columns2: [
        { key: 1, title: '市辖区', dataIndex: 'district', width: '100px', className: 'table-header' },
        { key: 2, title: '药店名', dataIndex: 'pharmacyName', width: '290px', className: 'table-header', scopedSlots: { customRender: 'action' } },
        { key: 3, title: '配额', dataIndex: 'distribution', width: '80px', className: 'table-header' },
        { key: 4, title: '进货量', dataIndex: 'distributed', width: '80px', className: 'table-header' },
        { key: 5, title: '昨日结余', dataIndex: 'remain', width: '80px', className: 'table-header' },
        { key: 6, title: '已售数量', dataIndex: 'sold', width: '70px', className: 'table-header' },
        { key: 7, title: '损耗量', dataIndex: 'loss', width: '70px', className: 'table-header' },
        { key: 8, title: '当前库存', dataIndex: 'inventory', width: '70px', className: 'table-header' },
        { key: 9, title: '待满足户数', dataIndex: 'need', width: '70px', className: 'table-header' },
        { key: 10, title: '销售预约比', dataIndex: 'sale_reserve', width: '70px', className: 'table-header' },
        {
          key: 11,
          title: '可销售量状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: '90px',
          className: 'table-header'
        },
        { key: 12, title: '修改时间', dataIndex: 'modificationTime', width: '110px', className: 'table-header' }
      ],
      districtColumns: [
        { dataIndex: 'district', key: '1', title: '市辖区', className: 'table-header', width: '90px', align: 'center' },
        { dataIndex: 'store_num', key: '2', title: '指定药店数量', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'post_num', key: '3', title: '上报药店数量', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'quota', key: '4', title: '上报药店配额', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'purchased', key: '5', title: '上报药店进货量', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'yesterday', key: '6', title: '上报药店昨日结余', className: 'table-header', width: '110px', align: 'center' },
        { dataIndex: 'loss', key: '7', title: '上报药店损耗量', className: 'table-header', width: '90px', align: 'center' },
        { dataIndex: 'sell', key: '8', title: '上报药店售出量', className: 'table-header', width: '130px', align: 'center' },
        { dataIndex: 'remain', key: '9', title: '上报药店当前库存', className: 'table-header', width: '110px', align: 'center' }
      ],
      dataTotal: [],
      authority: false,
      switch: false,
      current: 1
    }
  },
  created () {
    this.authority = Vue.ls.get(USERNAME).indexOf('shanghai') !== -1
    this.init()
    this.districtList = ['全上海市', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    pushList (datas) {
      this.data = []
      for (const item in datas) {
        let status = 1
        let sale_reserve = ''
        let need = ''
        if ('total_issued' in datas[item]) {
          need = parseInt(datas[item]['total_reserve']) - Math.floor(datas[item]['total_issued'] / 5)
          sale_reserve = (Math.floor(datas[item]['total_issued'] / 5) / datas[item]['total_reserve'] * 100).toFixed(2) + '%'
          if (need < 0) {
            need = 0
            sale_reserve = '100.00%'
          }
        }
        if (datas[item]['phar_data_purchased'] === '未上报') {
          status = 2
          need = '未上报'
          sale_reserve = '未上报'
        } else {
          if (parseInt(datas[item]['remain']) + parseInt(datas[item]['phar_data_purchased']) < parseInt(datas[item]['phar_quota'])) {
            status = 0
          }
        }

        this.data.push({
          district: datas[item]['district'],
          pharmacyName: datas[item]['phar_name'],
          distribution: datas[item]['phar_quota'],
          distributed: datas[item]['phar_data_purchased'],
          remain: datas[item]['remain'],
          sold: datas[item]['phar_data_issued'],
          loss: datas[item]['loss'],
          inventory: datas[item]['phar_data_balance'],
          modificationTime: datas[item]['phar_data_phar_date'],
          status: status,
          sale_reserve: sale_reserve,
          need: need,
          url: '/profile/basic?id=' + datas[item]['phar_id']

        })
        if (!this.refreshed) { this.refreshed = true }
      }
    },
    init () {
      if (!this.resetted) { this.refreshed = false }
      this.columns = this.columns1
      const obj = this
      const para = this.getPara({ pageNo: 1, pageSize: this.pageSize })
      const pagination = { ...this.pagination }
      this.queryDate = para['date']
      this.loading = true
      getTableList(para).then(function (data) {
        obj.pagination = pagination
        pagination.total = data['total']
        obj.pushList(data['data'])
        obj.loading = false
      })
      obj.districtLoading = true
      getAnalysisList({ 'date': para['date'], district: '区' }).then(function (data) {
        obj.dataTotal = []
        obj.districtLoading = false
        const username = Vue.ls.get(USERNAME)
        const district = username.indexOf('shanghai') !== -1? '上海市' : username.replace('m','').replace('s','')
        if ('data' in data) {
          data['data'].forEach(item => {
            if (item['district'] === district) {
              const report = parseInt(item['post_num'])
              const store = parseInt(item['store_num'])
              const proportion = store ? ((report / store * 100).toFixed(1) + '%') : '0.0%'
              item['post_num'] = item['post_num'] + ' (' + proportion + ')'
              obj.dataTotal.push(item)
            }
          })
        }
      })
    },
    handleSearch () {
      const obj = this
      const para = this.getPara({ pageNo: 1, pageSize: this.pageSize })
      this.loading = true
      const pagination = { ...this.pagination }

      getTableList(para).then(function (data) {
        obj.pagination = pagination
        pagination.total = data['total']
        pagination.current = 1
        obj.pushList(data['data'])
        obj.loading = false
      })
      if (this.queryDate === para['date']) {
        return
      }
      this.queryDate = para['date']
      obj.districtLoading = true
      getAnalysisList({ 'date': para['date'], district: '区' }).then(function (data) {
        obj.districtLoading = false
        obj.dataTotal = []
        const username = Vue.ls.get(USERNAME)
        const district = username.indexOf('shanghai') !== -1 ? '上海市' : username.replace('m','').replace('s','')
        if ('data' in data) {
          data['data'].forEach(item => {
            if (item['district'] === district) {
              const report = parseInt(item['post_num'])
              const store = parseInt(item['store_num'])
              const proportion = store ? ((report / store * 100).toFixed(1) + '%') : '0.0%'
              item['post_num'] = item['post_num'] + ' (' + proportion + ')'
              obj.dataTotal.push(item)
            }
          })
        }
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const obj = this
      const para = this.getPara({ pageNo: pagination.current, pageSize: pagination.pageSize })
      const raw_pagination = { ...this.pagination }
      raw_pagination.current = pagination.current
      this.pagination = raw_pagination
      this.loading = true
      getTableList(para).then(function (data) {
        obj.pagination = pagination
        pagination.total = data['total']
        obj.pushList(data['data'])
        obj.loading = false
      })
    },
    reset () {
      this.queryParam = {}
      this.resetted = true
      this.pagination = {
        current: 1,
        pageSize: 10
      }
      this.init()
    },
    getPara (parameter) {
      const para = { ...parameter }
      if (this.switch) {
        para.reserve_flag = 1
      }
      if ('pageNo' in parameter) {
        this.current = parameter.pageNo
      }
      para.district = this.queryParam.district ? (this.queryParam.district === '全上海市' ? '' : this.queryParam.district) : ''
      para.reported = this.queryParam.reported || 1
      para.date = (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
      para.keyword = this.queryParam.keyword || ''
      return para
    },
    download () {
      if (this.downloadText.indexOf('下载中') !== -1) {
        return
      }
      const para = {
        district: this.queryParam.district || '',
        reported: this.queryParam.reported || 1,
        date: (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')),
        keyword: this.queryParam.keyword || ''
      }
      this.downloadText = '下载中'
      if (this.switch) {
        this.$notification.warning({
          message: '提示',
          description: '下载部分含有预约信息，耗时可能较长。5分钟以内完成',
          duration: 4
        })
        para.reserve_flag = 1
      }
      const obj = this
      const h = setInterval(function () {
        switch (obj.downloadText) {
          case '下载中':
            obj.downloadText = '下载中.'; break
          case '下载中.':
            obj.downloadText = '下载中..'; break
          case '下载中..':
            obj.downloadText = '下载中...'; break
          case '下载中...':
            obj.downloadText = '下载中....'; break
          case '下载中....':
            obj.downloadText = '下载中.....'; break
          case '下载中.....':
            obj.downloadText = '下载中.'; break
        }
      }, 500)

      getTableList(para).then(function (datas) {
        datas = datas['data']
        const username = Vue.ls.get(USERNAME)
        const districtString = para.district === '' ? (obj.authority ? '全上海市' : username.replace('m','').replace('s','')) : para.district
        const reportedString = parseInt(para.reported) === 1 ? '已填报' : '未填报'
        const tips = districtString + '_' + reportedString + (para.keyword === '' ? '' : ('_' + para.keyword)) + '_' + para.date
        table2excel(datas, tips, obj.switch)
      }).finally(function () {
        clearInterval(h)
        obj.downloadText = '下载表格'
      })
    },
    changeSwitch (checked) {
      this.switch = checked
      if (checked) {
        this.loadReserveInfo()
      } else {
        this.loadNoReserveInfo()
      }
    },
    loadReserveInfo () {
      const para = this.getPara({ pageNo: this.current, pageSize: this.pageSize })
      this.loading = true
      const pagination = { ...this.pagination }
      const obj = this
      this.columns = this.columns2
      getTableList(para).then(function (data) {
        obj.pagination = pagination
        pagination.total = data['total']
        obj.pushList(data['data'])
        obj.loading = false
      })
    },
    loadNoReserveInfo () {
      const para = this.getPara({ pageNo: this.current, pageSize: this.pageSize })
      this.loading = true
      const pagination = { ...this.pagination }
      const obj = this
      this.columns = this.columns1
      getTableList(para).then(function (data) {
        obj.pagination = pagination
        pagination.total = data['total']
        obj.pushList(data['data'])
        obj.loading = false
      })
    }
  }

}
</script>
