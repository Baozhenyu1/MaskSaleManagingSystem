<template>
  <div>
    <div v-if="data && data.length > 0">
      <a-list class="list">
        <a-list-item v-for="item in data" :class="'item '+ (item.read?'read':'')" :key="item.id" @click="() => onClick(item)">
          <a-list-item-meta class="meta">
            <template slot="title">
              <div class="title">
                {{ item.source }}
              </div>
            </template>
            <template slot="description">
              <div>
                <div v-if="item.title" class='description' :title="item.title">
                  {{ item.title }}
                </div>
                <div class="datetime">{{ item.description }}</div>
              </div>
            </template>
            <template v-if="item.avatar" slot="avatar">
              <a-avatar class="avatar" :src="item.avatar" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <div class='clear' @click="onClear">
        {{ locale.clear }}
        {{ title }}
      </div>
    </div>
    <div v-else>
      <div class='notFound'>
        <img v-if="emptyImage" :src="emptyImage" alt="not found" />
        <div v-if="emptyText">{{ emptyText }}</div>
        <div v-else-if="locale.emptyText">{{ locale.emptyText }}</div>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
        name: "NoticeList",
      components: {},
      props: {
        locale: {
          type: Object
        },
        onClear: {
          type: Function
        },
        onClick: {
          type: Function
        },
        data: {
          type: Array
        },
        title: {
          type: String
        },
        emptyImage: {
          type: String
        },
        emptyText: {
          type: String
        }
      },
      data() {
        return {};
      },
      methods: {
      }
    }
</script>

<style lang="less" scoped>
  @import "./NoticeList.less";
</style>