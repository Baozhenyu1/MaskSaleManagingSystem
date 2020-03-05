<template>
  <div class="logo">
    <router-link :to="{name:this.logUrlName}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'
import Vue from 'vue'
import { USER_PERMISSION } from '@/store/mutation-types'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  data(){
    return{
      logUrlName: 'dashboard'
    }
  },
  created() {
    const permission = Vue.ls.get(USER_PERMISSION);
    // 没有任何权限，直接送到登录页面
    if(permission === 'affairs_province' || permission === 'affairs_district'){
      this.logUrlName = 'StreetListWrapper'
    }

  },
  props: {
    title: {
      type: String,
      default: '口罩预约配售系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
