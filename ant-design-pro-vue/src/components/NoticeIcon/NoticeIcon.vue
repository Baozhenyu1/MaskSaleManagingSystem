<template>
  <a-popover
    v-model="visible"
    placement="bottomRight"
    trigger="click"
    :arrowPointAtCenter="true"
    overlayClassName="NoticeIcon"
  >
    <template slot="content">
      <a-spin :spinning="loading" :delay="0">
        <a-tabs :tabBarStyle="{marginLeft: 250}" class='tabs' @change="onTabChange" :tabBarGutter="12">
          <a-tab-pane v-for="item in dataList"
                      :tab="item.list && item.list.length > 0 ? `${item.title} (${item.length})` : item.title"
                      :key="item.title">
            <NoticeList
              :data="item.list"
              :onClick="value => onItemClick(value)"
              :onClear="() => onClear(item.title)"
              :title="item.title"
              :locale="locale"
              :emptyImage="item.emptyImage"
              :emptyText="item.emptyText"
            />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="noticeButton">
      <a-badge :count="count" class='badge'>
        <a-icon type="bell" class='icon'/>
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
  import {getNoticeList, deleteNoticeItem} from '@/api/manage'
  import moment from 'moment'
  import NoticeList from "./NoticeList";
  import groupBy from "lodash/groupBy";

  export default {
    name: 'HeaderNotice',
    components: {
      NoticeList
    },
    data() {
      return {
        tabType: "",
        locale: {
          emptyText: "暂无数据",
          clear: "清空"
        },
        loading: false,
        visible: false,
        data: [],
        ResponseData: [],
        count: 0,
        animated: true,
        dataList: [
          {
            length: 0,
            list: [],
            title: "订阅信息",
            emptyText: "你已查看所有订阅信息",
            emptyImage:
              "https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          },
          {
            length: 0,
            list: [],
            title: "系统通知",
            emptyText: "您已读完所有系统通知",
            emptyImage:
              "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          }
        ]
      }
    },
    created() {
      this.loadData()
      this.websocketToLogin()
    },
    methods: {
      loadData() {
        const obj = this
        this.loading = true

        this.data = []
        this.ResponseData = []

        getNoticeList().then(function (data) {
          //console.log("get data", data)

          obj.count = data.length

          for (let i in data) {

            let listItem = {
              source: data[i].message.split('/')[0],
              title: data[i].message.split('/')[1],
              description: moment(data[i].timestamp).fromNow(),
              link: data[i].link,
              id: data[i].id,
              mtype: data[i].mtype,
              read: false
            }

            if (data[i].mtype == 'MS') {
              obj.data.push(listItem)
              //console.log("New MS")
            } else if (data[i].mtype == 'MR') {

              //console.log("New MR")
              listItem.source = "您反馈的：" + listItem.source + " 有新回复了"
              obj.ResponseData.push(listItem)
            }
          }
          obj.dataList[0].list = obj.data
          obj.dataList[0].length = obj.data.length
          obj.dataList[1].list = obj.ResponseData
          obj.dataList[1].length = obj.ResponseData.length

          obj.loading = false

          console.log(obj.dataList)
        })
      },
      fetchNotice() {
        const obj = this
        this.data = []

        if (!this.visible) {
          //console.log("Start to load data")
          this.loadData()
        }
        this.visible = !this.visible
      },
      onItemClick(record) {
        if (record.read) return
        if (record.mtype == 'MS') {
          //this.$store.dispatch("decreaseCount")
          this.count--
          this.dataList[0].length--

          record.read = true
          this.$router.push({
            path: '/profile/basic?__pk=' + record.link
          })
          deleteNoticeItem("&__pk=" + record.link)
        } else if (record.mtype == 'MR') {
          const obj = this

          deleteNoticeItem("&__pk=" + record.link).then(function (data) {
            /*for (let i = 0; i < data.count; i++){
              obj.$store.dispatch("decreaseCount")
            }*/
            obj.count -= data.count
            obj.dataList[1].length -= data.count

            record.read = true
            obj.$router.push({
              path: '/userService/detail?event_pk=' + record.link
            })
          })
        }
      },
      onClear(title) {


        if (title == "订阅信息") {
          const len = this.data.length
          this.count -= len
          this.dataList[0].length -= len

          console.log(this.dataList[0])

          for (let i = 0; i < len; i++) {
            deleteNoticeItem("&__pk=" + this.data[0].link)
            this.data.splice(0, 1)
            //console.log(this.data.length)
          }
        } else if (title == "系统通知") {
          const len = this.ResponseData.length
          this.count -= len
          this.dataList[1].length -= len

          for (let i = 0; i < len; i++) {
            deleteNoticeItem("&__pk=" + this.ResponseData[0].link)
            this.ResponseData.splice(0, 1)
            //console.log(this.data.length)
          }
        }

        //this.$store.dispatch("setCount", this.count)
        this.$message.success('未读消息已清空')
      },
      getConfigResult(res) {
        // 接收回调函数返回数据的方法
        console.log(res)
        this.openNotification(res.data)
      },
      websocketToLogin() {
        // 【agentData：发送的参数；this.getConfigResult：回调方法】
        this.socketNotice.sendSock("Notice Test", this.getConfigResult)
      },
      openNotification(msg) {
        let tmp = msg.split('/')
        this.count++
        const obj = this

        let closed = false
        let clicked = false

        if (tmp[0] == 'MS') {

          this.dataList[0].length++

          this.$notification.open({
            message: "您关注的 " + tmp[1] + " 有新消息",
            description: tmp[2] + ": " + tmp[3],
            icon: <a-icon type="message" style="color: #108ee9; margin-left: 0px;"/>,
            style: 'z-index: 10;',
            onClose: () => {
              //console.log("close")
              closed = true
            },
            onClick: () => {
              if (!clicked) {
                console.log('Notification Clicked!');
                clicked = true
              }

              if (!closed) {
                //this.$store.dispatch("decreaseCount")
                this.count--
                deleteNoticeItem("&__pk=" + tmp[4])
                obj.$router.push({
                  path: '/profile/basic?__pk=' + tmp[4]
                })
              }

            }
          });
        } else if (tmp[0] == 'MR') {

          this.dataList[1].length++

          this.$notification.open({
            message: "您反馈的 " + tmp[1] + " 有新回复",
            description: tmp[2].length > 28 ? tmp[2].substring(0, 30) + '...' : tmp[2],
            icon: <a-icon type="message" style="color: #108ee9; margin-left: 0px;"/>,
            onClose: () => {
              //console.log("close")
              closed = true
            },
            onClick: () => {
              if (!clicked) {
                console.log('Notification Clicked!');
                clicked = true
              }

              if (!closed) {
                deleteNoticeItem("&__pk=" + tmp[3]).then(function (data) {
                  //console.log(data.count)
                  //for (let i = 0; i < data.count; i++)
                  //  obj.$store.dispatch("decreaseCount")

                  this.count -= data.count

                  obj.$router.push({
                    path: '/userService/detail?event_pk=' + tmp[3]
                  })
                })
              }

            }
          });
        }
      },
      onTabChange(tabType) {
        this.tabType = tabType;
      }
    }
  }
</script>

<style lang="less">
  @import "./index.less";
</style>

<style lang="less" scoped>
  .noticeButton {
    cursor: pointer;
    display: inline-block;
    transition: all 0.3s;
  }

  .icon {
    font-size: 16px;
    padding: 4px;
  }

  .tabs {

    .ant-tabs-nav-scroll {
      text-align: center;


    }


    .ant-tabs-bar {
      margin-bottom: 4px;
    }
  }
</style>
