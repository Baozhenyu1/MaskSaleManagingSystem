<template>
  <exception-page type="404" v-if="!change"/>
</template>

<script>
import { ExceptionPage } from '@/components'
import Vue from 'vue'
import { USER_PERMISSION } from '@/store/mutation-types'
export default {
  components: {
    ExceptionPage,
  },
  data(){
    return{
      change: true
    }
  },
  mounted(){
    this.checkPermission();
  },
  methods:{
    checkPermission(){
      const permission = Vue.ls.get(USER_PERMISSION);
      // 没有任何权限，直接送到登录页面
      if(permission === 'affairs_province' || permission === 'affairs_district'){
        window.location.href = '/street-list'
      } else if(permission === 'business_province' || permission === 'business_district'){
        window.location.href = '/analysis'
      } else{
        window.location.href = '/user/login';
      }
    },
  }
}
</script>

<style scoped>

</style>
