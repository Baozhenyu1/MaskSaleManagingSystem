<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="10">

        <a-form layout="vertical" @submit="handleSubmit" :form="form">
          <a-form-item
            label="用户名"
          >
            <a-input v-model="name" disabled > <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" /> </a-input>
          </a-form-item>
          <a-form-item
            label="旧密码"
            :required="true"
          >
            <a-input
              placeholder="输入旧密码作为身份验证"
              type="password"
              v-decorator="[
              'oldPassword',
              {rules: [{ required: true, message: '请输入旧密码' }]}]"
            >      <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /></a-input>
          </a-form-item>
          <a-form-item
            label="新密码"
            :required="true"
          >
            <a-input
              placeholder="输入新密码"
              type="password"
              v-decorator="[
              'newPassword1',
              {rules: [{ required: true, message: '请输入新密码' }]}]"
            ><a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /></a-input>
          </a-form-item>
          <a-form-item
            label="确认密码"
            :required="true"
          >
            <a-input
              placeholder="再次输入密码"
              type="password"
              v-decorator="[
              'newPassword2',
              {rules: [{ required: true, message: '请输入确认密码' }]}]"
            ><a-icon slot="prefix" type="safety" style="color:rgba(0,0,0,.25)" /></a-input>
          </a-form-item>
          <a-form-item>
            <a-button htmlType="submit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="3">
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" >
          <img :src="img"/>
        </div>
      </a-col>

    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { USERNAME } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'
import { editPassword } from '@/api/manage'


export default {
  components: {
  },
  data () {
    return {
      name: '',
      form: this.$form.createForm(this),
      img: '/avatar2.jpg'
    }
  },
  created () {
    this.loadUsername();
  },
  methods: {
    loadUsername(){
      this.name = Vue.ls.get(USERNAME);
    },
    handleSubmit (e) {
      e.preventDefault()
      let that = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
          if(values.newPassword1 !== values.newPassword2){
            that.editError('输入的两次密码不一致');
          } else if(values.newPassword1 .length < 6 || values.newPassword1.length > 10 || !/^[0-9a-zA-Z]*$/g.test(values.newPassword1)){
            that.editError('新密码必须为数字或字母，长度6位到10位');
          } else if(values.newPassword1 === values.oldPassword){
            that.editError('新密码与旧密码重复');
          } else {
            that.submitValues(values);
          }

        }
      })
    },
    submitValues(values){
      const para = {'username':this.name, 'old_password':values.oldPassword, 'new_password':values.newPassword1};
      console.log(para);
      let that = this;
      editPassword(para)
        .then(function(data) {
          if('status' in data){
            if(parseInt(data['status']) === 1){
              that.editSuccess('修改成功');
            } else {
              that.editSuccess('旧密码错误，身份核验失败');
            }
          } else {
            that.editError('未知原因');
          }
        })
        .catch(function() {
          that.editError('网络错误');
        })
    },
    info(message){
      setTimeout(function () {
        notification.error({
          message: '提示',
          description: message
        })
      }, 300)
    },
    editError(errMessage){
      setTimeout(function () {
        notification.error({
          message: '提交失败',
          description: errMessage
        })
      }, 300)
    },
    editSuccess(message){
      setTimeout(function () {
        notification.success({
          message: '提交成功',
          description: message
        })
      }, 300)
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
