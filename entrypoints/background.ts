import { storageKeys, defaultBlur } from "../const";

export default defineBackground(() => {
  storage.defineItem(storageKeys.blur, { defaultValue: defaultBlur });
  storage.defineItem(storageKeys.enable, { defaultValue: true });

  console.log('Hello background!', { id: browser.runtime.id });
});
