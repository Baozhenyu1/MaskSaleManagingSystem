<template>
  <page-view title="订阅项" logo="">
    <div>
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="关注列表">


        <a-table ref="table" :columns="columns" :dataSource="data">
          <a slot="name" slot-scope="text, record" @click="handleSearch(record)">
            <a-icon type="tag"/>
            {{" " + text}}</a>
          <span slot="customTitle"><a-icon type="ordered-list"/> 关注项名称</span>

          <span slot="company" slot-scope="company">
          <a-tag v-for="comp in company" color="red" :key="comp">{{comp}}</a-tag>
        </span>

          <span slot="provinces" slot-scope="provinces">
          <a-tag v-for="prov in provinces" color="blue" :key="prov">{{prov}}</a-tag>
        </span>

          <span slot="drugs" slot-scope="drugs">
          <a-tag v-for="drug in drugs" color="green" :key="drug">{{drug}}</a-tag>
        </span>

          <span slot="keyword" slot-scope="keyword">
          <a-tag v-for="kw in keyword" color="blue" :key="kw">{{kw}}</a-tag>
        </span>

          <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical"/>
            <a-popconfirm title="确认删除本条关注？" @confirm="confirm(record)" @cancel="cancel" okText="是" cancelText="否">
              <a>删除</a>
            </a-popconfirm>

          </template>
        </span>

          <template slot="footer" slot-scope="currentPageData">
            <div class="operate">
              <a-button type="dashed" style="width: 100%" icon="plus" @click="$refs.taskForm.add()">添加</a-button>
            </div>
          </template>

        </a-table>

        <task-form ref="taskForm" @getMessage="(value)=>{userData = value;}"/>
      </a-card>
    </div>
  </page-view>
</template>

<script>
  import moment from 'moment'
  import HeadInfo from '@/components/tools/HeadInfo'
  import TaskForm from './modules/TaskForm'
  import {
    getSubscribeList,
    sendSubscribeAdd,
    sendSubscribeDelete,
    sendSubscribeUpdate
  } from '@/api/manage'
  import {PageView} from '@/layouts'

  export default {
    name: "SubscribeList",
    components: {
      HeadInfo,
      TaskForm,
      PageView
    },
    mounted() {
      this.init()
    },
    data() {
      return {
        userData: {},
        data: [],
        columns: [],
        keyIndex: 0,
        drugList: []
      }
    },
    watch: {
      "userData": function () {
        console.log(this.userData)
        let new_data = {
          title: this.userData.title,
          company: this.userData.compSelect,
          provinces: this.userData.provSelect,
          drugs: this.userData.drugSelect,
          keyword: this.userData.keywordSelect,
          time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }


        if (this.userData.isEdit == false) {
          this.keyIndex += 1
          new_data["key"] = this.keyIndex.toString()
          this.data.splice(0, 0, new_data)

          let send_data = {
            company: new_data.company.join('/'),
            provinces: new_data.provinces.join('/'),
            drugs: new_data.drugs.join('/'),
            keyword: new_data.keyword.join('/'),
            key: new_data.key,
            title: new_data.title,
            time: new_data.time
          }

          console.log(send_data)

          sendSubscribeAdd(send_data)

        } else {
          for (let i in this.data) {
            if (this.data[i].key == this.userData.key) {
              new_data["key"] = this.userData.key
              this.data.splice(i, 1, new_data)
              console.log(this.data[i])
              break
            }
          }

          let send_data = {
            company: new_data.company.join('/'),
            provinces: new_data.provinces.join('/'),
            drugs: new_data.drugs.join('/'),
            keyword: new_data.keyword.join('/'),
            key: new_data.key,
            title: new_data.title,
            time: new_data.time
          }

          console.log(send_data)

          sendSubscribeUpdate(send_data)
        }
      }
    },
    methods: {
      handleEdit(record) {
        console.log("edit", record)
        this.$refs.taskForm.edit(record)

      },
      confirm(record) {
        for (let i in this.data) {
          if (this.data[i].key == record.key) {
            sendSubscribeDelete(record.key)
            this.data.splice(i, 1)
            break
          }
        }
        this.$message.success('关注项成功删除')
      },
      cancel() {
      },
      init() {
        const obj = this
        console.log(this.data)

        this.keyIndex = 0
        this.drugList = ["全部", "阿糖胞苷", "艾司洛尔", "奥司他韦", "苯海索", "别嘌醇", "丙戊酸钠", "布比卡因", "布地奈德", "垂体后叶", "促皮质素", "达肝素钠", "低分子肝素钙", "低分子肝素钠", "碘化油", "碘解磷定", "冻干人凝血因子", "对氨基水杨酸钠", "多巴胺", "二巯丙磺钠", "放线菌素D", "酚妥拉明", "奋乃静", "氟马西尼", "氟尿嘧啶", "复方托吡卡胺", "肝素钙", "肝素钠", "谷氨酸钠", "环磷酰胺", "黄体酮", "甲氨蝶呤", "甲硫酸新斯的明", "甲羟孕酮", "甲巯咪唑", "精氨酸", "抗蛇毒血清", "拉贝洛尔", "拉米夫定", "两性霉素B", "硫酸钡", "硫酸镁", "柳氮磺吡啶", "氯胺酮", "氯化琥珀胆碱", "氯解磷定", "氯米芬", "马破伤风免疫球蛋白", "麦角新碱", "那曲肝素钙", "尼卡地平", "尿激酶", "哌甲酯", "破伤风抗毒素", "破伤风人免疫球蛋白", "葡萄糖酸锑钠", "羟基脲", "青霉胺", "氢溴酸东莨菪碱", "秋水仙碱", "巯嘌呤", "曲妥珠单抗", "去甲肾上腺素", "人凝血酶原复合物", "人纤维蛋白原", "人血白蛋白", "十一酸睾酮", "丝裂霉素", "碳酸锂", "乌拉地尔", "戊乙奎醚", "硝普钠", "溴吡斯的明", "亚甲蓝", "眼镜蛇毒血清", "依诺肝素钠", "依沙吖啶", "乙酰胺", "乙酰半胱氨酸", "乙酰唑胺", "荧光素钠", "鱼精蛋白", "长春新碱", "治疗用A型肉毒毒素", "重酒石酸间羟胺", "左甲状腺素钠", "博来霉素", "氟哌啶醇", "高三尖杉酯碱", "硫代硫酸钠", "炉甘石", "平阳霉素", "鱼石脂", "地高辛口服溶液", "苯巴比妥", "地西泮", "多巴酚丁胺", "洛贝林", "尼可刹米", "去乙酰毛花苷", "绒促性素", "缩宫素", "维生素K1", "异丙肾上腺素", "维拉帕米", "葡萄糖酸钙", "阿托品", "呋塞米", "硝酸甘油", "氯法齐明", "复方磺胺甲噁唑", "利多卡因", "维生素B6", "卡马西平", "山莨菪碱", "利巴韦林", "碳酸氢钠", "维生素B1", "维生素C", "氨茶碱", "甲氧氯普胺", "异丙嗪", "甲硝唑氯化钠", "利福喷丁", "维生素B12", "右旋糖酐40葡萄糖", "氨基己酸", "异烟肼", "苯海拉明", "西咪替丁", "酚磺乙胺", "地塞米松", "麻黄碱", "糜蛋白酶", "普萘洛尔", "枸橼酸他莫昔芬", "氟哌利多", "去氧肾上腺素", "肌苷", "盐酸阿柔比星", "醋酸曲安奈德", "氮芥"]
        getSubscribeList().then(function (data) {

          console.log(data)
          for (let i in data) {
            if (obj.keyIndex < data[i].id)
              obj.keyIndex = data[i].id

            obj.data.push({
              key: data[i].id.toString(),
              title: data[i].title,
              company: data[i].companies.split('/').filter(d => d),
              provinces: data[i].provinces.split('/').filter(d => d),
              drugs: data[i].drugs.split('/').filter(d => d),
              time: moment(data[i].modified_time).format("YYYY-MM-DD HH:mm:ss"),
              keyword: data[i].keywords.split('/').filter(d => d)
            })
          }
        })


        this.columns = [{
          dataIndex: 'title',
          slots: {title: 'customTitle'},
          scopedSlots: {customRender: 'name'},
          width: '150px'
        }, {
          title: '关注公司',
          dataIndex: 'company',
          scopedSlots: {customRender: 'company'},
          width: '170px'
        }, {
          title: '关注地区',
          dataIndex: 'provinces',
          scopedSlots: {customRender: 'provinces'},
          width: '150px'
        }, {
          title: '关注药品',
          dataIndex: 'drugs',
          scopedSlots: {customRender: 'drugs'},
          width: '150px'
        }, {
          title: '关键词',
          dataIndex: 'keyword',
          scopedSlots: {customRender: 'keyword'},
          width: '150px'
        }, {
          title: '修改时间',
          dataIndex: 'time',
          width: '150px'
        }, {
          title: '操作',
          scopedSlots: {customRender: 'action'},
          width: '110px'
        }];
      },
      handleSearch(record) {
        console.log(record)


        let prov = record.provinces.join('_') || ''
        if (prov != '')
          prov = '?province_name=' + prov

        let drug = record.drugs.join('_') || ''
        if (drug != '')
          drug = '&drug=' + drug

        let keyword = record.keyword.concat(record.company).join('_') || ''
        if (keyword != '')
          keyword = '&keyword=' + keyword


        let para = prov + drug + keyword
        if (para[0] == '&')
          para = '?' + para.substring(1, para.length)

        console.log(para)


        this.$router.push({
          path: '/table-list' + para
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .extra-item {
    display: inline-block;
    margin-right: 12px;

    a {
      margin-left: 12px;
    }
  }

  .ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
  }

  .list-content-item {
    width: 120px;
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;

    span {
      line-height: 20px;
    }

    p {
      margin-top: 4px;
      margin-bottom: 0;
      line-height: 22px;
    }
  }
</style>
