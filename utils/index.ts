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
    const config = await storage.getItems([storageKeys.options, storageKeys.blur, storageKeys.enable]);

    const options = config.find(it => it.key === storageKeys.options)?.value ?? Options;
    const blur = config.find(it => it.key === storageKeys.blur)?.value ?? defaultBlur;
    const enable = config.find(it => it.key === storageKeys.enable)?.value ?? false;

    return {
        options,
        blur,
        enable
    };
}

export const getEnable = async (id: Option['id']) => {
    const globalEnable = await storage.getItem<boolean>(storageKeys.enable) ?? false;
    const options = await storage.getItem<Option[]>(storageKeys.options) ?? Options;
    return globalEnable && (options.find(it => it.id === id)?.enable ?? false);
}