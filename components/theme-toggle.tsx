"use client";

import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme, type Theme } from "./theme-provider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  if (!mounted) {
    return (
      <div className="theme-toggle-skeleton" aria-hidden="true" style={{ width: 34, height: 34 }} />
    );
  }

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div className="theme-toggle-container" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        className="theme-toggle-btn"
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <CurrentIcon size={17} className="theme-toggle-icon" />
        {!compact && <span className="theme-current-label">{theme}</span>}
      </button>

      {menuOpen && (
        <div className="theme-dropdown animate-popover" role="menu">
          <div className="theme-dropdown-header">Appearance</div>
          <div className="theme-options-grid">
            {options.map(({ value, label, icon: Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  className={`theme-option-btn ${active ? "active" : ""}`}
                  onClick={() => {
                    setTheme(value);
                    setMenuOpen(false);
                  }}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

