<template>
  <page-view logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="3" class="detail-layout">
      <detail-list-item term="居委会名称">{{ com_name }}</detail-list-item>
      <detail-list-item term="居委会 ID">{{ com_id }}</detail-list-item>
      <detail-list-item term="联系人">{{ com_con_per }}</detail-list-item>
      <detail-list-item term="电话">{{ com_con_tel }}</detail-list-item>
      <detail-list-item term="街道"><a :href="street_url">{{ street_name }}</a></detail-list-item>
      <detail-list-item term="累计预约登记户数">{{ total_reserve }}</detail-list-item>
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
        <template slot="reserve" slot-scope="text, record">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, record)"
            />
            <template v-else>{{ text }}</template>
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
          { title: '日期', dataIndex: 'date', key: '1', width: 150, className: 'table-header' },
          { title: '当日配额', dataIndex: 'quota', key: '2', width: 180, className: 'table-header' },
          { title: '当日预约户数', dataIndex: 'reserve', key: '3', width: 180, className: 'table-header', scopedSlots: { customRender: 'reserve' }},
          { title: '是否上报', dataIndex: 'reported', key: '4', width: 120, className: 'table-header' },
          { title: '操作', dataIndex: 'action', key: '5', width: 120, scopedSlots: { customRender: 'action' }, className: 'table-header' }
        ],
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
        com_name:'',
        com_id: '',
        com_con_per: '',
        com_con_tel: '',
        street_name:'',
        street_url:'',
        total_reserve:0,
        form: null,
        cacheData: [],
      }
    },
    created () {
      this.loadData();
    },
    methods: {
      loadData () {
        let that = this;
        this.loading = true;
        const para = {com_id: this.$route.query.id };
        getCommitteeDetail(para)
        .then(data=>{
          that.street_name = data.street_name;
          that.com_name = data.com_name;
          that.com_id = data.com_id;
          that.com_con_tel = data.com_con_tel;
          that.com_con_per = data.com_con_per;
          that.street_url = '/profile/streetInfo?id=' + data.street_id;
          that.loading = false;
          that.loadHistory(data);
          that.calculateTotal();
        })
      },
      loadHistory (data) {
        const reported = {true:'是',false:'否'}
        this.data = [];
        const com_days = data['com_days_data'];
        const quotas = data['quota'];
        let index = 0;
        let date;
        let quota;
        com_days.forEach(item=>{
          for(let index = 0; index < quotas.length; index++){
            if(quotas[index]['date'] === item['com_date'].substr(0,10)){
              date = quotas[index]['date'];
              quota = quotas[index]['quota'];
              break;
            }
          }
          this.data.push({
            date:date,
            quota:quota,
            reported:reported[parseInt(item['tag'])=== 1],
            key:index++,
            reserve:item['reserve'],
            editable:false
          })
        })
        this.cacheData = this.data.map(item=>{
          return {...item}
        })
      },
      handleChange (value, key, record) {
        if (/^\d+$/.test(value) || value === '') {
          record['reserve'] = value;
          this.calculateTotal();
        }
      },
      calculateTotal(){
        this.total_reserve = 0;
        this.data.forEach(item=>{
          if(/^\d+$/.test(item.reserve)){
            this.total_reserve += parseInt(item.reserve)
          }
        })
      },
      edit (row) {
        if(row.reported === '否'){
          row.reserve = '';
        }
        row.editable = true;
      },
      save (row) {
        if(row.reserve === ''){
          this.showError('当日预约数据不能为空')
        } else {
          const para = {'date':row.date, 'reserve':row.reserve, 'com_id':this.com_id};
          this.editSubmit(para,row);
        }
      },
      editSubmit(para, row){
        let that = this;
        editCommData(para)
          .then(res=>{
            if('status' in res && res['status'] >= 0){
              row.editable = false;
              that.cacheData[parseInt(row.key)] = row;
            } else {
              that.showError('提交失败，网络故障');
            }
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
          if (item.key === row.key) {
            return {...this.cacheData[parseInt(row.key)]};
          } else {
            return item;
          }
        });
        this.calculateTotal();
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
