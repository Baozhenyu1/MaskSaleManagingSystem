<template>
  <div>
    404 page
  </div>
</template>

<script>
import Vue from 'vue'
import { USER_PERMISSION } from '@/store/mutation-types'
import { mapActions } from 'vuex'

export default {
  name: '404',
  created() {
    this.checkPermission();
  },
  methods:{
    ...mapActions(['Logout']),
    checkPermission(){
      let that = this;
      const permission = Vue.ls.get(USER_PERMISSION);
      console.log(permission)
      if(!permission || !(permission in [ 'business_province', 'affairs_province',  'business_district', 'affairs_district'])){
        this.Logout({}).then(() => {
          that.$router.push({ name: 'login'})
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
