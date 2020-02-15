<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="药品名称">
              <a-select
                showSearch
                placeholder="输入或选择药品名称"
                optionFilterProp="children"
                style="width: 100%"
                :filterOption="filterOption"
                v-model="drug_name"
              >
                <a-select-option v-for="item in drugList" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
            <a-col :md="24" :sm="24">
              <a-button style="margin-left: 8px; margin-bottom: 8px" type="primary" @click="startSearch">查询</a-button>
              <a-button style="margin-left: 8px; margin-bottom: 8px"
                        @click="reset">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>


    <a-table
      :columns="columns"
      :dataSource="data"
      :scroll="{ x: 1500, y: 3600 }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange">
      <a slot="action" slot-scope="text" href="javascript:;">action</a>
    </a-table>
  </a-card>
</template>

<script>

  import {getAlternative} from '@/api/manage'

  const columns = [
    {title: '药品名称', dataIndex: 'drug_name', key: 'name', fixed: 'left', width: 150},
    {title: '科室', dataIndex: 'department', key: 'age', width: 150},
    {title: '规格', dataIndex: 'description', key: '1', width: 300},
    {title: '替代药品1', dataIndex: 'alternative_drug_1', key: '2', width: 150},
    {title: '替代等级1', dataIndex: 'alternative_level_1', key: '3', width: 150},
    {title: '替代药品2', dataIndex: 'alternative_drug_2', key: '4', width: 150},
    {title: '替代等级2', dataIndex: 'alternative_level_2', key: '5', width: 150},
    {title: '替代药品3', dataIndex: 'alternative_drug_3', key: '6', width: 150},
    {title: '替代等级3', dataIndex: 'alternative_level_3', key: '7', width: 150}
  ];

  export default {
    name: "AlternativeInfo",
    data() {
      return {
        data: [],
        drug_name: '',
        pagination: {},
        loading: false,
        columns,
        drugList: []

      }
    },
    created() {
      let obj = this;
      document.onkeydown = function(e) {
        let key = window.event.keyCode;
        if (key == 13) {
          obj.enterSearchMember();
        }
      }
    },
    mounted() {
      this.drugList = ["尼可刹米", "曲妥珠单抗", "酚妥拉明", "左甲状腺素钠", "甲硝唑", "治疗用A型肉毒毒素", "阿糖胞苷", "巯嘌呤", "阿托品", "低分子肝素钙", "苯巴比妥", "乙酰唑胺", "奋乃静", "低分子肝素钠", "乙酰胺", "马破伤风免疫球蛋白", "乌拉地尔", "甲硝唑氯化钠", "那曲肝素钙", "对氨基水杨酸钠", "普萘洛尔", "氯胺酮", "炉甘石", "奥司他韦", "维生素C", "尿激酶", "甲氨蝶呤", "鱼精蛋白", "硝酸甘油", "二巯丙磺钠", "硫酸镁", "丙戊酸钠", "苯海索", "丝裂霉素", "别嘌醇", "黄体酮", "氟马西尼", "葡萄糖酸钙", "拉贝洛尔", "硫代硫酸钠", "糜蛋白酶", "山莨菪碱", "利福喷丁", "垂体后叶", "维生素B1", "平阳霉素", "柳氮磺吡啶", "氮芥", "博来霉素", "拉米夫定", "氯化琥珀胆碱", "甲巯咪唑", "荧光素钠", "布比卡因", "复方托吡卡胺", "长春新碱", "地西泮", "氯解磷定", "秋水仙碱", "地塞米松", "地高辛口服溶液", "高三尖杉酯碱", "缩宫素", "复方磺胺甲噁唑", "氟哌啶醇", "硫酸钡", "维生素B6", "氨基己酸", "重酒石酸间羟胺", "洛贝林", "肝素钠", "戊乙奎醚", "尼卡地平", "异丙肾上腺素", "放线菌素D", "碘解磷定", "青霉胺", "醋酸曲安奈德", "溴吡斯的明", "维拉帕米", "促皮质素", "亚甲蓝", "硝普钠", "去氧肾上腺素", "羟基脲", "破伤风抗毒素", "布地奈德", "达肝素钠", "去乙酰毛花苷", "维生素B12", "呋塞米", "十一酸睾酮", "去甲肾上腺素", "人凝血酶原复合物", "氨茶碱", "右旋糖酐40葡萄糖", "碳酸氢钠", "绒促性素", "人纤维蛋白原", "异烟肼", "两性霉素B", "肝素钙", "抗眼镜蛇毒血清", "西咪替丁", "哌甲酯", "氯法齐明", "酚磺乙胺", "抗蛇毒血清", "肌苷", "维生素K1", "人血白蛋白", "利多卡因", "甲氧氯普胺", "甲羟孕酮", "依诺肝素钠", "利巴韦林"]
      this.init()
    },
    methods: {
      init() {
        const obj = this
        this.loading = true
        this.data = []
        getAlternative().then(function (data) {
          //console.log(data)
          obj.pushList(data)
          obj.loading = false
        })
      },
      startSearch() {

        console.log("search")

        const obj = this
        this.loading = true
        this.data = []
        getAlternative({drug_name: obj.drug_name}).then(function (data) {
          console.log(data)
          obj.pushList(data)
          obj.loading = false
        })
      },
      handleTableChange(pagination, filters, sorter) {

      },
      reset() {
        this.drug_name = ''
        this.init()
      },
      pushList(data) {
        for (let i = 0; i < data.length; i++) {
          this.data.push({
            key: i,
            drug_name: data[i].drug_name,
            department: data[i].department,
            description: data[i].shortage_spec,
            alternative_drug_1: data[i].alternative_drug_1,
            alternative_drug_2: data[i].alternative_drug_2,
            alternative_drug_3: data[i].alternative_drug_3,
            alternative_level_1: data[i].alternative_level_1,
            alternative_level_2: data[i].alternative_level_2,
            alternative_level_3: data[i].alternative_level_3
          })
        }
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  }
</script>

<style scoped>

</style>