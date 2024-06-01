chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.storage.local.set({installDate: Date.now()});
    }
    createMdToolsContextMenu();
});

chrome.contextMenus.onClicked.addListener(genericOnClick);

// 创建相关的菜单
function createMdToolsContextMenu() {
    // 创建父右键菜单
    let parent = chrome.contextMenus.create(MdToolsParentContextMenu);

    chrome.contextMenus.create({
        ...CopyPageLinkAsMdUrlFormat,
        parentId: parent
    });
    chrome.contextMenus.create({
        ...CopyImageLinkAsMdUrlFormat,
        parentId: parent
    });
}

// 通用的 onClick 监听函数
function genericOnClick(info, tab) {
    if (!tab || !tab.id) return;
    console.log(info);
    switch (info.menuItemId) {
        case CopyPageLinkAsMdUrlFormat.id:
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: copyPageLinkAsMdUrlFormat,
            }).then(r => {
                console.debug(r)
            })
            break;
        case CopyImageLinkAsMdUrlFormat.id:
            chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: copyImageLinkAsMdUrlFormat,
                args: [info.srcUrl]
            }).then(r => {
                console.debug(r)
            });
            break;
    }
}


const MdToolsParentContextMenu = {
    title: 'Md tools ...',
    id: 'md-tools-parent-context-menu',
    contexts: ['image', 'page']
};
const CopyPageLinkAsMdUrlFormat = {
    id: 'copy-page-link-as-md-url-format',
    title: 'Copy page link as md url format',
    type: 'normal'
};

const CopyImageLinkAsMdUrlFormat = {
    id: 'copy-image-link-as-md-url-format',
    title: 'Copy image link as md url format',
    type: 'normal',
    contexts: ['image']
};


/**
 * 将当前网页的 url 转换成 markdown 链接格式
 */
function copyPageLinkAsMdUrlFormat() {
    const pageLInk = `[${document.title}](${location.origin + location.pathname})`;
    navigator.clipboard.writeText(pageLInk);
}

/**
 * 将当前被点击的 图片 的 src 转换成 markdown 图片连接格式
 * @param srcUrl string 图片 srcUrl 属性
 */
function copyImageLinkAsMdUrlFormat(srcUrl) {
    if (!srcUrl) return;
    const img = document.querySelector(`img[src="${srcUrl}"]`);
    const imgAlt = img ? img.alt : "null";
    const imgLink = `![${imgAlt}](${srcUrl})`;
    navigator.clipboard.writeText(imgLink);
}
