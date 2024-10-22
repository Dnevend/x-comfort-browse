import { defineContentScript } from "wxt/sandbox";
import { defaultBlur, storageKeys } from "@/const";

export default defineContentScript({
  matches: [
    '*://*.twitter.com/*',
    '*://*.x.com/*',
    '*://x.com/*'
  ],
  runAt: 'document_end',
  main() {
    console.log('Hello X-Comfort-Browse');

    const selectors = [
      // 头像
      '[data-testid="Tweet-User-Avatar"]',
      // 图片
      '[data-testid="tweetPhoto"]',
      // 视频
      '[data-testid="videoPlayer"]',
      // 分享图
      '[data-testid="card.layoutLarge.media"]'
    ];

    async function handleElements() {
      const blur = await storage.getItem<number>(storageKeys.blur) ?? defaultBlur;

      selectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element.getAttribute('comfort-id')) return;
          element.setAttribute('comfort-id', crypto.randomUUID());
          (element as HTMLElement).style.filter = `blur(${blur}px)`;
        });
      });
    }

    // 监听 blur 值变化
    storage.watch<number>(storageKeys.blur, (v) => {
      handleElements();
    });

    document.addEventListener('DOMContentLoaded', () => {
      handleElements();

      // 使用 MutationObserver 监听 DOM 变化
      const observer = new MutationObserver(handleElements);

      const targetNode = document.querySelector('[data-testid="primaryColumn"]');
      targetNode && observer.observe(targetNode, { childList: true, subtree: true });
    });
  },
});
