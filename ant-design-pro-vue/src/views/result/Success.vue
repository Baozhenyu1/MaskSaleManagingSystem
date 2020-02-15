<template>
  <a-card :bordered="false" style="margin: -24px -24px 0px;">
    <result type="success" :description="description" :title="title">
      <template slot="action">
        <a-button type="primary" @click="more">返回</a-button>
        <a-button style="margin-left: 8px" @click="feedback">反馈记录</a-button>
      </template>
    </result>
  </a-card>
</template>

<script>
import { Result } from '@/components'
import { mixinDevice } from '@/utils/mixin.js'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Success',
  components: {
    Result
  },
  mixins: [mixinDevice],
  data () {
    return {
      title: '提交成功',
      description: '',
      directionType
    }
  },
  methods: {
    more() {
      this.$router.push({
        path: '/userService/base-form'
      })
    },
    feedback() {
      this.$router.push({
        path: '/userService/feedback'
      })
    }
  }
}
</script>

<style scoped>

</style>
