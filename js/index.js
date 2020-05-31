const app = new Vue({
    el: '#app',
    data: {
      newTag: '',
      feTag: null,
      userTag: null,
      addTagType: null,
      feTags: [],
      userTags: [],
      addInputVisible: false,
    },
    methods: {
      // 显示页面添加 Tag 的 Input 控件
      handleShow(type) {
        setTimeout(() => {
          this.$refs.addTagInput.$el.querySelector('input').focus()
        }, 100)
        this.addTagType = type
        this.addInputVisible = true
      },
      // 隐藏页面添加 Tag 的 Input 控件
      handleCancel() {
        this.addInputVisible = false
      },
      // 删除某个 Tag
      handleDelete(tagType, tagName) {
        sendMessageToContentScript({
          type: 'deleteTag',
          payload: {
            tagType,
            tagName,
          },
        }, response => {
          if (this[tagType] === tagName) {
            this[tagType] = 'NOTAG'
          }
          this.getTagListFromStorage()
        })
      },
      // 添加某个 Tag
      handleAdd() {
        if (!this.newTag) return
        if (this.addTagType === 'feTag' && this.feTags.includes(this.newTag)) return
        if (this.addTagType === 'userTag' && this.userTags.includes(this.newTag)) return
        sendMessageToContentScript({
          type: 'addTag',
          payload: {
            tagType: this.addTagType,
            tagName: this.newTag,
          },
        }, response => {
          this[this.addTagType] = this.newTag
          this.getTagListFromStorage()
          this.newTag = ''
          this.addInputVisible = false
        })
      },
      // 设置页面的 cookie
      clickpaas() {
        sendMessageToContentScript({
          type: 'setCookies',
          payload: {
            feTag: this.feTag,
            userTag: this.userTag,
          }
        }, (response) => {
          if (!response) return
        })
      },
      // 获取页面当前的 cookie
      getCurrentCookies() {
        sendMessageToContentScript({
          type: 'getCookies',
        }, cookies => {
          if (!cookies) {
            document.body.innerHTML = '<p style="white-space: nowrap;">clickpaas, click your dream!!!</p>'
            return
          }
          const { feTag, userTag } = cookies
          this.feTag = feTag || 'NOTAG'
          this.userTag = userTag || 'NOTAG'
        })
      },
      // 从本地存储中读取 Tag 列表
      getTagListFromStorage() {
        sendMessageToContentScript({
          type: 'getTagList',
        }, response => {
          if (!response) return
          const { feTags, userTags } = response
          this.feTags = [...new Set(feTags)]
          this.userTags = [...new Set(userTags)]
        })
      }
    },
    created() {
      this.getCurrentCookies()
      this.getTagListFromStorage()
    }
})

