<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <v-chart :force-fit="true" :height="height" :data="show_data" :padding="[36, 5, 18, 5]">
        <v-tooltip />
        <v-bar position="x*y" />
      </v-chart>
    </div>
  </div>
</template>

<script>

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y
  })
]

const scale = [{
  dataKey: 'x',
  min: 2
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 30
}]

export default {
  name: 'MiniBar',
  data () {
    return {
      tooltip,
      scale,
      height: 100
    }
  },
  props: {
    show_data: Array
  }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
