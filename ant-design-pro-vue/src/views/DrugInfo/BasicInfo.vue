<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="药品名称">
              <a-input v-model="queryParam.medicine_name" placeholder="请输入药品名称"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="通用名称">
              <a-input v-model="queryParam.common_name" placeholder="请输入通用名称"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="批准文号">
              <a-input v-model="queryParam.number_approval" placeholder="请输入批准文号"/>
            </a-form-item>
          </a-col>


          <a-col :md="8" :sm="24">
            <a-form-item label="适应症/功能">
              <a-input v-model="queryParam.indication" placeholder="请输入适应症/功能"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="成分">
              <a-input v-model="queryParam.element" placeholder="请输入成分"/>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="生产企业">
              <a-input v-model="queryParam.company_name" placeholder="请输入生产企业"/>
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">

              <a-radio-group v-model="accuracy" defaultValue="a" buttonStyle="solid" @change="accuracyChange">
                <a-radio-button value="false">模糊</a-radio-button>
                <a-radio-button value="true">精确</a-radio-button>
              </a-radio-group>
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
      :scroll="{ x: 5520, y: 3600 }"
      :pagination="pagination"
      :loading="loading"
      :bordered="bordered"
      @change="handleTableChange">
      <a slot="action" slot-scope="text" href="javascript:;">action</a>
    </a-table>
  </a-card>
</template>

<script>


  import {getDrugDataList} from '@/api/manage'

  const columns = [
    {title: '药品名称', dataIndex: 'medicine_name', key: 'name', fixed: 'left', width: 120},
    {title: '通用名称', dataIndex: 'common_name', key: 'age', width: 150},
    {title: '英文名称', dataIndex: 'english_name', key: '1', width: 150},
    {title: '成分', dataIndex: 'element', key: '2', width: 200},
    {title: '适应症/功能', dataIndex: 'indication', key: '3', width: 500},
    {title: '用法用量', dataIndex: 'dosage', key: '4', width: 1000},
    {title: '不良反应', dataIndex: 'side_effect', key: '5', width: 1100},
    {title: '禁忌', dataIndex: 'contraindication', key: '6', width: 400},
    {title: '注意事项', dataIndex: 'precaution', key: '7', width: 1000},
    {title: '贮藏', dataIndex: 'storage', key: '8', width: 150},
    {title: '有效期', dataIndex: 'period_valid', key: '9', width: 150},
    {title: '批准文号', dataIndex: 'number_approval', key: '10', width: 150},
    {title: '生产企业', dataIndex: 'company_name', key: '11', width: 150},
    {title: '生产地址', dataIndex: 'production_address', key: '12', width: 150},
    {title: '企业电话', dataIndex: 'business_phone', key: '13', width: 150}
  ];

  function getUrlKey(name) {
    return decodeURIComponent(
      (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[0].replace(/\+/g, '%20')) || ""
  }

  export default {
    mounted() {
      this.init()
    },
    name: "BasicInfo",
    data() {
      return {
        data: [],
        columns,
        pagination: {},
        loading: false,
        queryParam: {},
        advanced: true,
        accuracy: "false",
        para: {size: 10, page: 1},
        bordered: true
      }
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.para = {size: 10, page: 1}
        const pagination = {...this.pagination};
        pagination.current = 1
        this.pagination = pagination
        this.init()
      },
      init() {

        console.log(getUrlKey("medicine_name"))

        if (getUrlKey("medicine_name")) {
          this.para.medicine_name_ = getUrlKey("medicine_name").split('=')[1]
        }

        const obj = this
        const pagination = {...this.pagination};
        pagination.pageSize = 10

        console.log("Ready to fetch data")

        this.loading = true
        getDrugDataList(obj.para).then(function (data) {
          console.log(data)
          pagination.total = data.all_count;
          obj.pagination = pagination;

          console.log(pagination)

          obj.pushList(data.results)

          obj.loading = false
        })
      },
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        const obj = this

        this.loading = true
        this.para.page = pagination.current
        getDrugDataList(obj.para).then(function (data) {
          //console.log(data)
          obj.pagination = pagination;

          obj.pushList(data.results)

          obj.loading = false
        })

      },
      startSearch() {

        const obj = this
        const pagination = {...this.pagination};
        pagination.current = 1

        console.log(pagination)

        this.para = {
          size: pagination.pageSize,
          page: 1,
          medicine_name_: this.queryParam.medicine_name,
          common_name_: this.queryParam.common_name,
          element_: this.queryParam.element,
          indication_: this.queryParam.indication,
          number_approval_: this.queryParam.number_approval,
          company_name_: this.queryParam.company_name,
          accuracy: this.accuracy
        }

        this.loading = true
        getDrugDataList(obj.para).then(function (data) {
          console.log(data)
          pagination.total = data.all_count;
          obj.pagination = pagination;

          obj.pushList(data.results)

          obj.loading = false
        })
      },
      pushList(records) {
        this.data = []
        for (let i = 0; i < records.length; i++) {
          this.data.push({
            key: i,
            medicine_name: records[i].medicine_name,
            common_name: records[i].common_name,
            english_name: records[i].english_name,
            element: this.$jquery.trim(this.HTMLDecode(records[i].element)),
            indication: this.HTMLDecode(records[i].indication),
            dosage: this.HTMLDecode(records[i].dosage),
            side_effect: this.HTMLDecode(records[i].side_effect),
            contraindication: this.HTMLDecode(records[i].contraindication),
            precaution: this.HTMLDecode(records[i].precaution),
            storage: this.HTMLDecode(records[i].storage),
            period_valid: records[i].period_valid,
            number_approval: records[i].number_approval,
            company_name: records[i].company_name,
            production_address: records[i].production_address,
            business_phone: records[i].business_phone
          })


        }
      },
      accuracyChange() {
        console.log(this.accuracy)
      },
      HTMLDecode(text) {
        let temp = document.createElement("div")
        temp.innerHTML = text
        let output = temp.innerText || temp.textContent;
        temp = null;
        return output;
      }
    }
  }
</script>

<style scoped>

</style>