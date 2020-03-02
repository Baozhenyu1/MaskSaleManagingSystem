<template>
  <page-view title="" logo="">
    <a-card :bordered="false">
      <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
      <a-table
        size="small"
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: 430, y: 3600 }"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered">
      </a-table>
    </a-card>
  </page-view>
</template>

<script>
import { getDeliveryList } from '@/api/manage'
import { PageView } from '@/layouts'
import json2excel from '@/utils/json2excel'

function table2excel (jsonData) {
  // 要导出的json数据
  const head = ['配送企业', '配额', '门店数量']
  const keys = ['enterprise', 'quota', 'count']
  const title = '配送企业提货表'
  json2excel(jsonData, head, keys, title)
}

function sortQuota (a, b) {
  return b.quota - a.quota
}

export default {
  name: 'ReportList',
  components: {
    PageView
  },
  data () {
    return {
      columns: [
        { key: 1, title: '配送企业', dataIndex: 'enterprise', className: 'table-header', width: '100px' },
        { key: 2, title: '配额', dataIndex: 'quota', className: 'table-header', width: '80px' },
        { key: 3, title: '门店数量', dataIndex: 'count', className: 'table-header', width: '80px' }
      ],
      data: [],
      loading: false,
      bordered: true,
      pagination: { pageSize: 60, hideOnSinglePage: true },
      quotaTotal: 0,
      count: 0,
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      const obj = this
      this.loading = true
      getDeliveryList().then(function (data) {
          obj.quotaTotal = data['total_quota']
          obj.count = data['store_count']
          data = data['data']
          const key = Object.keys(data)
          for (const k in key) {
            obj.data.push({
              enterprise: key[k],
              quota: data[key[k]].quota,
              count: data[key[k]].count
            })
          }
          obj.data.sort(sortQuota)
          obj.data.push({
            enterprise: '总计',
            quota: obj.quotaTotal,
            count: obj.count
          })
          obj.loading = false
      })
    },
    download () {
      table2excel(this.data)
    }
  }
}
</script>
