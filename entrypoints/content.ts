import { defineContentScript } from "wxt/sandbox";
import { defaultBlur, storageKeys } from "@/const";
import { createButton } from "@/utils";

const statusMap = new Map<string, boolean>();

const selectors = [
  // 头像
  // '[data-testid="Tweet-User-Avatar"]',
  // 图片
  '[data-testid="tweetPhoto"]',
  // 视频
  '[data-testid="videoComponent"]',
  '[data-testid="videoPlayer"]',
  // 分享图
  '[data-testid="card.layoutLarge.media"]'
];

async function handleElements() {
  const enable = await storage.getItem<boolean>(storageKeys.enable) ?? true;
  const blur = await storage.getItem<number>(storageKeys.blur) ?? defaultBlur;

  if (!enable) return;

  selectors.forEach((selector) => {
    let elements: Element[] = Array.from(document.querySelectorAll(selector));

    const otherSelectors = selectors.filter((s) => s !== selector).join(',');

    elements = elements.filter(element => !element.querySelectorAll(otherSelectors).length);

    elements.forEach((element) => {
      let comfortId = element.getAttribute('data-comfort-id');

      if (!comfortId) {
        comfortId = crypto.randomUUID();

        element.setAttribute('data-comfort-id', comfortId);

        const toggleButton = createButton(comfortId, handleElements);

        // 添加点击事件监听器
        toggleButton.addEventListener('click', (e) => {
          if (!comfortId) return;

          e.preventDefault();
          e.stopPropagation();

          const targetElement = document.querySelector(`[data-comfort-id="${comfortId}"]`) as HTMLElement;

          const blurStatus = statusMap.get(comfortId);

          targetElement.style.filter = blurStatus ? 'none' : `blur(${blur}px)`;

          statusMap.set(comfortId, !blurStatus);
        });

        // 将按钮添加到元素上方
        element.parentElement?.insertBefore(toggleButton, element);
      } else {
        const targetElement = document.querySelector(`[data-comfort-id="${comfortId}"]`) as HTMLElement;

        if (targetElement && targetElement.querySelectorAll(otherSelectors).length > 0) {
          document.getElementById(comfortId)?.remove();
        }
      }

      if (!statusMap.has(comfortId)) {
        statusMap.set(comfortId, enable);
      }

      // 应用全局模糊设置
      if (enable && statusMap.get(comfortId)) {
        (element as HTMLElement).style.filter = `blur(${blur}px)`;
      } else {
        (element as HTMLElement).style.filter = 'none';
      }
    });
  });
}

export default defineContentScript({
  matches: [
    '*://*.twitter.com/*',
    '*://*.x.com/*',
    '*://x.com/*'
  ],
  runAt: 'document_idle',
  main() {
    console.log('Hello X-Comfort-Browse');

    handleElements();

    // 监听 storage 值变化
    storage.watch<number>(storageKeys.blur, (v) => {
      handleElements();
    });
    storage.watch<boolean>(storageKeys.enable, (v) => {
      handleElements();
    });

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(handleElements);

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
