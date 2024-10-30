import { storageKeys, defaultBlur, Options } from "../const";

export default defineBackground(() => {
  storage.defineItem(storageKeys.blur, { defaultValue: defaultBlur });
  storage.defineItem(storageKeys.enable, { defaultValue: true });
  storage.defineItem(storageKeys.options, { defaultValue: Options });

  console.log('Hello background!', { id: browser.runtime.id });
});
