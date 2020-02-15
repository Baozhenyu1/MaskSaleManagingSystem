<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="64">
          <a-col :md="8" :sm="32">
            <a-form-item label="药品名称">
              <a-input v-model="queryParam.drug_name" placeholder="请输入药品名称"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="32">
            <a-form-item label="商品名">
              <a-input v-model="queryParam.brandname" placeholder="请输入商品名"/>
            </a-form-item>
          </a-col>

          <a-col :md="32" :sm="32">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">


              <a-button style="margin-left: 8px; margin-bottom: 8px" type="primary" @click="startSearch">查询</a-button>
              <a-button style="margin-left: 8px; margin-bottom: 8px"
                        @click="reset">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <a-table
      :columns="columns"
      :dataSource="data"
      :scroll="{ x: 1790, y: 3600 }"
      :pagination="pagination"
      :loading="loading"
      :bordered="bordered"
      @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
          <template>
              <div v-if="record.url != ''">
                <a :href="record.url" target="_blank">{{record.source_file}}</a>
              </div>
              <div v-else>
                <a>{{record.source_file}}</a>
              </div>
          </template>
        </span>
    </a-table>
  </a-card>
</template>

<script>
  import {getDrugBidList} from '@/api/manage'

  const columns = [
    {title: '药品通用名', dataIndex: 'drug_name', key: 'name', fixed: 'left', width: 200},
    {title: '商品名', dataIndex: 'product_name', key: 'age', width: 100},
    {title: '剂型', dataIndex: 'form', key: '1', width: 100},
    {title: '规格', dataIndex: 'specification', key: '2', width: 120},
    {title: '包装转换比', dataIndex: 'scale', key: '3', width: 110},
    {title: '单位', dataIndex: 'unit', key: '4', width: 70},
    {title: '中标价（元）', dataIndex: 'bid_price', key: '5', width: 120},
    {title: '质量层次', dataIndex: 'quality_level', key: '6', width: 100},
    {title: '生产企业', dataIndex: 'producer', key: '7', width: 150},
    {title: '投标企业', dataIndex: 'bidder', key: '8', width: 150},
    {title: '中标省份', dataIndex: 'bid_province', key: '9', width: 100},
    {title: '发布日期', dataIndex: 'release_date', key: '10', width: 120},
    {title: '备注', dataIndex: 'description', key: '11', width: 150},
    {title: '来源文件', dataIndex: 'source_file', key: '12', width: 200, scopedSlots: {customRender: 'action'},}
  ];

  function getUrlKey(name) {
    return decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[0].replace(/\+/g, '%20')) || ""
  }

  export default {
    mounted() {
      this.init()
    },
    name: "TenderInfo",
    data() {
      return {
        data: [],
        columns,
        pagination: {},
        loading: false,
        queryParam: {},
        advanced: true,
        para: {page: 1},
        bordered: true
      }
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.para = {page: 1}
        const pagination = {...this.pagination};
        pagination.current = 1
        this.pagination = pagination

        this.init()
      },
      init() {

        if (getUrlKey('medicine_name')) {
          this.para.drug_name = getUrlKey('medicine_name').split('=')[1]
          this.para.page = 1
        }

        const obj = this
        const pagination = {...this.pagination};

        this.loading = true
        getDrugBidList(obj.para).then(function (data) {
          console.log(data)
          pagination.total = 60;
          pagination.pageSize = 20;
          obj.pagination = pagination;

          console.log(pagination)

          obj.pushList(data.data)

          obj.loading = false
        })
      },
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        const obj = this

        this.loading = true
        this.para.page = pagination.current
        getDrugBidList(obj.para).then(function (data) {
          console.log(data)
          obj.pagination = pagination;
          console.log(pagination)

          obj.pushList(data.data)

          obj.loading = false
        })

      },
      startSearch() {

        const obj = this
        const pagination = {...this.pagination};
        pagination.current = 1

        console.log(pagination)

        this.para = {
          page: 1,
          drug_name: this.queryParam.drug_name,
          brandname: this.queryParam.brandname
        }

        this.loading = true
        getDrugBidList(obj.para).then(function (data) {
          console.log(data)
          obj.pagination = pagination;

          obj.pushList(data.data)

          obj.loading = false
        })
      },
      pushList(records) {
        this.data = []
        for (let i = 0; i < records.length; i++) {
          this.data.push({
            key: i,
            drug_name: records[i].drug_name,
            product_name: records[i].product_name,
            form: records[i].form,
            specification: records[i].specification,
            scale: records[i].scale,
            unit: records[i].unit,
            bid_price: records[i].bid_price,
            quality_level: records[i].quality_level,
            producer: records[i].producer,
            bidder: records[i].bidder,
            bid_province: records[i].bid_province,
            release_date: records[i].release_date,
            description: records[i].description,
            source_file: records[i].source_file,
            url: records[i].url
          })
        }
      },
      accuracyChange() {
        console.log(this.accuracy)
      }
    }
  }
</script>

<style scoped>

</style>