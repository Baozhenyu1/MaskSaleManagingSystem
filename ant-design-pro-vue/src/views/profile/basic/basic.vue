<template>
  <page-view logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list slot="headerContent" size="medium" :col="3" class="detail-layout">
      <detail-list-item term="药店名">{{ detail.pharmacyName }}</detail-list-item>
      <detail-list-item term="药店 ID">{{ detail.id }}</detail-list-item>
      <detail-list-item term="地址">{{ detail.address }}</detail-list-item>
      <detail-list-item term="联系人">{{ detail.contactPerson }}</detail-list-item>
      <detail-list-item term="电话">{{ detail.tel }}</detail-list-item>
      <detail-list-item term="配送公司">{{ detail.delivery }}</detail-list-item>
      <detail-list-item term="配额">{{ detail.quota }}</detail-list-item>
      <detail-list-item term="历史数据状态">
        <span class="history-error" v-if="!historyOk">
          存在异常数据
        </span>
        <span class="history-success" v-else>
          数据正常
        </span>
      </detail-list-item>
      <a @click="handleEdit()">编辑基本信息</a>
    </detail-list>
    <a-modal
      title="编辑基本信息"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form>

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
        >
          <a-input placeholder="药店名" v-model="mdl.pharmacyName" id="phar_name" disabled="disabled"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="地址"
          hasFeedback
        >
          <a-input
            v-decorator="[
              'phar_addr',
              {rules: [{ required: true, message: '请输入药店地址'}]}
            ]"
            placeholder="地址"
            v-model="mdl.address"
            id="phar_addr"
            name="phar_addr"/>
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
      title="历史上报信息">
      <span v-if="historyEditing" slot="extra">
        <a @click="() => save()" slot="extra">保存 </a>
        <a-popconfirm title="确定取消?" @confirm="() => cancel()" slot="extra">
          <a> 取消</a>
        </a-popconfirm>
      </span>
      <span v-else slot="extra">
        <a @click="() => edit()" slot="extra">修改</a>
      </span>

      <a-table
        :columns="dataColumns"
        :dataSource="data"
        :pagination="pagination_data"
        :loading="loading"
        :bordered="bordered"
      >
        <template
          v-for="col in ['purchased', 'sale', 'loss']"
          :slot="col"
          slot-scope="text, record, index"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template
              v-else
            >{{ text }}</template
            >
          </div>
        </template>
      </a-table>

    </a-card>

<!--    <a-card-->
<!--      class="project-list"-->
<!--      style="margin-bottom: 24px; margin-top: 24px"-->
<!--      title="居委信息（收集中）"-->
<!--      :bordered="true">-->

<!--      <a-table-->
<!--        size="small"-->
<!--        :scroll="{x: 1040, y: 3600}"-->
<!--        :columns="comColumns"-->
<!--        :dataSource="comData"-->
<!--        :pagination="pagination_com"-->
<!--        :loading="loading"-->
<!--        :bordered="bordered"-->
<!--      >-->
<!--      </a-table>-->

<!--    </a-card>-->

  </page-view>
</template>

<script>
import { mixinDevice } from '@/utils/mixin'
import { PageView } from '@/layouts'
import { getStoreDetail, editStoreBasicInfo, editStoreDaysData } from '@/api/manage'
import DetailList from '@/components/tools/DetailList'
import moment from 'moment'

import { USER_DISTRICT } from '@/store/mutation-types'
import Vue from 'vue'
import notification from 'ant-design-vue/es/notification'

const DetailListItem = DetailList.Item
const editTime = { 'start': '10:00', 'end': '22:00' }
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
      comData: [],
      data: [],
      loading: false,
      comColumns: [{ title: '居委会名称', dataIndex: 'name', key: '1', width: 240, className: 'table-header' },
        { title: '联系人', dataIndex: 'com_per', key: '2', width: 200, className: 'table-header' },
        { title: '联系电话', dataIndex: 'tel', key: '3', width: 200, className: 'table-header' },
        { title: '配额', dataIndex: 'quota', key: '4', width: 200, className: 'table-header' },
        { title: '分配比例', dataIndex: 'quotaRate', key: '5', width: 200, className: 'table-header' }],
      dataColumns: [{ title: '日期', dataIndex: 'date', key: '1', width: 200, className: 'table-header' },
        { title: '配额', dataIndex: 'quota', key: '2', width: 180, className: 'table-header' },
        { title: '进货量', dataIndex: 'purchased', key: '3', width: 180, className: 'table-header', scopedSlots: { customRender: 'purchased' } },
        { title: '售出量', dataIndex: 'sale', key: '4', width: 180, className: 'table-header', scopedSlots: { customRender: 'sale' } },
        { title: '损耗', dataIndex: 'loss', key: '5', width: 180, className: 'table-header', scopedSlots: { customRender: 'loss' } },
        { title: '库存', dataIndex: 'balance', key: '6', width: 180, className: 'table-header', scopedSlots: { customRender: 'balance' } },
        { title: '是否上报', dataIndex: 'reported', key: '7', width: 120, className: 'table-header' }],
      detail: {},
      pagination_data: { pageSize: 41, hideOnSinglePage: true },
      pagination_com: { pageSize: 10, hideOnSinglePage: true },
      bordered: true,
      visible: false,
      editHistoryVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      mdl: {},
      mdlHistory: {},
      cacheData: {},
      historyOk: true,
      historyEditing: false
    }
  },
  created () {
    this.loadData();
  },
  methods: {
    loadCom (data) {
      const com = data['cor_committee']
      if (com) {
        com.forEach(item => {
          this.comData.push({
            name: item['com_name'],
            com_per: item['com_con_per'],
            tel: item['com_con_tel'],
            quota: '/',
            quotaRate: parseFloat(item['com_quota_rate']).toFixed(3) + '%'
          })
        })
      }
    },
    loadData () {
      const obj = this
      this.loading = true
      getStoreDetail({ phar_id: obj.$route.query.id }).then(function (data) {
        obj.detail.pharmacyName = data['phar_name']
        obj.detail.id = data['phar_id']
        obj.detail.address = data['phar_addr']
        obj.detail.contactPerson = data['phar_con_per']
        obj.detail.tel = data['phar_con_tel']
        obj.detail.delivery = data['company']
        obj.detail.quota = data['phar_quota']
        obj.detail.district = data['district']
        obj.loadCom(data);
        obj.handHistory(data);
      }).finally(()=>{
        obj.loading = false;
      })
    },
    loadHistory () {
      this.loading = true
      const obj = this
      getStoreDetail({ phar_id: obj.$route.query.id }).then(function (data) {
        obj.handHistory(data);
      })
    },
    handHistory (data) {
      const obj = this
      obj.data = []
      const days = data['days_data']
      let index = 0;
      if(!parseInt(days[0]['purchased']) && !parseInt(days[0]['issued']) && !parseInt(days[0]['loss']) ){
        days[0]['purchased'] = days[0]['balance']; // 对于第一日只有库存的，强制配平
      }
      days.forEach(item => {
        obj.data.push({
          key: index,
          date: moment(item['phar_date']).format('YYYY-MM-DD'),
          report_time: item['phar_date'],
          tag: item['tag'],
          quota: data['quota'][index]['quota'],
          purchased: item['purchased'],
          sale: item['issued'],
          loss: item['loss'],
          balance: item['balance'],
          reported: (parseInt(item['tag']) === 1 ? '是' : '否')
        })
        index++
      })
      obj.loading = false
      obj.cacheData = obj.data.map(item => ({ ...item }))
      if (obj.checkLogicError(false) <= 0) {
        obj.historyOk = false
      }
    },
    handleEdit () {
      if (!this.checkAuthority()) {
        this.modifyNoAuthority()
        return
      }
      if (!this.checkTime()) {
        this.notOpenModification()
        return
      }
      this.mdl = Object.assign({}, this.detail)
      this.visible = true
    },
    handleOk () {
      if (!this.checkTime()) {
        this.notOpenModification()
        this.visible = false
        return
      }
      const that = this
      editStoreBasicInfo({ 'district': this.detail.district,
        'phar_id': this.mdl.id,
        'phar_addr': this.mdl.address,
        'phar_con_per': this.mdl.contactPerson,
        'phar_con_tel': this.mdl.tel }).then(function (data) {
        if (parseInt(data['status']) === 1) {
          that.detail = Object.assign({}, that.mdl)
          that.visible = false
          that.modifySuccess()
        } else if (parseInt(data['status']) === 0) {
          that.visible = false
          that.noModification()
        }
      })
    },
    handleChange (value, key, column) {
      key = parseInt(key)
      const newData = [...this.data]
      let target = newData[key]
      let y_last = key === 0 ? 0 : parseInt(newData[key - 1]['balance'])
      if (target) {
        if ((/^\d+$/.test(value) || /^-\d+$/.test(value))) {
          target[column] = parseInt(value) // 这里强制转化为整数
          for (let index = key; index < this.data.length; index++) {
            target = newData[index]
            if (parseInt(target['tag']) === 0 && index === this.data.length - 1) {
              break
            }
            target['balance'] = y_last + parseInt(target['purchased']) - parseInt(target['sale']) - parseInt(target['loss'])
            y_last = target['balance']
          }
        } else if(value === ''){
          target['balance'] = '';
        }
        this.data = newData
      }
    },
    edit () {
      if (!this.checkAuthority()) {
        this.modifyNoAuthority()
        return
      }
      if (!this.checkTime()) {
        this.notOpenModification()
        return
      }
      this.historyEditing = true
      let index = -1
      this.data = this.data.map(item => {
        index++
        if (parseInt(item.tag) === 0 && index === this.data.length - 1) {
          return { ...item, 'editable': false }
        } else {
          return { ...item, 'editable': true }
        }
      })
    },
    checkAuthority () {
      let district = Vue.ls.get(USER_DISTRICT);
      return district === '上海市' || district === this.detail.district
    },
    save () {
      if (!this.checkTime()) {
        this.notOpenModification()
        this.historyEditing = false
        this.data.forEach(item => {
          item['editable'] = false
        })
        return
      }
      if (this.checkValueError() < 0 || this.checkLogicError() < 0) {
        return
      }
      this.updateHistory()
    },
    showError (index, error) {
      const checking_keys = ['进货量', '销售量', '损耗量', '库存']
      const message = error < 0 ? (checking_keys[index] + '不能为空') : (checking_keys[index] + '不能为负数')
      setTimeout(function () {
        notification.error({
          message: '错误',
          description: message
        })
      }, 300)
    },
    checkValueError () {
      const required_keys = ['purchased', 'sale', 'loss', 'balance']
      let item
      for (let index = 0; index < this.data.length; index++) {
        item = this.data[index]
        for (let index = 0; index < required_keys.length; index++) {
          if (item[required_keys[index]] === '') {
            this.showError(index, -1)
            return -1
          }
          if (parseInt(item[required_keys[index]]) < 0) {
            this.showError(index, 1)
            return -1
          }
        }
      }
      return 1
    },
    checkLogicError (show = true) {
      let y_last = 0
      let target
      for (let index = 0; index < this.data.length; index++) {
        target = this.data[index]
        if (parseInt(target['tag']) === 0 && index === this.data.length - 1) { // 未填报数据不需要修改也不需要检查逻辑，今天没有填报的
          break
        }
        if (y_last + parseInt(target['purchased']) - parseInt(target['sale']) - parseInt(target['loss']) !== parseInt(target['balance'])) {
          if (show) {
            setTimeout(function () {
              notification.error({
                message: '错误',
                description: '提交失败，' + target['date'] + '日数据不符合计算逻辑'
              })
            }, 300)
          }
          return -index
        }
        y_last = parseInt(target['balance'])
      }
      return 1
    },
    cancel () {
      this.data = []
      this.cacheData.forEach(item => {
        this.data.push({ ...item })
      })
      this.historyEditing = false
    },
    updateHistory () {
      const postDict = { 'district': this.detail.district, 'phar_id': this.detail.id }
      postDict['days_data'] = []
      let index = 0
      const len = this.data.length
      this.data.forEach(item => {
        postDict['days_data'].push({ 'phar_date': item.report_time,
          'purchased': item.purchased,
          'issued': item.sale,
          'tag': index === len - 1 ? item.tag : 1,
          'loss': item.loss,
          'balance': item.balance
        })
        index++
      })
      const that = this
      editStoreDaysData(postDict).then(function (data) {
        that.historyEditing = false
        that.data.forEach(item => {
          item['editable'] = false
        })
        if (parseInt(data['status']) === 1) {
          that.modifySuccess()
        } else if (parseInt(data['status']) === 0) {
          that.noModification()
        } else {
          that.modifyDelay()
        }
      }).finally(()=>{
        that.loadHistory()
      })
    },
    noModification () {
      setTimeout(function () {
        notification.success({
          message: '成功',
          description: '数据未修改'
        })
      }, 300)
    },
    modifySuccess () {
      setTimeout(function () {
        notification.success({
          message: '成功',
          description: '数据提交成功'
        })
      }, 300)
    },
    modifyDelay () {
      setTimeout(function () {
        notification.error({
          message: '失败',
          description: '数据修改超时'
        })
      }, 300)
    },
    modifyNoAuthority () {
      setTimeout(function () {
        notification.error({
          message: '错误',
          description: '没有操作权限'
        })
      }, 300)
    },
    notOpenModification () {
      const message = '不在时间' + editTime['start'] + '-' + editTime['end'] + '内，无法修改。'
      setTimeout(function () {
        notification.error({
          message: '错误',
          description: message
        })
      }, 300)
    },
    checkTime () {
      const d = new Date()
      let h = d.getHours()
      h = h < 10 ? ('0' + h) : h
      let min = d.getMinutes()
      min = min < 10 ? ('0' + min) : min
      const time = h + ':' + min
      return editTime['start'] <= time && time <= editTime['end']
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
