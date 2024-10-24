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
  '[data-testid="card.layoutLarge.media"]',
  // 推荐内容
  '[data-testid="collection-hero-image"]'
];

async function handleElements() {
  const enable = await storage.getItem<boolean>(storageKeys.enable) ?? true;
  const blur = await storage.getItem<number>(storageKeys.blur) ?? defaultBlur;

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

        // 更新按钮点击事件
        toggleButton.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const newStatus = !statusMap.get(comfortId!);

          statusMap.set(comfortId!, newStatus);

          if (newStatus) {
            targetElement.style.filter = `blur(${blur}px)`;
            toggleButton.innerText = '👀';
          } else {
            targetElement.style.filter = 'none';
            toggleButton.innerText = '🙈';
          }
        };

        element.parentElement?.insertBefore(toggleButton, element);
      }

      // 当前元素包含覆盖其他待处理元素时
      if (element.querySelectorAll(otherSelectors).length > 0) {
        document.getElementById(comfortId)?.remove();
      }

      // 确保 statusMap 中有这个元素的状态
      if (!statusMap.has(comfortId)) {
        statusMap.set(comfortId, enable);
      }

      const blurStatus = statusMap.get(comfortId);
      const targetElement = element as HTMLElement;
      const toggleButton = document.getElementById(comfortId) as HTMLElement;

      if (!enable) {
        targetElement.style.filter = 'none';
        toggleButton.style.display = 'none';
        statusMap.clear()
        return
      } else {
        toggleButton.style.display = 'block';
      }

      if (blurStatus && targetElement.style.filter !== `blur(${blur}px)`) {
        targetElement.style.filter = `blur(${blur}px)`;
        toggleButton.innerText = '👀';
      }

      if (!blurStatus && targetElement.style.filter !== 'none') {
        targetElement.style.filter = 'none';
        toggleButton.innerText = '🙈';
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
    console.log('Hello from X-Comfort-Browse.');

    handleElements();

    // 监听 storage 值变化
    storage.watch<number>(storageKeys.blur, (v) => {
      handleElements();
    });
    storage.watch<boolean>(storageKeys.enable, (v) => {
      handleElements();
    });

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => handleElements());

    observer.observe(document.body, { childList: true, subtree: true });
  },
});
