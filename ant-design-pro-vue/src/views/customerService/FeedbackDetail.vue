<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" style="margin-bottom: 24px" :title="'标题： ' + title">
      <detail-list size="medium" :col="2" class="detail-layout">
        <detail-list-item term="需要加入的药物">{{ drug_str }}</detail-list-item>
        <detail-list-item term="需要加入的公司">{{ company_str }}</detail-list-item>
      </detail-list>

      <detail-list size="medium" :col="1" class="detail-layout">
        <detail-list-item term="简述" body-style="margin-right: 24px">{{description}}</detail-list-item>
      </detail-list>


    </a-card>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">


      <a-list
        class="comment-list"
        :header="data.length > 0 ? `${data.length} 条留言` : '暂无留言'"
        itemLayout="horizontal"
        :dataSource="data"
      >
        <a-list-item slot="renderItem" slot-scope="item, index" padding="0px">
          <a-comment
            :author="item.author"
            :avatar="item.avatar"
            style="margin-top: 0px; margin-bottom: 0px"
            padding="0px 0px 0px 0px"
          >
            <p slot="content">{{item.content}}</p>
            <a-tooltip slot="datetime" :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
              <span>{{item.datetime.fromNow()}}</span>
            </a-tooltip>
          </a-comment>
        </a-list-item>
      </a-list>

      <a-divider style="margin-top: 0px"/>

      <a-comment>

        <div slot="content">
          <a-form-item>
            <a-textarea :rows="4" @change="handleChange" :value="text" :placeholder="disable ? '留言已关闭' : '请在此留言'" :disabled="disable"></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button
              htmlType="submit"
              :loading="submitting"
              @click="handleSubmit"
              type="primary"
            >
              提交留言
            </a-button>
          </a-form-item>
        </div>
      </a-comment>

    </a-card>
  </div>

</template>

<script>

  import moment from 'moment'
  import DetailList from '@/components/tools/DetailList'
  import {getFeedbackList, sendFeedbackAdd} from '@/api/manage'
  import { mapGetters } from 'vuex'

  const DetailListItem = DetailList.Item

  export default {
    components: {
      DetailList,
      DetailListItem
    },
    name: "FeedbackDetail",
    data() {
      return {
        data: [],
        title: '',
        drug_str: '',
        company_str: '',
        description: '',
        event_pk: '',
        text:'',
        submitting: false,
        username: '',
        disable: false
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      ...mapGetters(['nickname']),
      init() {

        const obj = this
        getFeedbackList({event_pk: this.$route.query.event_pk}).then(function (data) {
          console.log(data)
          obj.title = data[0].title
          obj.company_str = data[0].company ? data[0].company : '无'
          obj.drug_str = data[0].drug ? data[0].drug : '无'
          obj.description = data[0].description ? data[0].description : '无'
          obj.event_pk = data[0].event_pk
          obj.username = obj.nickname()
          obj.disable = (data[0].status == "已关闭" || data[0].status == "已删除")  ? true : false

          for (let i = 1; i < data.length; i++) {
            obj.data.push({
              author: data[i].username,
              avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
              content: data[i].description,
              datetime: moment(data[i].timestamp)
            })
            console.log(obj.data[obj.data.length - 1].datetime.format("YYYY-MM-DD HH:mm:ss"))
          }
        })
      },
      handleSubmit() {
        if (!this.text) {
          return;
        }

        const obj = this
        this.submitting = true

        const send_data = {
          title: '',
          drug: this.drug_str,
          company: this.company_str,
          description: this.text,
          event_pk: this.event_pk,
          timestamp: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }

        sendFeedbackAdd(send_data).then(function() {
          obj.submitting = false
          obj.data.push({
            author: obj.username,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: send_data.description,
            datetime: moment(send_data.timestamp)
          })
          console.log("反馈成功")
          obj.text = ''
        })

      },
      handleChange(e) {
        this.text = e.target.value
      }
    }
  }
</script>

<style scoped>
  .detail-layout {
    margin-left: 44px;
    margin-right: 44px;

  [class = term] {
    font-weight: bold;
  }

  }


</style>