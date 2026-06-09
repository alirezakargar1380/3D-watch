"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, Slider, Paper, TextField, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Helper Functions for Color Conversion ---
function hsvToRgb(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s), v: Math.round(v) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// --- Styled Components ---
const BaseSlider = styled(Slider)({
    padding: "0px",
    height: 28,
    borderRadius: 0,
    "& .MuiSlider-track": {
        border: "none",
        backgroundColor: "transparent",
    },
    "& .MuiSlider-rail": {
        opacity: 1,
        height: "100%",
        borderRadius: 0,
    },
    "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "transparent",
        border: "2px solid #fff",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
            boxShadow: "0px 2px 8px rgba(0,0,0,0.5)",
        },
    },
});

interface ColorPickerProps {
    onChange?: (rgbaColor: string) => void;
}

export default function CustomColorPicker({ onChange }: ColorPickerProps) {
    const [color, setColor] = useState({ h: 315, s: 75, v: 85, a: 0.7 });
    const [hexInput, setHexInput] = useState("");

    const saturationRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const { r, g, b } = hsvToRgb(color.h, color.s, color.v);
    const rgbaString = `rgba(${r}, ${g}, ${b}, ${color.a})`;

    // Sync state upward when color updates
    useEffect(() => {
        if (onChange) onChange(rgbToHex(r, g, b));
    }, [rgbaString]);

    // Sync internal HEX string input when sliders move
    useEffect(() => {
        setHexInput(rgbToHex(r, g, b));
    }, [r, g, b]);

    // Handle typing inside the HEX field
    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
        setHexInput(val);

        // If it's a complete valid hex value, parse it and update sliders
        if (val.length === 3 || val.length === 6) {
            const rgb = hexToRgb(val);
            if (rgb) {
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                setColor((prev) => ({ ...prev, ...hsv }));
            }
        }
    };

    // Handle 2D Saturation/Value pad drag actions
    const updateSaturationValue = (clientX: number, clientY: number) => {
        if (!saturationRef.current) return;
        const rect = saturationRef.current.getBoundingClientRect();

        let x = clientX - rect.left;
        let y = clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const s = Math.round((x / rect.width) * 100);
        const v = Math.round(100 - (y / rect.height) * 100);

        setColor((prev) => ({ ...prev, s, v }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        updateSaturationValue(e.clientX, e.clientY);
        window.addEventListener("mousemove", handleGlobalMouseMove);
        window.addEventListener("mouseup", handleGlobalMouseUp);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        updateSaturationValue(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleGlobalMouseMove);
            window.removeEventListener("mouseup", handleGlobalMouseUp);
        };
    }, []);

    return (
        <Paper
            elevation={4}
            style={{
                background: 'transparent',
                boxShadow: 'none'
            }}
            sx={{
                width: 280,
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                padding: 2
            }}
        >
            {/* 1. Saturation & Value 2D Box */}
            <Box component={'div'}
                ref={saturationRef}
                onMouseDown={handleMouseDown}
                sx={{
                    width: "100%",
                    height: 220,
                    position: "relative",
                    cursor: "crosshair",
                    userSelect: "none",
                    borderRadius: 1.5,
                    background: `
                        linear-gradient(to top, #000000, transparent),
                        linear-gradient(to right, #ffffff, hsl(${color.h}, 100%, 50%))
                    `,
                }}
            >
                <Box component={'div'}
                    sx={{
                        position: "absolute",
                        left: `${color.s}%`,
                        top: `${100 - color.v}%`,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: "2px solid #ffffff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            {/* 2. Hue Strip Slider */}
            <BaseSlider
                min={0}
                max={360}
                value={color.h}
                onChange={(_, val) => setColor((prev) => ({ ...prev, h: val as number }))}
                sx={{
                    "& .MuiSlider-rail": {
                        borderRadius: 1,
                        background:
                            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                    },
                }}
            />

            {/* 3. Alpha / Transparency Slider */}
            {/* <BaseSlider
                min={0}
                max={1}
                step={0.01}
                value={color.a}
                onChange={(_, val) => setColor((prev) => ({ ...prev, a: val as number }))}
                sx={{
                    "& .MuiSlider-rail": {
                        borderRadius: 1,
                        backgroundImage: `
                            linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%),
                            linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%),
                            linear-gradient(45deg, #e0e0e0 25%, #ffffff 25%, #ffffff 75%, #e0e0e0 75%)
                        `,
                        backgroundSize: "100% 100%, 12px 12px, 12px 12px",
                        backgroundPosition: "0 0, 0 0, 6px 6px",
                    },
                }}
            /> */}

            {/* 4. HEX Input Section */}
            <Box component={'div'} sx={{ p: 2, display: "flex", justifyContent: "center", borderTop: "1px solid #f0f0f0" }}>
                <TextField
                    size="small"
                    label="HEX"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    variant="outlined"
                    //   slotProps={{
                    //     input: {
                    //       startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    //       sx: { 
                    //         fontFamily: "monospace", 
                    //         fontWeight: "bold", 
                    //         textTransform: "uppercase",
                    //         letterSpacing: "1px"
                    //       }
                    //     }
                    //   }}
                    sx={{ width: "130px" }}
                />
            </Box>
        </Paper>
    );
}