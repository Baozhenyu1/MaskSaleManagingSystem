<template>
  <div class="scroll-wrap">
    <div class="scroll-content" :style="{ top }" @mouseenter="Stop()" @mouseleave="Up()" style="margin-left: 0">
      <p v-for="item in prizeList" :key="item.key" style="border-bottom: #f0f2f5 solid 1px;">
        <a :href="item.url"  target="_blank" style="text-align: left; font-size: 16px; color: #1890ff;">{{ item.firstLine }}</a>
        <br/>
        <span style="text-align: left; font-size: 12px;">
          {{ '口罩配额：' + item.quota }}&nbsp;&nbsp;&nbsp;
          {{ '已获配额：' + item.distributed }}&nbsp;&nbsp;&nbsp;
          {{ '售出口罩：' + item.sold }}&nbsp;&nbsp;&nbsp;
          {{ '口罩库存：' + item.balance }}
        </span>
        <span style="text-align: right; font-size: 12px;">&nbsp;&nbsp;&nbsp;{{ item.time }}</span>
      </p>
    </div>
  </div>
</template>
<script>
  import {getTableList} from '@/api/manage'
  import moment from 'moment'

  export default {
    name: 'InformationLiquid',
    data() {
      return {
        prizeList: [],  //  实际展示的list
        tmpList: [],    // 临时存放数据的list，动态更新时用
        updated: false,
        first: false,
        activeIndex: 0,
        intnum: undefined
      }
    },
    computed: {
      top() {
        return -this.activeIndex * 58 + 'px'
      }
    },
    created() {
      this.start()
    },
    methods: {
      ScrollUp() {
        console.log("start to scroll")
        const obj = this
        obj.activeIndex += 0.000000000000001
        this.intnum = setInterval(_ => {
          if (obj.activeIndex < obj.prizeList.length) {
            obj.activeIndex += 1
            if (obj.prizeList.length - obj.activeIndex <= 15 && !obj.updated) {
              obj.updateInfoFlow();
              obj.updated = true;
              //console.log("tmpList updated")
            }
          } else {
            obj.activeIndex = 0;
            obj.updated = false;
            Object.assign(obj.prizeList, obj.tmpList);
            //console.log("prizeList updated")

          }
          //console.log("prizeList size:" + this.prizeList.length)
          //console.log("tmpList size:" + this.tmpList.length)
        }, 1500)

      },
      start() {
        console.log("Start to load info flow");
        this.updateInfoFlow()
      },
      updateInfoFlow() {
        //console.log("start to update")
        const obj = this
        getTableList({pageNo: 1, pageSize: 50}).then(function (datas) {
          const datas1 = datas["data"]
          //console.log(datas)
          obj.tmpList = []
          for (let i = 0; i < datas1.length; i++) {
            const item = datas1[i];
            obj.tmpList.push({
              key: i,
              district: item['district'],
              pharmacyName: item['phar_name'],
              quota: item['phar_quota'],
              distributed: item['phar_data_issued'],
              balance: item['phar_data_balance'],
              sold: item['phar_data_purchased'],
              time: moment(item["phar_data_phar_date"]).fromNow(),
              firstLine: item['district'] + ' ' + item['phar_name'],
              url: '/profile/basic?id=' + item['phar_id']
            })

          }
          if (!obj.first) {
            obj.first = true;
            Object.assign(obj.prizeList, obj.tmpList);  // 更新tmpList后要拷贝到prizeList显示
            obj.ScrollUp();
          }
        })
      },
      Stop() {
        clearInterval(this.intnum)
      },
      Up() {
        this.ScrollUp()
      }
    }
  }
</script>
<style scoped>
  .scroll-wrap {
    height: 360px;
    overflow: hidden;
  }

  .scroll-content {
    position: relative;
    transition: top 0.5s;
  }

  .scroll-content p {
    line-height: normal;
    font-size: 15px;
    text-align: left;
    margin: 15px 20px 10px 10px;
  }
</style>
