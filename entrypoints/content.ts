import { defineContentScript } from "wxt/sandbox";
import { storageKeys } from "@/const";
import { handleElements as handleTwitterElements } from "@/handler/twitter";
import { handleElements as handleZhihuElements, removeAdvertise as removeZhihuAdvertise } from "@/handler/zhihu";

const handlers = {
  'x.com': handleTwitterElements,
  'zhihu.com': () => {
    handleZhihuElements();
    removeZhihuAdvertise();
  },
}

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: 'document_idle',
  main() {
    console.log('Hello from X-Comfort-Browser.', window.location.hostname);

    const executeHandler = () => {
      Object.entries(handlers).forEach(([key, handler]) => {
        if (window.location.hostname.includes(key)) {
          handler();
        }
      });
    }

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
