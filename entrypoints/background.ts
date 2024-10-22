import { storageKeys, defaultBlur } from "../const";

export default defineBackground(() => {
  storage.defineItem(storageKeys.blur, { defaultValue: defaultBlur });

  console.log('Hello background!', { id: browser.runtime.id });
});
