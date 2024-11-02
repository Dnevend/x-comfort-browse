import { Emoji } from "@/const";
import { createButton, getEnable, getStorages } from "@/utils";

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
    '[data-testid="collection-hero-image"]',
    // 文章封面
    '[data-testid="article-cover-image"]',
    // 视频小卡片
    '[data-testid="card.layoutSmall.media"]'
];

export async function handleElements() {
    const { blur } = await getStorages();
    const enable = await getEnable('twitter');

    selectors.forEach((selector) => {
        let elements: HTMLElement[] = Array.from(document.querySelectorAll(selector));

        elements.forEach((element) => {
            let current = element;
            let hasBlur = false;

            while (current.parentElement !== null) {
                current = current.parentElement;
                if (current.matches(selectors.join(','))) {
                    hasBlur = true;
                    break;
                }
            }

            // 如果已经存在模糊遮罩
            if (hasBlur) return;

            let comfortId = element.getAttribute('data-comfort-id');

            if (!comfortId) {
                comfortId = crypto.randomUUID();
                element.setAttribute('data-comfort-id', comfortId);
                const button = createButton(comfortId);

                // 更新按钮点击事件
                button.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const newStatus = !statusMap.get(comfortId!);

                    statusMap.set(comfortId!, newStatus);

                    if (newStatus) {
                        element.style.filter = `blur(${blur}px)`;
                        button.innerText = Emoji.BLUR;
                    } else {
                        element.style.filter = 'none';
                        button.innerText = Emoji.UN_BLUR;
                    }
                };

                element.parentElement?.insertBefore(button, element);
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
                toggleButton.innerText = Emoji.BLUR;
            }

            if (!blurStatus && targetElement.style.filter !== 'none') {
                targetElement.style.filter = 'none';
                toggleButton.innerText = Emoji.UN_BLUR;
            }
        });
    });
}

export async function removeAdvertise() {
    const enable = await getEnable('twitter');
    if (!enable) return;

    const spans = document.querySelectorAll('div>span:first-child:last-child')
    for (const span of spans) {
        if (
            span.childElementCount > 0 ||
            span.firstChild?.nodeType !== Node.TEXT_NODE ||
            !span.firstChild.nodeValue ||
            !/^(Ad|推荐)$/.test(span.firstChild.nodeValue)
        ) {
            continue;
        }
        const article = span.closest('article');
        if (article) {
            article.style.color = '#00000025';
            article.innerText = 'Hidden by X-Comfort-Browser.';
        }
    }
}