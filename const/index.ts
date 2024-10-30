import { StorageItemKey } from "wxt/storage";
import { Option } from "./type";

export const defaultBlur = 5;

export const Emoji = {
    BLUR: '👀',
    UN_BLUR: '🙈'
}

export const Options: Option[] = [
    {
        id: 'twitter',
        name: 'X(Twitter)',
        enable: true
    },
    {
        id: 'zhihu',
        name: '知乎',
        enable: true
    }
]

export const storageKeys: Record<'blur' | 'enable' | 'options', StorageItemKey> = {
    blur: 'local:blur',
    enable: 'local:enable',
    options: 'local:options'
}

