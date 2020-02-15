<template>
  <div>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="反馈记录">


      <a-table ref="table" :columns="columns" :dataSource="data">
        <a slot="name" slot-scope="text, record" @click="handleDetail(record)">
          <a-icon type="tag"/>
          {{" " + text}}
        </a>
        <span slot="customTitle"><a-icon type="ordered-list"/>反馈标题</span>

        <span slot="compList" slot-scope="compList">
          <a-tag v-for="comp in compList" color="red" :key="comp">{{comp}}</a-tag>
        </span>

        <span slot="drugList" slot-scope="drugList">
          <a-tag v-for="drug in drugList" color="green" :key="drug">{{drug}}</a-tag>
        </span>

        <span slot="description" slot-scope="description">
          {{ description}}
        </span>

        <span slot="action" slot-scope="text, record">
          <template>
            <div v-if="record.status != '已关闭'">
              <a-popconfirm title="确认关闭本条反馈？（关闭后将无法继续留言）" @confirm="confirm(record, 'close')" @cancel="cancel" okText="是" cancelText="否">
                <a>关闭</a>
              </a-popconfirm>
            </div>
            <div v-else>
              <a-popconfirm title="确认删除本条反馈？（删除后将无法查看和恢复）" @confirm="confirm(record, 'delete')" @cancel="cancel" okText="是" cancelText="否">
                <a>删除</a>
              </a-popconfirm>
            </div>


          </template>
        </span>

      </a-table>

    </a-card>
  </div>
</template>

<script>

  import {getFeedbackList, sendFeedbackDelete} from '@/api/manage'
  import moment from 'moment'

  export default {
    name: "feedbackList",
    data() {
      return {
        userData: {},
        data: [],
        columns: [],
        keyIndex: 0,
        columns: []
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {

        this.columns = [{
          dataIndex: 'title',
          slots: {title: 'customTitle'},
          scopedSlots: {customRender: 'name'},
          width: '150px'
        }, {
          title: '公司',
          dataIndex: 'compList',
          scopedSlots: {customRender: 'compList'},
          width: '170px'
        }, {
          title: '药品',
          dataIndex: 'drugList',
          scopedSlots: {customRender: 'drugList'},
          width: '150px'
        }, {
          title: '详情',
          dataIndex: 'description',
          scopedSlots: {customRender: 'description'},
          width: '150px'
        }, {
          title: '更新时间',
          dataIndex: 'time',
          width: '150px'
        }, {
          title: '状态',
          dataIndex: 'status',
          width: '100px'
        }, {
          title: '操作',
          scopedSlots: {customRender: 'action'},
          width: '110px'
        }];

        const obj = this
        console.log("ko no dio da")
        getFeedbackList().then(function (data) {
          console.log(data)
          for (let i in data) {
            obj.data.push({
              key: data[i].event_pk,
              title: data[i].title,
              drugList: data[i].drug ? data[i].drug.split('/') : [],
              compList: data[i].company ? data[i].company.split('/') : [],
              description: data[i].description.substring(0, 24),
              time: moment(data[i].timestamp).format("YYYY-MM-DD HH:mm:ss"),
              status: data[i].status
            })
          }

        })
      },
      confirm(record, operation) {
        console.log(record)
        sendFeedbackDelete({event_pk: record.key, operation: operation})

        if (operation == "delete") {
          for (let i in this.data) {
            if (this.data[i].key == record.key) {
              this.data.splice(i, 1)
              break
            }
          }
        }

        if (operation == "close") {
          for (let i in this.data) {
            if (this.data[i].key == record.key) {
              this.data[i].status = "已关闭"
              break
            }
          }
        }

      },
      cancel() {

      },
      handleDetail(record) {
        console.log(record)
        this.$router.push({
          path: '/userService/detail?event_pk=' + record.key

        })
      }
    }
  }
</script>

<style scoped>

</style>