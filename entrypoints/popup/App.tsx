import { useEffect, useState } from "react";
import { storageKeys, defaultBlur } from "@/const";
import "./App.css";

function App() {
  const [enable, setEnable] = useState(true);
  const [blur, setBlur] = useState(defaultBlur);

  useEffect(() => {
    storage.getItem<number>(storageKeys.blur).then((v) => {
      setBlur(v ?? defaultBlur);
    });
    storage.getItem<boolean>(storageKeys.enable).then((v) => {
      setEnable(v ?? true);
    });
  }, []);

  const handleEnableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnable(e.target.checked);
    storage.setItem(storageKeys.enable, e.target.checked);
  };

  const handleSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBlur(value);
    storage.setItem(storageKeys.blur, value);
  };

  return (
    <main>
      <div>
        <input
          id="enable"
          type="checkbox"
          checked={enable}
          onChange={handleEnableChange}
        />
        <label htmlFor="enable" style={{ fontWeight: "bold" }}>
          X-Comfort-Browse
        </label>
      </div>

      <div style={{ marginTop: "16px" }}>
        <label htmlFor="blur">Blur(px)</label>
        <input id="blur" type="number" value={blur} onChange={handleSetting} />
      </div>
    </main>
  );
}

export default App;
