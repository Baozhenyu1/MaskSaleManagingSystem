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
              <a-form-item label="公司">
                <a-select
                  showSearch
                  placeholder="请选择公司"
                  optionFilterProp="children"
                  v-model="queryParam.company"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in companyList" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="药店名称">
                <a-input v-model="queryParam.keyword" placeholder="请输入药店名称"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="日期">
                <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请选择日期"/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-left: 8px" type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>
            <a-col :md="8" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
              </span>
            </a-col>
            <br/>
            <span style="margin-left: 25px">
              {{ '配额总数：' + quotaTotal }}
            </span>
            <span style="margin-left: 25px">
              {{ '总门店数：' + storeCount }}
            </span>
          </a-row>
        </a-form>
      </div>

      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered">

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
import { getQuotaList } from '@/api/manage'
import { PageView } from '@/layouts'
import Vue from 'vue'
import { USERNAME } from '@/store/mutation-types'
import json2excel from '@/utils/json2excel'
import moment from 'moment'
function table2excel (jsonData, substr) {
  // 要导出的json数据
  const head = ['ID', '市辖区', '公司', '药房名称', '药房地址', '联系人', '联系电话', '药店配额']
  const keys = ['id', 'district', 'company', 'name', 'address', 'con_per', 'tel', 'quota']
  const title = '药店分发表(' + substr + ')'
  json2excel(jsonData, head, keys, title)
}

export default {
  name: 'DistributionList',
  components: {
    PageView
  },
  data () {
    return {
      queryParam: {},
      companyList: [
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
      colTitle: ['ID', '市辖区', '公司', '药房名称', '药房地址', '联系人', '联系电话', '药店配额'],
      colIndex: ['id', 'district', 'company', 'name', 'address', 'con_per', 'tel', 'quota'],
      colWidth: ['40px', '80px', '80px', '230px', '230px', '70px', '90px', '100px'],
      data: [],
      loading: false,
      bordered: true,
      pagination: { pageSize: 20 },
      quotaTotal: 0,
      storeCount: 0,
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
      for (const i in data) {
        this.data.push({
          id: data[i]['phar_id'],
          district: data[i]['district'],
          company: data[i]['company'],
          name: data[i]['phar_name'],
          address: data[i]['phar_addr'],
          con_per: data[i]['phar_con_per'],
          tel: data[i]['phar_con_tel'],
          quota: data[i]['phar_quota']
        })
      }
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
      getQuotaList().then(function (data) {
        obj.quotaTotal = data['total_quota']
        obj.storeCount = data['store_count']
        data = data['data']
        obj.pushList(data)
        obj.loading = false
      })
    },
    download () {
      const username = Vue.ls.get(USERNAME)
      const district = this.queryParam.district ? this.queryParam.district : (this.authority ? '全上海市' : username)
      const company = this.queryParam.company ? this.queryParam.company : '所有公司'
      const keyword = this.queryParam.keyword ? this.queryParam.keyword : ''
      const date = (this.queryParam.date ? moment(new Date(this.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
      const str = district + '_' + company + '_' + date + (keyword === '' ? '' : ('_' + keyword))

      table2excel(this.data, str)
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSearch () {
      const obj = this
      const para = {
        company: obj.queryParam.company,
        keyword: obj.queryParam.keyword,
        district: obj.queryParam.district ? (obj.queryParam.district === '全上海市' ? '' : obj.queryParam.district) : '',
        date: (obj.queryParam.date ? moment(new Date(obj.queryParam.date._d)).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
      }
      this.loading = true
      getQuotaList(para).then(function (data) {
        obj.quotaTotal = data['total_quota']
        obj.storeCount = data['store_count']
        data = data['data']
        obj.pushList(data)
        obj.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
