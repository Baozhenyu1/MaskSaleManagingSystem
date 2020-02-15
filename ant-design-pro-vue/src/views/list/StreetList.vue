<template>
  <page-view title="街道填报信息表" logo="">
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
                  <a-select-option v-for="item in districtList" :value="item">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>


            <a-col :md="8" :sm="24">
              <a-form-item label="是否填报">
                <a-select v-model="queryParam.reported" placeholder="请选择" default-value="0">
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="关键词">
                <a-input v-model="queryParam.keyword" placeholder="请输入关键词"/>
              </a-form-item>
            </a-col>


            <a-col :md="authority ? 20 : 8" :sm="24">
            <span class="table-page-search-submitButtons"
                  :style="authority ? { float: 'right', overflow: 'hidden' } : { float: 'left', overflow: 'hidden' }">
              <a-button type="primary" @click="handleSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
            </a-col>

            <a-col :md="authority ? 4 : 8" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
              </span>
            </a-col>

          </a-row>
        </a-form>
      </div>


      <a-table
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <template>
              <div>
                <a :href="record.url" target="_blank">{{record.name}}</a>
              </div>
          </template>
        </span>
      </a-table>
    </a-card>
  </page-view>

</template>

<script>
  import {PageView} from '@/layouts'
  import {getStreetList} from '@/api/manage'
  import user from '@/store/modules/user'
  import moment from 'moment'


  function table2excel(jsonData, tips) {
    //要导出的json数据
    let str = '市辖区,街道编号,街道名,今日预约登记户数,累计预约登记户数\n';
    for (let i = 0; i < jsonData.length; i++) {
      for (let item in jsonData[i]) {
        let new_str = String(jsonData[i][item]).replace(/,/g, '、')
        str += `${new_str},`;
      }
      str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "街道填报信息表(" + tips+ ").csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  export default {
    name: "StreetList",
    components: {
      PageView
    },
    data() {
      return {
        columns: [
          {key: 1, title: '市辖区', dataIndex: 'district', width: '100px', className: 'table-header'},
          {key: 2, title: '街道编号', dataIndex: 'id', width: '80px', className: 'table-header'},
          {
            key: 3,
            title: '街道名',
            dataIndex: 'name',
            width: '300px',
            className: 'table-header',
            scopedSlots: {customRender: 'action'}
          },
          {key: 4, title: '今日预约登记户数', dataIndex: 'appointed', width: '100px', className: 'table-header'},
          {key: 5, title: '累计预约登记户数', dataIndex: 'appointedTotal', width: '100px', className: 'table-header'}],
        data: [],
        pagination: {pageNo: 1, pageSize: 10},
        loading: false,
        bordered: true,
        authority: 0,
        queryParam: {},
        districtList: ["全上海市", "黄浦区","徐汇区","长宁区","静安区","普陀区","虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"]
      }
    },
    created() {
      this.authority = user.state.name == "shanghai"
      this.init()
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.pagination = {
          current: 1,
          pageSize: 10
        }
        this.init()
      },
      download() {
        let para = {
          district: this.queryParam.district ? (this.queryParam.district == "全上海市" ? "" : this.queryParam.district) : '',
          reported: this.queryParam.reported || 1,
          keyword: this.queryParam.keyword || ''
        }
        let obj = this
        getStreetList(para).then(function(data) {
          data = data["data"]
          let downloadList = []
          for (let i in data) {
            downloadList.push({
              district: data[i]["district"],
              id: data[i]["street_id"],
              name: data[i]["street_name"],
              appointed: data[i]["today_r"],
              appointedTotal: data[i]["total_r"]
            })
          }
          let districtString = para.district == '' ? (obj.authority ? '全上海市' : user.state.name) : para.district
          let reportedString = para.reported == 1 ? '已填报' : '未填报'

          let tips = districtString + '_' + reportedString + (para.keyword == '' ? '' : ('_' + para.keyword))

          table2excel(downloadList, tips)
        })
      },
      handleSearch() {
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: 10})
        this.loading = true
        const pagination = {...this.pagination};

        getStreetList(para).then(function (data) {
          console.log("search:",data)
          //pagination.total = data.all_count
          obj.pagination = pagination;
          pagination.total = data["total"];
          pagination.current = 1;
          obj.pushList(data["data"])
          obj.loading = false
        })
      },
      handleTableChange(pagination, filters, sorter) {
        console.log(pagination)
        const obj = this

        const para = this.getPara({pageNo: pagination.current, pageSize: pagination.pageSize})
        const raw_pagination = {...this.pagination};
        raw_pagination.current = pagination.current
        this.pagination = raw_pagination

        this.loading = true
        getStreetList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"])
          obj.loading = false
        })

      },
      pushList(data) {
        this.data = []
        for (let i in data) {
          this.data.push({
            district: data[i]["district"],
            id: data[i]["street_id"],
            name: data[i]["street_name"],
            appointed: data[i]["today_r"],
            appointedTotal: data[i]["total_r"],
            url: '/profile/streetInfo?id=' + data[i]["street_id"]
          })
        }
      },
      init() {
        const obj = this
        const para = this.getPara({pageNo: 1, pageSize: 10})
        const pagination = {...this.pagination};

        this.loading = true
        getStreetList(para).then(function (data) {
          obj.pagination = pagination;
          pagination.total = data["total"];
          obj.pushList(data["data"])
          obj.loading = false
        })
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getPara(parameter) {
        let para = {...parameter}
        para.district = this.queryParam.district ? (this.queryParam.district == "全上海市" ? "" : this.queryParam.district) : '';
        para.reported = this.queryParam.reported || 1;
        para.keyword = this.queryParam.keyword || ''

        console.log(para)
        return para
      }
    }
  }
</script>

<style scoped>

</style>