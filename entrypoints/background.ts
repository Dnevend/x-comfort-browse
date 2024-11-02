import { storageKeys, defaultBlur, Options } from "../const";

export default defineBackground(() => {

  browser.runtime.onInstalled.addListener(() => {
    storage.setItems([
      { key: storageKeys.blur, value: defaultBlur },
      { key: storageKeys.enable, value: true },
      { key: storageKeys.options, value: Options },
    ]);
  });

  console.log('Hello background!', { id: browser.runtime.id });
});
