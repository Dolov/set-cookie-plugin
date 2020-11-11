

// 接收来自后台的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, payload } = request
    if (type === 'getTagList') {
        const tagList = getTagListFromStorage()
        sendResponse(tagList)
        return
    }
    if (type === 'getCookies') {
        const cookies = getContentPageCookies()
        sendResponse(cookies)
        return
    }
    if (type === 'setCookies') {
        setContentPageCookies(payload)
        sendResponse(true)
        location.reload()
        return
    }
    if (type === 'addTag') {
        addTagToStorage(payload)
        sendResponse(true)
        return
    }
    if (type === 'deleteTag') {
        deleteTag(payload)
        sendResponse(true)
        return
    }
    
})

// 读取页面的 cookie 并返回
const getContentPageCookies = () => {
    const feTag = getCookie('feTag')
    const userTag = getCookie('userTag')
    const webTag = getCookie('webTag')
    return {
        feTag,
        userTag,
        webTag,
    }
}

// 设置页面的 tag 至页面
const setContentPageCookies = cookies => {
    const { feTag, userTag, webTag } = cookies
    setCookie('feTag', feTag)
    setCookie('userTag', userTag)
    setCookie('webTag', webTag)
}

// 从本地存储中读取 tag 列表
const getTagListFromStorage = () => {
    const feTags = JSON.parse(localStorage.getItem('feTags')) || ['NOTAG']
    const userTags = JSON.parse(localStorage.getItem('userTags')) || ['NOTAG']
    const webTags = JSON.parse(localStorage.getItem('webTags')) || ['NOTAG']
    return {
        feTags,
        userTags,
        webTags,
    }
}

// 添加某个类型的 tag
const addTagToStorage = payload => {
    const { tagType, tagName } = payload
    const { feTags = [], userTags = [], webTags = [] } = getTagListFromStorage()
    if (tagType === 'feTag') {
        feTags.push(tagName)
        localStorage.setItem('feTags', JSON.stringify(feTags))
        return
    }
    if (tagType === 'userTag') {
        userTags.push(tagName)
        localStorage.setItem('userTags', JSON.stringify(userTags))
    }
    if (tagType === 'webTag') {
        webTags.push(tagName)
        localStorage.setItem('webTags', JSON.stringify(webTags))
    }
}

// 删除某类型个 tag
const deleteTag = payload => {
    const { tagType, tagName } = payload
    const { feTags = [], userTags = [], webTags = [] } = getTagListFromStorage()
    if (tagType === 'feTag') {
        const index = feTags.indexOf(tagName)
        if (index === -1) return
        feTags.splice(index, 1)
        localStorage.setItem('feTags', JSON.stringify(feTags))
        return
    }
    if (tagType === 'userTag') {
        const index = userTags.indexOf(tagName)
        if (index === -1) return
        userTags.splice(index, 1)
        localStorage.setItem('userTags', JSON.stringify(userTags))
    }
    if (tagType === 'webTag') {
        const index = webTags.indexOf(tagName)
        if (index === -1) return
        webTags.splice(index, 1)
        localStorage.setItem('webTags', JSON.stringify(webTags))
    }
}


// 设置页面 cookie
const setCookie = (key, val, expires) => {
    const expiresTime = val === 'NOTAG' ? -1 : (expires || 1)
    const d = new Date();
    d.setDate(d.getDate()+expiresTime);
 
    document.cookie = key+"="+val+";path=/;expires="+d;
}

const removeCookie = (key, val) => {
    setCookie(key, val, -1)
}

// 获取页面 cookie
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg)) {
        console.log('arr: ', arr);
        return unescape(arr[2]);
    }
    return null;
}
