<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>
    <div v-if="show_data.length > 0">
      <v-chart
        height="254"
        :data="show_data"
        :forceFit="true"
        :padding="['auto', 'auto', '40', '50']">
        <v-tooltip />
        <v-axis />
        <v-bar position="x*y"/>
      </v-chart>
    </div>
    <div v-else>
      暂无数据
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
  max: 22
}]

export default {
  name: 'Bar',
  props: {
    show_data: Array,
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scale,
      tooltip
    }
  }
}
</script>
