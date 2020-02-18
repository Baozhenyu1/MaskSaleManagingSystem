<template>
  <page-view  logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="2" class="detail-layout">
      <detail-list-item term="药店名">{{ detail.pharmacyName }}</detail-list-item>
      <detail-list-item term="药店 ID">{{ detail.id }}</detail-list-item>
      <detail-list-item term="地址">{{ detail.address }}</detail-list-item>
      <detail-list-item term="联系人">{{ detail.contactPerson }}</detail-list-item>
      <detail-list-item term="电话">{{ detail.tel }}</detail-list-item>
      <detail-list-item term="配送公司">{{ detail.delivery }}</detail-list-item>
      <detail-list-item term="配额">{{ detail.quota }}</detail-list-item>
<!--      <a @click="handleEdit(detail)">编辑基本信息</a>-->
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

    <a-modal
      title="编辑基本信息"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="药店 ID"
          hasFeedback
        >
          <a-input placeholder="药店 ID" v-model="mdl.id" id="phar_id" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="药店名"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="药店名" v-model="mdl.pharmacyName" id="phar_name" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="地址"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="地址" v-model="mdl.address" id="phar_addr" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系人"
          hasFeedback
        >
          <a-input placeholder="联系人" v-model="mdl.contactPerson" id="phar_con_per" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="联系电话"
          hasFeedback
        >
          <a-input placeholder="联系电话" v-model="mdl.tel" id="phar_con_per" />

        </a-form-item>

      </a-form>
    </a-modal>
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
        detail:{},
        pagination_data: {pageSize: 41, hideOnSinglePage: true},
        pagination_com: {pageSize: 10, hideOnSinglePage: true},
        bordered: true,
        visible:false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        form: null,
        mdl:{},
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      loadData() {
        this.loading = true
        let obj = this
        getStoreDetail({phar_id: obj.$route.query.id}).then(function(data) {
          obj.detail.pharmacyName = data["phar_name"]
          obj.detail.id = data["phar_id"]
          obj.detail.address = data["phar_addr"]
          obj.detail.contactPerson = data["phar_con_per"]
          obj.detail.tel = data["phar_con_tel"]
          obj.detail.delivery = data["company"]
          obj.detail.quota = data["phar_quota"]


          let com = data["cor_committee"]
          if(com){
            com.forEach(item=>{
              obj.comData.push({
                name: item["com_name"],
                com_per: item["com_con_per"],
                tel: item["com_con_tel"],
                quota: '/',
                quotaRate: parseFloat(item["com_quota_rate"]).toFixed(3) + '%',
              })
            })
          }
          let days = data["days_data"]
          let purchasedTotal = 0;
          let saleTotal = 0;
          let lossTotal = 0;
          let quotaTotal = 0;
          let index = 0;
          days.forEach(item=>{
            obj.data.push({
              date: moment(item["phar_date"]).format("YYYY-MM-DD"),
              quota: data["quota"][index]['quota'],
              purchased: item["purchased"],
              sale: item["issued"],
              loss: item["loss"],
              balance: item["balance"],
              reported: (parseInt(item["tag"]) === 1 ? '是' : '否')
            })
            purchasedTotal += parseInt(item["purchased"])
            saleTotal += parseInt(item["issued"])
            lossTotal += parseInt(item["loss"])
            quotaTotal += parseInt(data["quota"][index]['quota'])
            index++;
          })

          obj.data.push({
            date: '合计',
            quota: quotaTotal,
            purchased: purchasedTotal,
            sale: saleTotal,
            loss: lossTotal,
            balance: '/',
            reported: '/'
          })
          obj.loading = false
        })
      },
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
      },
      handleOk () {
        this.detail = Object.assign({}, this.mdl)
        this.visible = false;
      },
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

