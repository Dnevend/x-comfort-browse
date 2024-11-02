import { Emoji } from "@/const";
import { createButton, getStorages, getEnable } from "@/utils";

const statusMap = new Map<string, boolean>();

const selectors = [
    '.RichContent img',
    '.ZVideoItem-video>div'
]

export async function handleElements() {
    const { blur } = await getStorages();
    const enable = await getEnable('zhihu');

    const elements: HTMLElement[] = Array.from(document.querySelectorAll(selectors.join(',')))

    elements.forEach((element) => {

        if (Number(element.getBoundingClientRect().width) < 100) return;

        let comfortId = element.getAttribute('data-comfort-id');

        if (!comfortId) {
            comfortId = crypto.randomUUID();
            element.setAttribute('data-comfort-id', comfortId);
            element.parentElement!.style.position = 'relative';
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
}

export async function removeAdvertise() {
    const enable = await getEnable('zhihu');
    if (!enable) return;

    const elements: HTMLElement[] = [
        ...Array.from(document.querySelectorAll('.Pc-feedAd-container')) as HTMLElement[],
        ...Array.from(document.querySelectorAll('[alt="广告"]')) as HTMLElement[],
    ]

    elements.forEach((element) => {
        if (element.tagName === 'IMG') {
            element.parentElement!.style.color = '#00000025';
            element.parentElement?.replaceChild(document.createTextNode('Hidden by X-Comfort-Browser.'), element);
        } else {
            element.innerText = 'Hidden by X-Comfort-Browser.';
        }
    })
}
