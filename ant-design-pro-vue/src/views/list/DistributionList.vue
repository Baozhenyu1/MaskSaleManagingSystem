<template>
  <page-view title="药店分发表" logo="">
    <a-card :bordered="false">

      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">

            <a-col :md="8" :sm="24">
              <a-form-item label="公司">
                <a-select
                  showSearch
                  placeholder="请选择公司"
                  optionFilterProp="children"
                  v-model="queryParam.company"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="item in companyList" :value="item">{{item}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="药店名称">
                <a-input v-model="queryParam.keyword" placeholder="请输入药店名称"/>
              </a-form-item>
            </a-col>

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

            <a-col :md="authority ? 20 : 4" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-left: 8px" type="primary" @click="handleSearch">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons"
                    :style="{ float: 'right', overflow: 'hidden' }">
                <a-button style="margin-bottom: 6px" type="primary" @click="download">下载表格</a-button>
              </span>
            </a-col>
            <br/>
            <span style="margin-left: 25px">
              {{'配额总数：' + quotaTotal}}
            </span>
            <span style="margin-left: 25px">
              {{'总门店数：' + storeCount}}
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
              <span>{{data}}</span>
            </div>
          </template>
        </template>

      </a-table>
    </a-card>
  </page-view>

</template>

<script>
  import {getQuotaList} from '@/api/manage'
  import {PageView} from '@/layouts'
  import user from '@/store/modules/user'

  function table2excel(jsonData, substr) {
    //要导出的json数据
    let str = 'ID,市辖区,公司,药房名称,药房地址,联系人,联系电话,药店配额\n';
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
    link.download = "药店分发表(" + substr + ").csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  export default {
    name: "DistributionList",
    components: {
      PageView
    },
    data() {
      return {
        queryParam: {},
        companyList: [
          '国大', '华氏', '益丰', '好药师', '养和堂',
          '华泰', '云湖', '得一', '老百姓', '余天成',
          '童涵春', '恒德', '人和堂', '健一', '雷北',
          '嘉定医药', '雷西', '上海药房', '海王', '宝岛',
          '太安堂', '万芸', '亲民', '康君阁', '好邻居',
          '龙威', '金匮堂', '诚康', '百合缘', '顺源', '富民',
          '鸿翔', '南汇开心人', '叮当', '浦东开心人', '荣庆堂',
          '裕德堂', '龙竹堂', '浦东同仁堂', '平民', '宏顺堂',
          '芝林', '华中便民', '康乾', '百秀', '九和堂', '普安法玛',
          '国慈', '平安', '同谊', '德大堂', '别样红', '惠生堂',
          '国仁', '蔡同德', '黄浦同仁堂'],
        columns: [],
        colTitle: ['ID', '市辖区' , '公司' , '药房名称', '药房地址', '联系人', '联系电话', '药店配额'],
        colIndex: ['id', 'district', 'company', 'name', 'address', 'con_per', 'tel', 'quota'],
        colWidth: ['40px', '80px', '80px', '230px', '230px', '70px', '90px', '100px'],
        data: [],
        loading: false,
        bordered: true,
        pagination: {pageSize: 20},
        quotaTotal: 0,
        storeCount: 0,
        districtList: ["全上海市", "黄浦区","徐汇区","长宁区","静安区","普陀区",
                        "虹口区","杨浦区","闵行区","宝山区","嘉定区","浦东新区","金山区","松江区","青浦区","奉贤区","崇明区"],
        authority: 1

      }
    },
    created() {
      this.authority = user.state.name == "shanghai"
      this.loadColumns()
      this.init()
    },
    methods: {
      reset() {
        this.queryParam = {}
        this.init()
      },
      pushList(data) {
        this.data = []
        for (let i in data) {
          this.data.push({
            id: data[i]["phar_id"],
            district: data[i]["district"],
            company: data[i]["company"],
            name: data[i]["phar_name"],
            address: data[i]["phar_addr"],
            con_per: data[i]["phar_con_per"],
            tel: data[i]["phar_con_tel"],
            quota: data[i]["phar_quota"],
          })
        }
      },
      loadColumns() {
        for (let i = 0; i < this.colTitle.length; i++) {
          let col = {
            index: i,
            slotType: 'text',
            dataIndex: this.colIndex[i],
            title: this.colTitle[i],
            width: this.colWidth[i],
            tdDivStyle: {
              width: this.colWidth[i]
            },
            scopedSlots: {customRender: "row-text-view" + i},
            className: 'table-header'
          }
          this.columns.push(col)
        }
      },
      init() {
        let obj = this
        this.loading = true
        getQuotaList().then(function (data) {
          console.log("Quota", data)
          obj.quotaTotal = data["total_quota"]
          obj.storeCount = data["store_count"]
          data = data["data"]
          obj.pushList(data)
          obj.loading = false
        })
      },
      download() {
        //console.log("download here")
        //console.log(this.data)
        let district = this.queryParam.district ? this.queryParam.district : (this.authority ? '全上海市' : user.state.name)
        let company = this.queryParam.company ? this.queryParam.company : '所有公司'
        let keyword = this.queryParam.keyword ? this.queryParam.keyword : ''
        let str = district + '_' + company + (keyword == '' ? '' : ('_' + keyword))

        table2excel(this.data, str)
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      handleSearch() {
        let obj = this
        let para = {
          company: obj.queryParam.company,
          keyword: obj.queryParam.keyword,
          district: obj.queryParam.district ? (obj.queryParam.district == '全上海市' ? '' : obj.queryParam.district) : ''
        }
        getQuotaList(para).then(function (data) {
          //console.log("Quota", data)
          obj.quotaTotal = data["total_quota"]
          obj.storeCount = data["store_count"]
          data = data["data"]
          obj.pushList(data)
          obj.loading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>