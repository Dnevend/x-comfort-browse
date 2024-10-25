import { defineContentScript } from "wxt/sandbox";
import { defaultBlur, storageKeys } from "@/const";
import { createButton } from "@/utils";

const BLUR_EMOJI = '👀';
const UN_BLUR_EMOJI = '🙈';

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
    let elements: HTMLElement[] = Array.from(document.querySelectorAll(selector));

    const otherSelectors = selectors.filter((s) => s !== selector).join(',');

    elements = elements.filter(element => !element.querySelectorAll(otherSelectors).length);

    elements.forEach((element) => {
      let comfortId = element.getAttribute('data-comfort-id');

      if (!comfortId) {
        comfortId = crypto.randomUUID();
        element.setAttribute('data-comfort-id', comfortId);
        const button = createButton(comfortId, handleElements);

        // 更新按钮点击事件
        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();

          const newStatus = !statusMap.get(comfortId!);

          statusMap.set(comfortId!, newStatus);

          if (newStatus) {
            element.style.filter = `blur(${blur}px)`;
            button.innerText = BLUR_EMOJI;
          } else {
            element.style.filter = 'none';
            button.innerText = UN_BLUR_EMOJI;
          }
        };

        element.parentElement?.insertBefore(button, element);
      }

      // 当前元素包含覆盖其他待处理元素时
      if (element.querySelectorAll(otherSelectors).length > 0) {
        document.getElementById(comfortId)?.remove();
      }

      // 确保 statusMap 中有这个元素的状态
      if (!statusMap.has(comfortId)) {
        statusMap.set(comfortId, enable);
      }

      const targetElement = element as HTMLElement;
      const toggleButton = document.getElementById(comfortId) as HTMLElement;

      if (!enable) {
        targetElement.style.filter = 'none';
        toggleButton.style.display = 'none';
        statusMap.clear()
        return
      } else {
        targetElement.style.transition = '.3s';
        toggleButton.style.display = 'block';
      }

      const blurStatus = statusMap.get(comfortId);
      if (blurStatus && targetElement.style.filter !== `blur(${blur}px)`) {
        targetElement.style.filter = `blur(${blur}px)`;
        toggleButton.innerText = BLUR_EMOJI;
      }

      if (!blurStatus && targetElement.style.filter !== 'none') {
        targetElement.style.filter = 'none';
        toggleButton.innerText = UN_BLUR_EMOJI;
      }
    });
  });
}

export default defineContentScript({
  matches: ['*://x.com/*'],
  runAt: 'document_idle',
  main() {
    console.log('Hello from X-Comfort-Browser.');

    // 监听 storage 值变化
    [storageKeys.blur, storageKeys.enable].forEach(key => {
      storage.watch<number | boolean>(key, (v) => {
        handleElements();
      });
    });

    // 监听 DOM 变化
    const observer = new MutationObserver(() => handleElements());
    observer.observe(document.body, { childList: true, subtree: true });
  },
});
