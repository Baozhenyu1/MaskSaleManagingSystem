<template>
  <page-view title="预约销售统计表（开发中）" logo="">
    <a-card title="上海市累计预约销售情况" :bordered="true">
      <line-chart/>
    </a-card>
    <a-card title="全市街道预约统计表" :bordered="true" style="margin-bottom: 12px">

    </a-card>
    <a-card title="全市预约销售统计表" :bordered="true" style="margin-bottom: 12px">

    </a-card>
  </page-view>
</template>

<script>
  import {PageView} from '@/layouts'
  import {LineChart} from '@/components'

  export default {
    name: "AppointmentList",
    components: {
      PageView,
      LineChart
    }
  }
</script>

<style scoped>

</style>