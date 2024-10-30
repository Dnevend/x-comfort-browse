import { storageKeys, defaultBlur, Options } from "@/const";
import { Option } from "@/const/type";

export const createButton = (id: string, event?: () => void) => {
    const button = document.createElement('button');
    button.textContent = '👀';
    button.style.position = 'absolute';
    button.style.zIndex = '8848';
    button.style.top = '5px';
    button.style.right = '5px';
    button.style.padding = '4px 12px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    button.style.border = 'none';
    button.style.borderRadius = '12px';
    button.style.cursor = 'pointer';
    button.id = id;
    button.onclick = () => event?.();

    return button;
};

export const getStorages = async () => {
    const options = await storage.getItem<Option[]>(storageKeys.options) ?? Options;
    const blur = await storage.getItem<number>(storageKeys.blur) ?? defaultBlur;
    const globalEnable = await storage.getItem<boolean>(storageKeys.enable) ?? false;

    return {
        options,
        blur,
        globalEnable
    };
}