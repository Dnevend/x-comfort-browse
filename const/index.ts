import { StorageItemKey } from "wxt/storage";

export const defaultBlur = 5;

export const Emoji = {
    BLUR: '👀',
    UN_BLUR: '🙈'
}

export const storageKeys: Record<'blur' | 'enable', StorageItemKey> = {
    blur: 'local:blur',
    enable: 'local:enable',
}

