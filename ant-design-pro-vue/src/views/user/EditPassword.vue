<template>
  <div class="main user-layout-edit">
    <h3><span>修改密码</span></h3>
    <a-form ref="formEdit" :form="form" id="formEdit">
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="['username', {rules: [{ required: true, message: '请输入用户名' }], validateTrigger: ['change', 'blur']}]"
        >
          <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="password"
          placeholder="请输入旧密码"
          v-decorator="['oldPassword', {rules: [{ required: true, message: '请输入旧密码' }], validateTrigger: ['change', 'blur']}]"
        >
          <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        :getPopupContainer="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }" >
            <div :class="['user-edit', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor " />
            <div style="margin-top: 10px;">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item>
          <a-input
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="false"
            placeholder="请输入新密码"
            v-decorator="['password', {rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ><a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /></a-input>
        </a-form-item>
      </a-popover>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认密码"
          v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ><a-icon slot="prefix" type="safety" style="color:rgba(0,0,0,.25)" /></a-input>
      </a-form-item>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }, { validator: this.handleCaptchaCheck }], validateTrigger: 'blur'}]">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            size="large"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
        </a-col>
      </a-row>

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="edit-button"
          :loading="editBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="editBtn">提交
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-item>

    </a-form>
  </div>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import { editPassword } from '@/api/manage'
  import notification from 'ant-design-vue/es/notification'
  const levelNames = {
    0: '低',
    1: '低',
    2: '中',
    3: '强'
  }
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
  }
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a'
  }
  export default {
    name: 'EditPassword',
    components: {
    },
    mixins: [mixinDevice],
    data () {
      return {
        form: this.$form.createForm(this),
        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        editBtn: false
      }
    },
    computed: {
      passwordLevelClass () {
        return levelClass[this.state.passwordLevel]
      },
      passwordLevelName () {
        return levelNames[this.state.passwordLevel]
      },
      passwordLevelColor () {
        return levelColor[this.state.passwordLevel]
      }
    },
    methods: {
      handlePasswordLevel (rule, value, callback) {
        let level = 0
        // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value)) {
          level++
        }
        // 判断字符串中有没有字母
        if (/[a-zA-Z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          if(value && value !== '' ){
            callback(new Error('密码强度不够'))
          } else {
            callback()
          }

        }
      },
      handlePasswordCheck (rule, value, callback) {
        const password = this.form.getFieldValue('password')
        if (value && password && value.trim() !== password.trim()) {
          callback(new Error('两次密码不一致'))
        }
        callback()
      },
      handleCaptchaCheck (rule, value, callback) {
        if (value && value !== '' + this.captcha) {
          callback(new Error('验证码错误'))
        }
        callback()
      },
      handlePasswordInputClick () {
        if (!this.isMobile()) {
          this.state.passwordLevelChecked = true
          return
        }
        this.state.passwordLevelChecked = false
      },
      handleSubmit () {
        let that = this;
        const { form: { validateFields }, state, $router } = this
        validateFields({ force: true }, (err, values) => {
          if (!err) {
            if(values.password === values.oldPassword){
              that.editError('新密码与旧密码重复');
            } else {
              state.passwordLevelChecked = false;
              that.submitEdit(values);
            }
          }
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
      },
      submitEdit(values){
        const para = {'username':values.username, 'oldPassword':values.oldPassword, 'newPassword':values.password}
        let that = this;
        editPassword(para)
          .then(function(data) {
            if(data === 'Success'){
              that.editSuccess('密码修改成功');
              setTimeout(function() {
                that.$router.push({ name: 'login'})
              },1500);
            } else if(data === 'Error'){
              that.editError('用户名或密码错误');
            } else {
              that.editError('网络错误');
            }
          })
          .catch(function() {
            that.editError('网络错误');
          })
      },
      getCaptcha (e) {
        e.preventDefault()
        const { form: { validateFields }, state, $message, $notification } = this
        state.smsSendBtn = true
        const interval = window.setInterval(() => {
          if (state.time-- <= 0) {
            state.time = 60
            state.smsSendBtn = false
            window.clearInterval(interval)
          }
        }, 1000)

        const captcha = this.getSmsCaptcha()
        if (captcha) {
          this.captcha = captcha
          $notification['success']({
            message: '成功',
            description: '验证码获取成功，您的验证码为：' + captcha,
            duration: 8
          })
          this.sym = 0
        } else {
          clearInterval(interval)
          state.time = 60
          state.smsSendBtn = false
          if (captcha !== 0) {
            this.$notification['success']({
              message: '提示',
              description: '您的验证码为：' + captcha,
              duration: 4
            })
          }
        }
      },
      requestFailed (err) {
        this.$notification['error']({
          message: '错误',
          description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
          duration: 4
        })
        this.editBtn = false
      },
      getSmsCaptcha () {
        if (this.sym) {
          return 0
        } else {
          const codeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
          const length = 6
          let code = ''
          for (let i = 0; i < length; i++) {
            const randomI = Math.floor(Math.random() * 36)
            code += codeArr[randomI]
          }
          return code
        }
      },
    }
  }
</script>
<style lang="less">
  .user-edit {
    &.error {
      color: #ff0000;
    }
    &.warning {
      color: #ff7e05;
    }
    &.success {
      color: #52c41a;
    }
  }
  .user-layout-edit {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-edit {
    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }
    .edit-button {
      width: 50%;
    }
    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>