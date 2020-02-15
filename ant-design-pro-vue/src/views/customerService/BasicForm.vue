<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="标题"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'title',
            {rules: [{ required: true, message: '请输入标题' }]}
          ]"
          name="name"
          placeholder="反馈意见标题"/>
      </a-form-item>
      <a-form-item
        label="希望加入的药品"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select placeholder="输入希望加入的药品" mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="drugSelect"
                  @change="handleChange">
          <a-select-option v-for="drug in drugList" :key="drug">{{drug}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="希望加入的公司"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-select placeholder="输入希望加入的公司" mode="tags" style="width: 100%" :tokenSeparators="[',']" v-model="compSelect"
                  @change="handleChange">
          <a-select-option v-for="comp in compList" :key="comp">{{comp}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="反馈简述"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="请简略描述您的反馈意见"
          v-model="feedbackText"/>
      </a-form-item>

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>

  import { mapGetters } from 'vuex'
  import {sendFeedbackAdd} from '@/api/manage'
  import moment from 'moment'

  export default {
    name: 'BaseForm',
    data() {
      return {
        value: 1,
        drugSelect: [],
        drugList: [],
        feedbackText: '',
        compList: [],
        compSelect: [],

        // form
        form: this.$form.createForm(this)

      }
    },
    methods: {
      ...mapGetters(['nickname']),
      handleSubmit(e) {
        e.preventDefault();


        let timestamp = (new Date()).getTime()
        let timestamp_str = moment(timestamp).format("YYYY-MM-DD HH:mm:ss")
        timestamp = Math.floor(timestamp / 1000)

        console.log(timestamp_str)

        let md5 = this.$md5(this.nickname() + timestamp)
        console.log(md5)

        this.form.validateFields((errors, values) => {
          if (!errors) {
            let send_data = {
              title: values.title,
              drug: this.drugSelect.join('/'),
              company: this.compSelect.join('/'),
              description: this.feedbackText,
              event_pk: md5,
              timestamp: timestamp_str
            }
            sendFeedbackAdd(send_data)
            this.$router.push({
              path: '/result/success'
            })
          }
        })


      },
      handleChange() {
        console.log('selected', this.drugSelect);
        console.log('selected', this.compSelect);
      }
    }
  }
</script>
