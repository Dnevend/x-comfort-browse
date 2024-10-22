import { useEffect, useState } from "react";
import { storageKeys, defaultBlur } from "@/const";
import "./App.css";

function App() {
  const [blur, setBlur] = useState(defaultBlur);

  useEffect(() => {
    storage.getItem<number>(storageKeys.blur).then((v) => {
      setBlur(v ?? defaultBlur);
    });
  }, []);

  const handleSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setBlur(value);
    storage.setItem(storageKeys.blur, value);
  };

  return (
    <main>
      <div>
        <input id="enable" type="checkbox" />
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
