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
        :scroll="{x: 960, y: 3600}"
        :columns="dataColumns"
        :dataSource="data"
        :pagination="pagination_data"
        :loading="loading"
        :bordered="bordered">
        <span slot="comName" slot-scope="text, record">
          <template>
            <div>
              <a :href="record.url" target="_blank">{{ record.comName }}</a>
            </div>
          </template>
        </span>
        <template v-for="(col, index) in columns" v-if="col.scopedSlots" :slot="col.dataIndex" slot-scope="text, record">
          <div :key="index">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col, record)"
            />
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="真的放弃编辑吗?" @confirm="() => cancel(record)">
              <a>取消</a>
            </a-popconfirm>
          </span>
            <span v-else>
            <a class="edit" @click="() => edit(record)">修改</a>
          </span>
          </div>
        </template>
      </a-table>

    </a-card>

  </page-view>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'
import { getStreetDetail, editCommData } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
import moment from 'moment'
import json2excel from '@/utils/json2excel'
const DetailListItem = DetailList.Item
import notification from 'ant-design-vue/es/notification'

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
      queryParam:{},
      catchData:[],
      columns:[
        { title: '今日预约登记户数', dataIndex: 'today', scopedSlots: { customRender: 'today' }}
      ],
      dataColumns: [
        { title: '居委会 ID', dataIndex: 'id', key: '1', width: 80, className: 'table-header' },
        { title: '居委会名称', dataIndex: 'comName', key: '2', width: 160, className: 'table-header',  scopedSlots: { customRender: 'comName' } },
        { title: '联系人', dataIndex: 'conPer', key: '3', width: 120, className: 'table-header' },
        { title: '联系电话', dataIndex: 'tel', key: '4', width: 120, className: 'table-header' },
        { title: '当日预约登记户数', dataIndex: 'today', key: '5', width: 120, className: 'table-header', scopedSlots: { customRender: 'today' } },
        { title: '累计预约登记户数', dataIndex: 'total', key: '6', width: 120, className: 'table-header' },
        { title: '填报时间', dataIndex: 'date', key: '7', width: 120, className: 'table-header' },
        { title: '操作', dataIndex: 'action', key: '8', width: '90px', scopedSlots: { customRender: 'action' }, className: 'table-header' }
        ],
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
    handleChange (value, key, column, record) {
      let last_total = record.today === '未填报' ? parseInt(record.total):parseInt(record.total - record.today);
      if (/^\d+$/.test(value)) {
        record['today'] = value;
        record['total'] = parseInt(value) + last_total;
      } else if(value === ''){
        record['today'] = value;
        record['total'] = last_total;
      }
    },
    loadReportData(para){
      const that = this;
      that.data = [];
      that.loading = true;
      getStreetDetail(para)
        .then(function (data) {
          that.name = data['street_name'];
          that.id = data['street_id'];
          data = data['committees']
          let index = 0;
          for (const i in data) {
            that.data.push({
              key:index,
              street_id: that.name,
              street_name: that.id ,
              comName: data[i]['com_name'],
              id: data[i]['com_id'],
              conPer: data[i]['com_con_per'],
              tel: data[i]['com_con_tel'],
              date: data[i]['m_time'],
              today: data[i]['today_r'],
              total: data[i]['total'],
              url: '/profile/committee?id=' + data[i]['com_id']
            });
            index++;
            that.todayTotal = data[i]['today_r'] === '未填报' ? '未填报' : that.todayTotal + parseInt(data[i]['today_r'])
            that.total += parseInt(data[i]['total'])
          }
          that.cacheData = that.data.map(item => ({ ...item }))
      }).finally(()=>{
        that.loading = false;
      })
    },
    init () {
      this.handleSearch();
    },
    handleSearch () {
      const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      const para = { date: date,  street_id: this.$route.query.id };
      this.loadReportData(para);
    },
    edit (row) {
      this.data = this.data.map(item => {
        if (item.id === row.id) {
          item.today = item.today ==='未填报'?'':item.today;
          return { ...item, editable: true}
        } else {
          return item;
        }
      });
    },
    save (row) {
      if(row.total !== '' && row.today !== ''){
        const date = this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
        const para = {'date':date, 'reserve':row.today, 'com_id':row.id};
        this.editSubmit(para,row);
      } else {
        this.showError('预约数据不能为空');
      }
    },
    editSubmit(para, row){
      let that = this;
      editCommData(para)
        .then(res=>{
          row.editable = false;
          that.cacheData[parseInt(row.key)] = row;
        })
        .catch(res=>{
          that.showError('提交失败，网络故障');
          that.cancel(row);
        })
    },
    showError (message) {
      setTimeout(function () {
        notification.error({
          message: '错误',
          description: message
        })
      }, 300)
    },
    cancel (row) {
      this.data = this.data.map(item => {
        if (item.id === row.id) {
          return {...this.cacheData[parseInt(row.key)]};
        } else {
          return item;
        }
      });
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
