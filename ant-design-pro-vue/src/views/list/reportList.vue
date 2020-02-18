<template>
  <page-view title="配送企业提货表" logo="">
    <a-card v-if="authority === 1" :bordered="false">
      <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
      <a-table
        size="small"
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: 430, y: 3600 }"
        :pagination="pagination"
        :loading="loading"
        :bordered="bordered">
      </a-table>
    </a-card>
    <a-card v-else>
      <span>没有查看权限</span>
    </a-card>
  </page-view>
</template>

<script>
  import {getDeliveryList} from '@/api/manage'
  import {PageView} from '@/layouts'

  function sortQuota(a,b){
    return b.quota - a.quota;
  }

  function table2excel(jsonData) {
    //要导出的json数据
    let temp = '{enterprise},{quota}\n';
    let str = '配送企业,配额,门店数量\n';
    for(let i = 0 ; i < jsonData.length ; i++ ){
      for(let item in jsonData[i]){
        str+=`${jsonData[i][item]},`;
      }
      str+='\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download =  "配送企业提货表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export default {
    name: 'reportList',
    components: {
      PageView
    },
    data() {
      return {
        columns: [
          { key: 1, title: '配送企业', dataIndex: 'enterprise', className: 'table-header', width: '100px', className: 'table-header' },
          { key: 2, title: '配额', dataIndex: 'quota', className: 'table-header', width: '80px', className: 'table-header' },
          { key: 3, title: '门店数量', dataIndex: 'count', className: 'table-header', width: '80px', className: 'table-header'}
        ],
        data: [],
        loading: false,
        bordered: true,
        pagination: {pageSize: 60, hideOnSinglePage: true},
        quotaTotal: 0,
        count: 0,
        authority: 0
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        let obj = this
        this.loading = true
        getDeliveryList().then(function(data) {
          if (data["authority"] === 0) {
            obj.authority = 0;
          } else {
            obj.authority = 1;
            obj.quotaTotal = data["total_quota"]
            obj.count = data["store_count"]
            data = data["data"]
            let key = Object.keys(data)
            for (let k in key) {
              obj.data.push({
                enterprise:  key[k],
                quota: data[key[k]].quota,
                count: data[key[k]].count
              })
            }
            obj.data.sort(sortQuota)
            obj.data.push({
              enterprise: '总计',
              quota: obj.quotaTotal,
              count: obj.count
            })
            //console.log("data", obj.data)
            obj.loading = false
          }


        })
      },
      download() {
        table2excel(this.data)
      }
    }
  }
</script>