import React from "react";

type RoundedColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  size?: number;
};

export const RoundedColorPicker: React.FC<RoundedColorPickerProps> = ({
  value,
  onChange,
  size = 40,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
      }}
    >
      {/* Visible rounded preview */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: value,
          border: "2px solid #e0e0e0",
          cursor: "pointer",
        }}
      />

      {/* Hidden native color input */}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: "pointer",
        }}
      />
    </div>
  );
};