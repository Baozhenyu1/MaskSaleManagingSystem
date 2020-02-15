<template>
  <result
    :isSuccess="true"
    :content="false"
    :title="email"
    :description="description">

    <template slot="action">
      <a-button size="large" type="primary" @click="goLogin">立即登录</a-button>
    </template>

  </result>
</template>

<script>
import { Result } from '@/components'

export default {
  name: 'RegisterResult',
  components: {
    Result
  },
  data () {
    return {
      description: '您注册的用户已经被激活，欢迎使用海宇口罩销售管理系统',
      form: {}
    }
  },
  computed: {
    email () {
      const v = this.form && this.form.email || 'xxx'
      const title = `你的账户：${v} 注册成功`
      return title
    }
  },
  created () {
    this.form = this.$route.params
  },
  methods: {
    goLogin () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>

</style>
