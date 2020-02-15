<template>


</template>

<script>

  import {getAlternative} from '@/api/manage'

  export default {
    name: 'CardList',
    data() {
      return {
        data: []
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        const obj = this
        getAlternative().then(function (data) {
          console.log(data)
          for (let i = 0; i < data.length; i++) {
            obj.data.push({
              title: data[i].drug_name + '(' + data[i].department + ')',
              description: data[i].shortage_spec ? '规格：' + data[i].shortage_spec : '规格：暂无',
              alternative_drug_1: data[i].alternative_drug_1,
              alternative_drug_2: data[i].alternative_drug_2,
              alternative_drug_3: data[i].alternative_drug_3,
              alternative_level_1: data[i].alternative_level_1,
              alternative_level_2: data[i].alternative_level_2,
              alternative_level_3: data[i].alternative_level_3
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
