import React, { useState } from "react";
import MenuContainer from "./MenuContainer";
import SettingsIcon from "@mui/icons-material/Settings";
import LanguageIcon from "@mui/icons-material/Language";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import StorageIcon from "@mui/icons-material/Storage";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

function SettingsMenu({ onClose }) {
  const [activeCategory, setActiveCategory] = useState("appearance");
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [autoSync, setAutoSync] = useState(true);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleAutoSyncToggle = () => {
    setAutoSync(!autoSync);
  };

  const handleClearCache = () => {
    if (window.confirm("Are you sure you want to clear the cache? This action cannot be undone.")) {
      localStorage.clear();
      alert("Cache cleared successfully.");
    }
  };

  const categories = [
    { id: "appearance", label: "Appearance", icon: BrightnessHighIcon },
    { id: "language", label: "Language", icon: LanguageIcon },
    { id: "data", label: "Data", icon: StorageIcon },
    { id: "about", label: "About", icon: InfoIcon },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case "appearance":
        return (
          <div className="settings_content_section">
            <h3>Appearance</h3>
            <div className="settings_group">
              <label className="settings_label">Theme</label>
              <select
                className="settings_select"
                value={theme}
                onChange={handleThemeChange}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
        );
      case "language":
        return (
          <div className="settings_content_section">
            <h3>Language</h3>
            <div className="settings_group">
              <label className="settings_label">Language</label>
              <select
                className="settings_select"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        );
      case "data":
        return (
          <div className="settings_content_section">
            <h3>Data</h3>
            <div className="settings_group">
              <label className="settings_checkbox_label">
                <input
                  type="checkbox"
                  className="settings_checkbox"
                  checked={autoSync}
                  onChange={handleAutoSyncToggle}
                />
                <span>Auto-sync on startup</span>
              </label>
            </div>
            <button className="settings_button clear_cache_btn" onClick={handleClearCache}>
              Clear Cache
            </button>
          </div>
        );
      case "about":
        return (
          <div className="settings_content_section">
            <h3>About</h3>
            <div className="settings_info">
              <p>GameLib v1.0.0</p>
              <p className="settings_info_secondary">Your personal game library manager</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MenuContainer className="settings_container" onClose={onClose}>
      <div className="settings_menu">
        <header className="settings_header">
          <SettingsIcon className="settings_icon" />
          <h2>Settings</h2>
        </header>

        <div className="settings_main">
          {/* Sidebar */}
          <aside className="settings_sidebar">
            <nav className="settings_nav">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`settings_nav_item ${
                      activeCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <IconComponent className="nav_icon" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="settings_content">{renderContent()}</div>
        </div>

        <footer className="settings_footer">
          <button className="settings_close_button" onClick={onClose}>
            <CloseIcon fontSize="small" /> Close
          </button>
        </footer>
      </div>
    </MenuContainer>
  );
}

export default SettingsMenu;
