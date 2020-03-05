<template>
  <page-view logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="2" class="detail-layout">
      <detail-list-item term="居委会名称">{{ name }}</detail-list-item>
      <detail-list-item term="居委会 ID">{{ id }}</detail-list-item>
      <detail-list-item term="联系人">{{ contact }}</detail-list-item>
      <detail-list-item term="电话">{{ tel }}</detail-list-item>
    </detail-list>

    <a-card
      class="project-list"
      style="margin-bottom: 24px; margin-top: 24px"
      title="历史上报信息">
      <a-table
        :columns="dataColumns"
        :dataSource="data"
        :pagination="pagination_data"
        :loading="loading"
        :bordered="bordered"
      >
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
  import { getCommitteeDetail, editCommData} from '@/api/manage'

  import DetailList from '@/components/tools/DetailList'
  import moment from 'moment'
  import notification from 'ant-design-vue/es/notification'

  const DetailListItem = DetailList.Item
  export default {
    name: 'Advanced',
    components: {
      PageView,
      DetailList,
      DetailListItem
    },
    mixins: [mixinDevice],
    data () {
      return {
        data: [],
        loading: false,
        dataColumns: [
          { title: '日期', dataIndex: 'date', key: '1', width: 200, className: 'table-header' },
          { title: '当日预约登记户数', dataIndex: 'day', key: '2', width: 180, className: 'table-header' },
          { title: '是否上报', dataIndex: 'reported', key: '3', width: 120, className: 'table-header' },
          { title: '操作', dataIndex: 'action', key: '4', width: '90px', scopedSlots: { customRender: 'action' }, className: 'table-header' }
        ],
        columns:[ { title: '当日预约登记户数', dataIndex: 'day'}],
        pagination_data: { pageSize: 100, hideOnSinglePage: true },
        bordered: true,
        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        name:'',
        id: '',
        contact: '',
        tel: '',
        form: null,
        cacheData: {},
      }
    },
    created () {
      this.loadData();
    },
    methods: {
      loadCom (data) {

      },
      loadData () {

      },
      loadHistory () {

      },
      handleChange (value, key, column) {

      },
      edit () {

      },
      save () {

      },
      showError (message) {
        setTimeout(function () {
          notification.error({
            message: '错误',
            description: message
          })
        }, 300)
      },
      cancel () {

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
    [class = history-success] {
      font-weight: bold;
      color: #52c41a;
    }
    [class = history-error] {
      font-weight: bold;
      color: #f5222d;
    }
  }
</style>

<style type="text/css">
  [class = term] {
    font-weight: bold;
  }
</style>
