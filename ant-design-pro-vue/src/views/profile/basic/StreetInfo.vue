<template>
  <page-view logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="2" class="detail-layout">
      <detail-list-item term="街道名">{{ name }}</detail-list-item>
      <detail-list-item term="街道 ID">{{ id }}</detail-list-item>
      <detail-list-item term="今日总预约登记户数">{{ todayTotal }}</detail-list-item>
      <detail-list-item term="累计总预约登记户数">{{ total }}</detail-list-item>
    </detail-list>

    <a-card
      class="project-list"
      style="margin-bottom: 24px; margin-top: 24px"
      title="居委填报信息">
      <a slot="extra" @click="download">下载表格</a>
      <a-table
        size="small"
        :scroll="{x: 960, y: 3600}"
        :columns="dataColumns"
        :dataSource="data"
        :pagination="pagination_data"
        :loading="loading"
        :bordered="bordered">
      </a-table>

    </a-card>

  </page-view>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'
import { getStreetDetail } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
import moment from 'moment'
import json2excel from '@/utils/json2excel'
const DetailListItem = DetailList.Item

function table2excel (jsonData, substr) {
  // 要导出的json数据
  const head = ['街道编号', '街道名', '居委会编号', '居委会名称', '联系人', '联系电话', '今日预约登记户数', '累计预约登记户数', '填报时间' ]
  const keys = ['street_id', 'street_name', 'id', 'comName', 'conPer', 'tel', 'today', 'total', 'date']
  const title = '街道预约登记表(' + substr + ')'
  json2excel(jsonData, head, keys, title)
}
export default {
  name: 'StreetInfo',
  components: {
    PageView,
    DetailList,
    DetailListItem
  },
  mixins: [mixinDevice],
  data () {
    return {
      comData: [],
      data: [],
      loading: false,
      comColumns: [
        { title: '居委会名称', dataIndex: 'name', key: '1', width: 240, className: 'table-header' },
        { title: '联系人', dataIndex: 'com_per', key: '2', width: 200, className: 'table-header' },
        { title: '联系电话', dataIndex: 'tel', key: '3', width: 200, className: 'table-header' },
        { title: '配额', dataIndex: 'quota', key: '4', width: 200, className: 'table-header' },
        { title: '分配比例', dataIndex: 'quotaRate', key: '5', width: 200, className: 'table-header' }],
      dataColumns: [
        { title: '居委会 ID', dataIndex: 'id', key: '1', width: 80, className: 'table-header' },
        { title: '居委会名称', dataIndex: 'comName', key: '2', width: 160, className: 'table-header' },
        { title: '联系人', dataIndex: 'conPer', key: '3', width: 120, className: 'table-header' },
        { title: '联系电话', dataIndex: 'tel', key: '4', width: 120, className: 'table-header' },
        { title: '今日预约登记户数', dataIndex: 'today', key: '5', width: 120, className: 'table-header' },
        { title: '累计预约登记户数', dataIndex: 'total', key: '6', width: 120, className: 'table-header' },
        { title: '填报时间', dataIndex: 'date', key: '7', width: 120, className: 'table-header' }],
      name: '',
      id: '',
      todayTotal: 0,
      total: 0,
      pagination_data: { pageSize: 45, hideOnSinglePage: true },
      pagination_com: { pageSize: 40, hideOnSinglePage: true },
      bordered: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    download () {
      table2excel(this.data, this.name)
    },
    init () {
      const obj = this
      this.data = []
      getStreetDetail({ street_id: obj.$route.query.id }).then(function (data) {
        obj.name = data['street_name']
        obj.id = data['street_id']
        data = data['committees']
        for (const i in data) {
          obj.data.push({
            street_id: obj.id,
            street_name: obj.name,
            comName: data[i]['com_name'],
            id: data[i]['com_id'],
            conPer: data[i]['com_con_per'],
            tel: data[i]['com_con_tel'],
            date: data[i]['m_time'],
            today: data[i]['today_r'],
            total: data[i]['total']
          })
          obj.todayTotal = data[i]['today_r'] == '未填报' ? '未填报' : obj.todayTotal + parseInt(data[i]['today_r'])
          obj.total += parseInt(data[i]['total'])
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .detail-layout {
    margin-left: 44px;

    [class = term] {
      font-weight: bold;
    }
  }
</style>

<style type="text/css">
  [class = term] {
    font-weight: bold;
  }
</style>
