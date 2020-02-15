<template>
  <a-modal :width="640" :visible="visible" title="关注添加" @ok="handleSubmit" @cancel="visible = false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="关注名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input ref="title_input" v-decorator="['taskName', {rules:[{required: true, message: '请输入关注名称'}]}]" />
      </a-form-item>

      <a-form-item
        label="关注药品"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"

      >
        <a-select placeholder="默认关注所有药品" mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="drugSelect" @change="handleChange">
          <a-select-option v-for="drug in drugList" :key="drug">{{drug}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="关注省份"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"

      >
        <a-select placeholder="默认关注所有省份" mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="provSelect" @change="handleChange">
          <a-select-option v-for="prov in provList" :key="prov">{{prov}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="关注公司"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"

      >
        <a-select placeholder="默认关注所有公司" mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="compSelect" @change="handleChange">

        </a-select>
      </a-form-item>

      <a-form-item
        label="关键词"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="keywordSelect" @change="handleChange">

        </a-select>
      </a-form-item>


    </a-form>
  </a-modal>
</template>

<script>



export default {
  name: 'TaskForm',
  data () {
    return {
      time: '',
      key: '',
      isEdit: false,
      description: '',
      title: '',
      compSelect: [],
      keywordSelect: [],
      provSelect: [],
      provList: [],
      drugSelect: [],
      drugList: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },

      visible: false,
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.drugList = ["阿糖胞苷","艾司洛尔","奥司他韦","苯海索","别嘌醇","丙戊酸钠","布比卡因","布地奈德","垂体后叶","促皮质素","达肝素钠","低分子肝素钙","低分子肝素钠","碘化油","碘解磷定","冻干人凝血因子","对氨基水杨酸钠","多巴胺","二巯丙磺钠","放线菌素D","酚妥拉明","奋乃静","氟马西尼","氟尿嘧啶","复方托吡卡胺","肝素钙","肝素钠","谷氨酸钠","环磷酰胺","黄体酮","甲氨蝶呤","甲硫酸新斯的明","甲羟孕酮","甲巯咪唑","精氨酸","抗蛇毒血清","拉贝洛尔","拉米夫定","两性霉素B","硫酸钡","硫酸镁","柳氮磺吡啶","氯胺酮","氯化琥珀胆碱","氯解磷定","氯米芬","马破伤风免疫球蛋白","麦角新碱","那曲肝素钙","尼卡地平","尿激酶","哌甲酯","破伤风抗毒素","破伤风人免疫球蛋白","葡萄糖酸锑钠","羟基脲","青霉胺","氢溴酸东莨菪碱","秋水仙碱","巯嘌呤","曲妥珠单抗","去甲肾上腺素","人凝血酶原复合物","人纤维蛋白原","人血白蛋白","十一酸睾酮","丝裂霉素","碳酸锂","乌拉地尔","戊乙奎醚","硝普钠","溴吡斯的明","亚甲蓝","眼镜蛇毒血清","依诺肝素钠","依沙吖啶","乙酰胺","乙酰半胱氨酸","乙酰唑胺","荧光素钠","鱼精蛋白","长春新碱","治疗用A型肉毒毒素","重酒石酸间羟胺","左甲状腺素钠","博来霉素","氟哌啶醇","高三尖杉酯碱","硫代硫酸钠","炉甘石","平阳霉素","鱼石脂","地高辛口服溶液","苯巴比妥","地西泮","多巴酚丁胺","洛贝林","尼可刹米","去乙酰毛花苷","绒促性素","缩宫素","维生素K1","异丙肾上腺素","维拉帕米","葡萄糖酸钙","阿托品","呋塞米","硝酸甘油","氯法齐明","复方磺胺甲噁唑","利多卡因","维生素B6","卡马西平","山莨菪碱","利巴韦林","碳酸氢钠","维生素B1","维生素C","氨茶碱","甲氧氯普胺","异丙嗪","甲硝唑氯化钠","利福喷丁","维生素B12","右旋糖酐40葡萄糖","氨基己酸","异烟肼","苯海拉明","西咪替丁","酚磺乙胺","地塞米松","麻黄碱","糜蛋白酶","普萘洛尔","枸橼酸他莫昔芬","氟哌利多","去氧肾上腺素","肌苷","盐酸阿柔比星","醋酸曲安奈德","氮芥"]
    this.provList = ["北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "上海", "江苏", "浙江", "江西", "安徽", "福建", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "香港", "澳门", "台湾"]
  },
  methods: {
    add () {
      this.provSelect = []
      this.drugSelect = []
      this.compSelect = []
      this.keywordSelect = []

      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue({ taskName: "" })
      })
      this.visible = true
      this.isEdit = false
    },
    edit (record) {
      console.log("start to edit")
      this.isEdit = true
      console.log(record)

      const { form: { setFieldsValue } } = this
      this.visible = true
      this.$nextTick(() => {
        setFieldsValue({ taskName: record.title })
      })
      this.provSelect = record.provinces
      this.drugSelect = record.drugs
      this.compSelect = record.company
      this.keywordSelect = record.keyword
      this.key = record.key
    },
    handleSubmit () {
      let data = {}

      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          //console.log('values', values)

          data.key = this.key
          data.title = values.taskName
          data.provSelect = this.provSelect
          data.drugSelect = this.drugSelect
          data.compSelect = this.compSelect
          data.keywordSelect = this.keywordSelect
          data.isEdit = this.isEdit
          this.$emit('getMessage', data)

          this.visible = false
        }
      })
    },
    handleChange(value) {
      //console.log('selected', value);
      //console.log(this.drugList);
      console.log(this.description)
    }
  }
}
</script>
