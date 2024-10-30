import { useEffect, useState } from "react";
import "./index.css";

export const ExpandButton = ({
  expanded,
  onToggle,
}: {
  expanded?: boolean;
  onToggle?: (expand: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded ?? false);

  useEffect(() => {
    setIsExpanded(expanded ?? false);
  }, [expanded]);

  return (
    <div
      role="button"
      className="expand"
      onClick={() => {
        const status = !isExpanded;
        setIsExpanded(status);
        onToggle?.(status);
      }}
      style={{ rotate: isExpanded ? "180deg" : "0deg" }}
    >
      <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="12190"
        width="38"
        height="38"
      >
        <path
          d="M516.209778 566.897778L657.066667 426.097778a28.444444 28.444444 0 1 1 40.220444 40.220444l-160.881778 160.938667a28.330667 28.330667 0 0 1-40.220444 0L335.189333 466.318222A28.444444 28.444444 0 1 1 375.466667 426.097778l140.743111 140.8z"
          fill="#5A6677"
          p-id="12191"
        ></path>
      </svg>
    </div>
  );
};
