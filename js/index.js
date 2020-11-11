const app = new Vue({
    el: '#app',
    data: {
      newTag: '',
      feTag: null,
      webTag: null,
      userTag: null,
      addTagType: null,
      feTags: [],
      webTags: [],
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
      handleTagTabsEdit(targetName, action, tagType) {
        if (action === 'add') {
          this.handleShow(tagType)
          return
        }
        if (action === 'remove') {
          this.handleDelete(tagType, targetName)
          return
        }
        
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
        if (this.addTagType === 'webTag' && this.webTags.includes(this.newTag)) return
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
            webTag: this.webTag,
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
          const { feTag, userTag, webTag } = cookies
          this.feTag = feTag || 'NOTAG'
          this.userTag = userTag || 'NOTAG'
          this.webTag = webTag || 'NOTAG'
        })
      },
      // 从本地存储中读取 Tag 列表
      getTagListFromStorage() {
        sendMessageToContentScript({
          type: 'getTagList',
        }, response => {
          if (!response) return
          const { feTags, userTags, webTags } = response
          this.feTags = [...new Set(feTags)].map(tagName => ({
            name: tagName,
            title: tagName,
          }))
          this.userTags = [...new Set(userTags)].map(tagName => ({
            name: tagName,
            title: tagName,
          }))
          this.webTags = [...new Set(webTags)].map(tagName => ({
            name: tagName,
            title: tagName,
          }))
        })
      }
    },
    created() {
      this.getCurrentCookies()
      this.getTagListFromStorage()
    }
})

