<template>
  <page-view title="" logo="">
    <a-card :bordered="false">

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
              <a-form-item label="配送企业">
                <a-select
                  showSearch
                  placeholder="请选择配送企业"
                  optionFilterProp="children"
                  v-model="queryParam.company"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in companyList" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-left: 8px" type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>
            <a-col :md="4" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">{{ downloadText }}</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div style="text-align: center;color: rgb(245, 34, 45);"> <strong>  <a-icon type="star" />请配送企业注意，鼓励配送企业优先消化库存<a-icon type="star" /></strong></div>
      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered"
        :scroll="{ x: 1500}"
        @change="handleTableChange">

        <template v-for="col in columns" :slot="col.scopedSlots.customRender" slot-scope="data">
          <template v-if="col.slotType === 'text'">
            <div class="row-cell-div" :style="col.tdDivStyle" :key="col.index">
              <span>{{ data }}</span>
            </div>
          </template>
        </template>

      </a-table>
    </a-card>
  </page-view>

</template>

<script>
import { getComQuotaList } from '@/api/manage'
import { PageView } from '@/layouts'
import Vue from 'vue'
import { USERNAME } from '@/store/mutation-types'
import json2excel from '@/utils/json2excel'

function table2excel (jsonData, substr) {
  // 要导出的json数据
  const head = ['CID', '市辖区', '配送企业', 'PID', '门店名称', '门店地址', '门店配额', '门店库存', '填报时间', '街道', '居委会名', '居委配额', '门户数']
  const keys = ['com_id', 'district', 'company', 'phar_id', 'phar_name', 'phar_addr', 'phar_quota', 'phar_balance', 'phar_date', 'street_name', 'com_name', 'quota', 'house_num']
  const title = '居村委明细表(' + substr + ')'
  jsonData.forEach(item => {
    item['phar_date'] = item['last_report']['phar_date']
    item['phar_balance'] = item['last_report']['balance']
  })
  json2excel(jsonData, head, keys, title)
}

export default {
  name: 'CommitteeList',
  components: {
    PageView
  },
  data () {
    return {
      queryParam: {},
      companyList: ['所有企业',
        '国大', '华氏', '益丰', '好药师', '养和堂',
        '华泰', '云湖', '第一医药', '老百姓', '余天成',
        '童涵春', '恒德', '人和堂', '健一', '雷北',
        '嘉定医药', '雷西', '上海药房', '海王', '宝岛',
        '太安堂', '万芸', '亲民', '康君阁', '好邻居',
        '龙威', '金匮堂', '诚康', '百合缘', '顺源',
        '富民', '鸿翔', '南汇开心人', '叮当', '浦东开心人',
        '荣庆堂', '裕德堂', '龙竹堂', '浦东同仁堂', '平民',
        '宏顺堂', '芝林', '华中便民', '康乾', '百秀', '九和堂',
        '普安法玛', '国慈', '平安', '同谊', '德大堂', '别样红',
        '惠生堂', '蔡同德', '黄浦同仁堂', '康每乐', '得一'],
      columns: [],
      colTitle: ['CID', '市辖区', '配送企业', 'PID', '门店名称', '门店地址', '门店配额', '门店库存', '填报时间', '街道', '居委会名', '居委配额', '门户数'],
      colIndex: ['com_id', 'district', 'company', 'phar_id', 'phar_name', 'phar_addr', 'phar_quota', 'phar_balance', 'phar_date', 'street_name', 'com_name', 'quota', 'house_num'],
      colWidth: ['36px', '50px', '58px', '36px', '160px', '200px', '58px', '58px', '130px', '58px', '130px', '58px', '45px'],
      data: [],
      downloadText: '下载表格',
      loading: false,
      bordered: true,
      pagination: { pageSize: 10 },
      quotaTotal: 0,
      committeeTotal: 0,
      streetTotal: 0,
      districtList: ['全上海市', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区',
        '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
      authority: false

    }
  },
  created () {
    this.authority = Vue.ls.get(USERNAME).indexOf('shanghai') !== -1
    this.loadColumns()
    this.init()
  },
  methods: {
    reset () {
      this.queryParam = {}
      this.init()
    },
    pushList (data) {
      this.data = []
      data.forEach(item => {
        item['phar_date'] = item['last_report']['phar_date']
        item['phar_balance'] = item['last_report']['balance']
        this.data.push(item)
      })
    },
    loadColumns () {
      for (let i = 0; i < this.colTitle.length; i++) {
        const col = {
          index: i,
          slotType: 'text',
          dataIndex: this.colIndex[i],
          title: this.colTitle[i],
          width: this.colWidth[i],
          tdDivStyle: {
            width: this.colWidth[i]
          },
          scopedSlots: { customRender: 'row-text-view' + i },
          className: 'table-header'
        }
        this.columns.push(col)
      }
    },
    init () {
      const obj = this
      this.loading = true
      const para = this.getPara({ pageNo: 1, pageSize: this.pagination.pageSize })
      const pagination = { ...this.pagination }
      getComQuotaList(para).then(function (data) {
        obj.pagination = pagination
        if (!para.district && !para.company) {
          pagination.total = 150 * 40
        } else if (!para.company) {
          pagination.total = 10 * 40
        } else if (!para.district) {
          pagination.total = 15 * 40
        } else {
          pagination.total = 9 * 40
        }
        if ('total' in data) {
          pagination.total = data['total']
        }
        obj.pushList(data['data'])
        obj.loading = false
      }).catch(err => { obj.timeOut(err) })
        .finally(() => {
          obj.loading = false
        })
    },
    download () {
      if (this.downloadText.indexOf('下载中') !== -1) {
        return
      }
      const that = this
      const h = setInterval(function () {
        switch (that.downloadText) {
          case '下载中':
            that.downloadText = '下载中.'; break
          case '下载中.':
            that.downloadText = '下载中..'; break
          case '下载中..':
            that.downloadText = '下载中...'; break
          case '下载中...':
            that.downloadText = '下载中....'; break
          case '下载中....':
            that.downloadText = '下载中.....'; break
          case '下载中.....':
            that.downloadText = '下载中.'; break
        }
      }, 500)
      const para = this.getPara({})
      const username = Vue.ls.get(USERNAME)
      const district = this.queryParam.district ? this.queryParam.district : (this.authority ? '全上海市' : username.replace('m','').replace('s',''))
      const company = this.queryParam.company ? this.queryParam.company : '所有公司'
      const str = district + '_' + company
      this.downloadText = '下载中'
      getComQuotaList(para)
        .then(data => { table2excel(data['data'], str) })
        .catch(err => { that.requestFailed(err) })
        .finally(() => {
          this.downloadText = '下载表格'
          clearInterval(h)
        })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    requestFailed (err) {
      if (err.response.status === 504) {
        this.$notification['error']({
          message: '下载超时',
          description: '下载的文件过大',
          duration: 4
        })
      } else {
        this.$notification['error']({
          message: '下载失败',
          description: '网络请求出现错误，请稍后再试',
          duration: 4
        })
      }
    },
    getPara (parameter) {
      const username = Vue.ls.get(USERNAME)
      const para = { ...parameter }
      para.district = this.queryParam.district ? this.queryParam.district : (this.authority ? '' : username.replace('m','').replace('s',''))
      para.company = this.queryParam.company ? this.queryParam.company : ''
      if (para.district === '全上海市') {
        para.district = ''
      }
      if (para.company === '所有企业') {
        para.company = ''
      }
      return para
    },
    timeOut (err) {
      if (err.response.status === 504) {
        this.$notification['error']({
          message: '查询超时',
          description: '查询的内容过多',
          duration: 4
        })
      } else {
        this.$notification['error']({
          message: '查询失败',
          description: '网络请求出现错误，请稍后再试',
          duration: 4
        })
      }
    },
    handleSearch () {
      const obj = this
      const para = this.getPara({ pageNo: 1, pageSize: this.pagination.pageSize })
      this.loading = true
      const pagination = { ...this.pagination }
      getComQuotaList(para).then(function (data) {
        obj.pagination = pagination
        if (!para.district && !para.company) {
          pagination.total = 150 * 40
        } else if (!para.company) {
          pagination.total = 10 * 40
        } else if (!para.district) {
          pagination.total = 15 * 40
        } else {
          pagination.total = 9 * 40
        }
        if ('total' in data) {
          pagination.total = data['total']
        }
        obj.pushList(data['data'])
        obj.loading = false
      }).catch(err => { obj.timeOut(err) })
        .finally(() => {
          obj.loading = false
        })
    },
    handleTableChange (pagination, filters, sorter) {
      const obj = this
      const para = this.getPara({ pageNo: pagination.current, pageSize: pagination.pageSize })
      const raw_pagination = { ...this.pagination }
      raw_pagination.current = pagination.current
      this.pagination = raw_pagination
      this.loading = true
      getComQuotaList(para).then(function (data) {
        obj.pushList(data['data'])
        obj.loading = false
      }).catch(err => { obj.timeOut(err) })
        .finally(() => {
          obj.loading = false
        })
    }
  }
}
</script>

<style type="text/css">
  /*.ant-table-body td{*/
  /*  padding-left: 4px!important;*/
  /*}*/
</style>
