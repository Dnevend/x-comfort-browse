import { useEffect, useState } from "react";
import { storageKeys, defaultBlur, Options } from "@/const";
import { Switch } from "./components/Switch";
import { ExpandButton } from "./components/ExpandButton";
import "./App.css";
import { Option } from "@/const/type";

function App() {
  const [expand, setExpand] = useState(false);

  const [enable, setEnable] = useState(true);
  const [blur, setBlur] = useState(defaultBlur);
  const [options, setOptions] = useState<Option[]>(Options);

  useEffect(() => {
    const initConfig = async () => {
      const items = await storage.getItems([
        storageKeys.blur,
        storageKeys.enable,
        storageKeys.options,
      ]);
      setBlur(
        items.find((it) => it.key === storageKeys.blur)?.value ?? defaultBlur
      );
      setEnable(
        items.find((it) => it.key === storageKeys.enable)?.value ?? true
      );
      setOptions(
        items.find((it) => it.key === storageKeys.options)?.value ?? Options
      );
    };
    initConfig();
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

  const handleOptionsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: Option["id"]
  ) => {
    const index = options.findIndex((it) => it.id === id);
    const _options = [...options];
    _options[index].enable = e.target.checked;
    setOptions(_options);
    storage.setItem(storageKeys.options, _options);
  };

  return (
    <main>
      <strong>X-Comfort-Browser</strong>
      <p>
        <img src="/Bird.svg" className={`logo ${enable ? "on" : "off"}`} />
      </p>

      <Switch id="enable" checked={enable} onChange={handleEnableChange} />

      <div className="blur-input">
        <label htmlFor="blur">Blur(px)</label>
        <input id="blur" type="number" value={blur} onChange={handleSetting} />
      </div>

      <ExpandButton expanded={expand} onToggle={setExpand} />

      {expand && (
        <table
          cellPadding={5}
          cellSpacing={0}
          width={"100%"}
          style={{ marginTop: "8px" }}
        >
          {options.map((item) => (
            <tr style={{ borderBottom: "1px solid black" }}>
              <td style={{ textAlign: "left" }}>{item.name}</td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.enable}
                  onChange={(e) => {
                    handleOptionsChange(e, item.id);
                  }}
                />
              </td>
            </tr>
          ))}
        </table>
      )}
    </main>
  );
}

export default App;
