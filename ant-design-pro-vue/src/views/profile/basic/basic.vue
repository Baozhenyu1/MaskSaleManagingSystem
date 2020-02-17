<template>
  <page-view  logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="2" class="detail-layout">
      <detail-list-item term="药店名">{{ pharmacyName }}</detail-list-item>
      <detail-list-item term="药店 ID">{{ id }}</detail-list-item>
      <detail-list-item term="地址">{{ address }}</detail-list-item>
      <detail-list-item term="联系人">{{ contactPerson }}</detail-list-item>
      <detail-list-item term="电话">{{ tel }}</detail-list-item>
      <detail-list-item term="配送公司">{{ delivery }}</detail-list-item>
      <detail-list-item term="配额">{{ quota }}</detail-list-item>
    </detail-list>

    <a-card
      class="project-list"
      style="margin-bottom: 24px; margin-top: 24px"
      title="历史上报信息">

      <a-table
        size="small"
        :scroll="{x: 640, y: 3600}"
        :columns="dataColumns"
        :dataSource="data"
        :pagination="pagination_data"
        :loading="loading"
        :bordered="bordered">
      </a-table>

    </a-card>

    <a-card
      class="project-list"
      style="margin-bottom: 24px; margin-top: 24px"
      title="居委信息（收集中）"
      :bordered="true">

      <a-table
        size="small"
        :scroll="{x: 1040, y: 3600}"
        :columns="comColumns"
        :dataSource="comData"
        :pagination="pagination_com"
        :loading="loading"
        :bordered="bordered">
      </a-table>

    </a-card>



  </page-view>
</template>

<script>
  import {mixinDevice} from '@/utils/mixin'
  import {PageView} from '@/layouts'
  import {getStoreDetail} from '@/api/manage'
  import DetailList from '@/components/tools/DetailList'
  import moment from 'moment'

  const DetailListItem = DetailList.Item

  export default {
    name: 'Advanced',
    components: {
      PageView,
      DetailList,
      DetailListItem
    },
    mixins: [mixinDevice],
    data() {
      return {
        comData: [],
        data: [],
        loading: false,
        comColumns: [{title: '居委会名称', dataIndex: 'name', key: '1', width: 240, className: 'table-header'},
                  {title: '联系人', dataIndex: 'com_per', key: '2', width: 200, className: 'table-header'},
                  {title: '联系电话', dataIndex: 'tel', key: '3', width: 200, className: 'table-header'},
                  {title: '配额', dataIndex: 'quota', key: '4', width: 200, className: 'table-header'},
                  {title: '分配比例', dataIndex: 'quotaRate', key: '5', width: 200, className: 'table-header'}],
        dataColumns: [{title: '日期', dataIndex: 'date', key: '1', width: 120, className: 'table-header'},
                      {title: '配额', dataIndex: 'quota', key: '2', width: 120, className: 'table-header'},
                      {title: '进货量', dataIndex: 'purchased', key: '3', width: 120, className: 'table-header'},
                      {title: '售出量', dataIndex: 'sale', key: '4', width: 120, className: 'table-header'},
                      {title: '损耗', dataIndex: 'loss', key: '5', width: 120, className: 'table-header'},
                      {title: '库存', dataIndex: 'balance', key: '6', width: 120, className: 'table-header'},
                      {title: '是否上报', dataIndex: 'reported', key: '7', width: 120, className: 'table-header'}],
        pharmacyName: '',
        id: '',
        address: '',
        contactPerson: '',
        tel: '',
        delivery: '',
        quota: '',
        pagination_data: {pageSize: 41, hideOnSinglePage: true},
        pagination_com: {pageSize: 10, hideOnSinglePage: true},
        bordered: true,
        purchasedTotal: 0,
        saleTotal: 0,
        lossTotal: 0,
        quotaTotal: 0
      }
    },
    created() {
      console.log('id',this.$route.query.id)
      this.loadData()
    },
    methods: {
      loadData() {
        this.loading = true
        let obj = this
        getStoreDetail({phar_id: obj.$route.query.id}).then(function(data) {
          console.log("data", data)
          obj.pharmacyName = data["phar_name"]
          obj.id = data["phar_id"]
          obj.address = data["phar_addr"]
          obj.contactPerson = data["phar_con_per"]
          obj.tel = data["phar_con_tel"]
          obj.delivery = data["company"]
          obj.quota = data["phar_quota"]


          let com = data["cor_committee"]
          for (let i in com) {
            obj.comData.push({
              name: com[i]["com_name"],
              com_per: com[i]["com_con_per"],
              tel: com[i]["com_con_tel"],
              quota: '/',
              quotaRate: parseFloat(com[i]["com_quota_rate"]).toFixed(3) + '%',
            })
          }
          let days = data["days_data"]
          for (let i in days) {
            let date = moment(days[i]["phar_date"]).format("YYYY-MM-DD");
            obj.data.push({
              date: date,
              quota: data["quota"][i]['quota'],
              purchased: days[i]["purchased"],
              sale: days[i]["issued"],
              loss: days[i]["loss"],
              balance: days[i]["balance"],
              reported: (parseInt(days[i]["tag"]) === 1 ? '是' : '否')
            })
            obj.purchasedTotal += parseInt(days[i]["purchased"])
            obj.saleTotal += parseInt(days[i]["issued"])
            obj.lossTotal += parseInt(days[i]["loss"])
            obj.quotaTotal += parseInt(data["quota"][i]['quota'])
          }
          obj.data.push({
            date: '合计',
            quota: obj.quotaTotal,
            purchased: obj.purchasedTotal,
            sale: obj.saleTotal,
            loss: obj.lossTotal,
            balance: '/',
            reported: '/'
          })

          obj.loading = false
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

