import React from "react";
import "./index.css";

export const Switch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => {
  const id = "custom-switch-" + crypto.randomUUID();

  return (
    <div className="switch">
      <input id={props.id || id} type="checkbox" {...props} />
      <label htmlFor={props.id || id}>
        <span className="switch-txt" data-txt-on="On" data-txt-off="Off"></span>
      </label>
    </div>
  );
};
