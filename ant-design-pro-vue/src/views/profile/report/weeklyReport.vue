<template>
  <page-view :title="no">
    <detail-list slot="headerContent" size="medium" :col="2" class="detail-layout">
    </detail-list>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-card type="inner" title="周报内容">
        <pre id = "content_detail">
          {{ content }}
        </pre>
      </a-card>
    </a-card>
  </page-view>
    
</template>

<script>
  import { mixinDevice } from '@/utils/mixin'
  import { PageView } from '@/layouts'
  import DetailList from '@/components/tools/DetailList'
  import { getReportItem } from '@/api/manage'
  import { deleteNoticeItem } from '@/api/manage'

  const DetailListItem = DetailList.Item
  const pangu = require('pangu');

  export default {
    name: 'weeklyReport',
    components: {
      PageView,
      DetailList,
      DetailListItem
    },
    mixins: [mixinDevice],
    data () {
      return {
        activeTabKey: '1',
        no: '',
        content: '',
      }
    },
    created () {
      this.websocketToLogin()
    },
    mounted () {
      this.getData()
    },
    watch: {
      '$route': 'getData'
    },
    methods: {
      getData: function () {
        const obj = this;
        getReportItem(this.getUrlKey('id') || '?id=1').then(function (data) {
          console.log(data)
          data = data.results[0]
          obj.no = '统一编号： #' + data['id']

          obj.content = pangu.spacing(data["report_content"]);
          console.log(data["report_content"].replace('\n', '**'))
        })
      },
      getUrlKey: function (name) {
        return decodeURIComponent(
          (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [''])[0].replace(/\+/g, '%20')) || null
      },
      getConfigResult (res) {
        // 接收回调函数返回数据的方法
        let tmp = res.data.split('/');
        if (tmp[0] == 'M'){
          console.log(tmp)
          this.$store.dispatch("increaseCount")
          this.openNotification(res.data)
        }
        console.log(res)
      },
      websocketToLogin () {
        // 【agentData：发送的参数；this.getConfigResult：回调方法】
        this.socketApi.sendSock("This is WeeklyReport", this.getConfigResult)
      },
      openNotification (msg) {
        let tmp = msg.split('/')
        const obj = this
        const key = "notification"
        let closed = false
        let clicked = false

        this.$notification.open({
          message: "您关注的 " + tmp[1] + " 有新消息",
          description: tmp[2] + ": " + tmp[3],
          icon: <a-icon type="message" style="color: #108ee9; margin-left: 0px;" />,
          onClose: () => {
            console.log("close")
            closed = true
          },
          onClick: () => {
            if (!clicked) {
              console.log('Notification Clicked!');
              clicked = true
            }

            if (!closed){
              this.$store.dispatch("decreaseCount")
              deleteNoticeItem("&__pk=" + tmp[4])
              obj.$router.push({
                path: '/profile/basic?__pk=' + tmp[4]
              })
            }

          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .detail-layout {
    margin-left: 44px;
    [class = term] {
      font-weight: bold;
    }
  }
</style>

<style type="text/css">
  [class = term] {
    font-weight: bold;
  }
</style>