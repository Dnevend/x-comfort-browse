import { defineContentScript } from "wxt/sandbox";
import { storageKeys } from "@/const";
import {
  handleElements as handleTwitterElements,
  removeAdvertise as removeTwitterAdvertise
} from "@/handler/twitter";
import {
  handleElements as handleZhihuElements,
  removeAdvertise as removeZhihuAdvertise
} from "@/handler/zhihu";
import { debounce } from "lodash-es"

const handlers = {
  'x.com': () => {
    handleTwitterElements();
    removeTwitterAdvertise();
  },
  'zhihu.com': () => {
    handleZhihuElements();
    removeZhihuAdvertise();
  },
}

export default defineContentScript({
  matches: ["*://*.x.com/*", "*://*.zhihu.com/*"],
  runAt: 'document_idle',
  main() {
    console.log('Hello from X-Comfort-Browser.', window.location.hostname);

    const executeHandler = debounce(() => {
      Object.entries(handlers).forEach(([key, handler]) => {
        if (window.location.hostname.includes(key)) {
          handler();
        }
      });
    });

    // 监听参数值值变化
    [storageKeys.blur, storageKeys.enable, storageKeys.options].forEach(key => {
      storage.watch<number | boolean>(key, (v) => {
        executeHandler();
      });
    });

    // 监听页面元素变化
    const observer = new MutationObserver(() => executeHandler());
    observer.observe(document.body, { childList: true, subtree: true });
  },
});
