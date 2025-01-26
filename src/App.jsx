import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import logo from "./Logo.png";
import search from "./W.png";

const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownStates, setDropdownStates] = useState({});
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(
          "https://cloud.codesupply.co/endpoint/react/data.json"
        );
        setArticles(response.data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const toggleDropdown = (key) => {
    setDropdownStates((prev) => {
      // Close all other dropdowns when opening a new one
      const newStates = Object.keys(prev).reduce((acc, k) => {
        acc[k] = k === key ? !prev[k] : false;
        return acc;
      }, {});
      
      // Ensure the clicked dropdown toggles
      if (!prev[key]) {
        newStates[key] = true;
      }
      
      return newStates;
    });
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-button"
          >
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </button>

          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>

          <div className="search-container">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="search-button"
            >
              <img src={search} alt="Search" className="search-icon" />
            </button>
            {isSearchOpen && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                placeholder="Search..."
              />
            )}
          </div>
        </div>

        <nav className="desktop-nav">
          {["Post", "Features", "Categories", "Shop", "Buy Now"].map((item, index) => (
            <div key={index} className="relative dropdown-container">
              <button
                onClick={() => toggleDropdown(item)}
                className="nav-dropdown-button"
              >
                {item}
                <svg
                  className={`dropdown-icon ${
                    dropdownStates[item] ? "open" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              {dropdownStates[item] && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <a href="#">Option 1</a>
                    </li>
                    <li>
                      <a href="#">Option 2</a>
                    </li>
                    <li>
                      <a href="#">Option 3</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <img src={logo} alt="Logo" className="mobile-logo" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="mobile-close-button"
            >
              &times;
            </button>
          </div>
          <nav className="mobile-nav">
            {["Post", "Features", "Categories", "Shop", "Buy Now"].map(
              (item, index) => (
                <div key={index} className="mobile-nav-item">
                  <button
                    onClick={() => toggleDropdown(item)}
                    className="mobile-dropdown-button"
                  >
                    {item}
                    <svg
                      className={`mobile-dropdown-icon ${
                        dropdownStates[item] ? "open" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  {dropdownStates[item] && (
                    <div className="mobile-dropdown-content">
                      <div className="mobile-dropdown-options">
                        <a href="#">Option 1</a>
                        <a href="#">Option 2</a>
                        <a href="#">Option 3</a>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </nav>
        </div>
      )}

      <main className="articles-container">
        <div className="articles-grid">
          {filteredArticles.map((article, index) => (
            <article key={index} className="article-card">
              <img
                src={article.img}
                srcSet={`${article.img} 1x, ${article.img_2x} 2x`}
                alt={article.title}
                className="article-image"
              />
              <div className="article-content">
                <span className="article-category">{article.tags}</span>
                <h2 className="article-title">{article.title}</h2>
                <p className="article-meta">
                  {article.autor} - {article.date} - {article.views} Views
                </p>
                <p className="article-text">{article.text}</p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;