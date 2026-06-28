"use client";

import React, { useState, useEffect } from "react";
import { templates } from "@/lib/templates";

let db = null;
let auth = null;
let firestoreModule = null;
let authModule = null;

const HAS_FIREBASE = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "placeholder" &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "";

export default function AdminDashboard() {
  // Theme state
  const [theme, setTheme] = useState("dark");

  // Sidebar / Section Navigation
  const [currentSection, setCurrentSection] = useState("websites"); // 'websites', 'templates', 'deployment'

  // Auth state
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Websites state
  const [websites, setWebsites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("login"); // 'login', 'list', 'edit'
  const [editorTab, setEditorTab] = useState("settings"); // 'settings', 'html', 'css', 'js'
  const [currentSite, setCurrentSite] = useState(null);
  const [isNewSite, setIsNewSite] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    subdomain: "",
    name: "",
    logoUrl: "",
    phone: "",
    whatsapp: "",
    address: "",
    html: "",
    css: "",
    js: "",
    status: "active",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Initialize Theme and Firebase
  useEffect(() => {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem("sb_theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }

    // 2. Firebase / Mock database check
    const initFirebase = async () => {
      try {
        if (HAS_FIREBASE) {
          const fb = await import("@/lib/firebase");
          db = fb.db;
          auth = fb.auth;
          firestoreModule = await import("firebase/firestore");
          authModule = await import("firebase/auth");
          setIsDemoMode(false);

          if (auth) {
            authModule.onAuthStateChanged(auth, (user) => {
              if (user) {
                setIsLoggedIn(true);
                setView("list");
                fetchWebsites(false);
              } else {
                setIsLoggedIn(false);
                setView("login");
              }
            });
          } else {
            console.error("Firebase Auth is null, falling back to Demo Mode");
            setIsDemoMode(true);
          }
        } else {
          setIsDemoMode(true);
          const mockUser = localStorage.getItem("sb_mock_session");
          if (mockUser) {
            setIsLoggedIn(true);
            setView("list");
            fetchWebsites(true);
          }
        }
      } catch (err) {
        console.error("Firebase init failed, falling back to Local DB:", err);
        setIsDemoMode(true);
      }
    };
    initFirebase();
  }, []);

  // Theme toggle helper
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("sb_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  // Fetch websites list
  const fetchWebsites = async (useMock = isDemoMode) => {
    if (useMock) {
      try {
        const res = await fetch("/api/websites");
        const data = await res.json();
        setWebsites(data);
      } catch (err) {
        console.error("Failed to load mock websites:", err);
      }
    } else {
      if (!db || !firestoreModule) return;
      try {
        const q = firestoreModule.query(firestoreModule.collection(db, "websites"));
        const querySnapshot = await firestoreModule.getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ subdomain: doc.id, ...doc.data() });
        });
        setWebsites(list);
      } catch (err) {
        console.error("Failed to fetch websites:", err);
      }
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (isDemoMode) {
      localStorage.setItem("sb_mock_session", "demo-admin");
      setIsLoggedIn(true);
      setView("list");
      fetchWebsites(true);
    } else {
      try {
        await authModule.signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setAuthError(err.message || "Invalid credentials. Ensure your project accounts are configured.");
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (isDemoMode) {
      localStorage.removeItem("sb_mock_session");
      setIsLoggedIn(false);
      setView("login");
    } else {
      try {
        await authModule.signOut(auth);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
  };

  // Google Drive Upload handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!formData.subdomain) {
      alert("Please fill in the Subdomain (e.g. greenshop) first, so we can organize files in a folder.");
      return;
    }

    setIsUploading(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);
    uploadForm.append("subdomain", formData.subdomain);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setFormData((prev) => ({ ...prev, logoUrl: data.url }));
        alert("Logo uploaded to Google Drive successfully! Image url linked.");
      } else {
        if (isDemoMode || response.status === 503) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setFormData((prev) => ({ ...prev, logoUrl: event.target.result }));
            alert("Using Mock Upload: File converted to Local Data URL successfully.");
          };
          reader.readAsDataURL(file);
        } else {
          alert("Upload failed: " + (data.error || "Unknown error. Check console."));
        }
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check logs.");
    } finally {
      setIsUploading(false);
    }
  };

  // Template applier
  const applyTemplate = (template) => {
    const replaceTags = (text) => {
      if (!text) return "";
      return text
        .replace(/\{\{BUSINESS_NAME\}\}/g, formData.name || "My Business")
        .replace(/\{\{LOGO_URL\}\}/g, formData.logoUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150")
        .replace(/\{\{WHATSAPP_NUMBER\}\}/g, formData.whatsapp || "919999999999")
        .replace(/\{\{PHONE\}\}/g, formData.phone || "9999999999")
        .replace(/\{\{ADDRESS\}\}/g, formData.address || "123 Market Street, Main City");
    };

    setFormData((prev) => ({
      ...prev,
      html: replaceTags(template.html),
      css: replaceTags(template.css),
      js: replaceTags(template.js),
    }));

    setEditorTab("html");
    alert(`Applied "${template.name}" template boilerplate. You can inspect the code in the HTML/CSS/JS tabs!`);
  };

  // Save Website record
  const handleSaveWebsite = async (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");

    const subClean = formData.subdomain.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!subClean) {
      alert("Invalid subdomain identifier.");
      setSaveStatus("");
      return;
    }

    const payload = {
      ...formData,
      subdomain: subClean,
      updatedAt: Date.now(),
    };

    if (isDemoMode) {
      try {
        if (isNewSite) {
          const res = await fetch("/api/websites");
          const localData = await res.json();
          if (localData.some((site) => site.subdomain === subClean)) {
            alert(`Subdomain "${subClean}" is already taken!`);
            setSaveStatus("");
            return;
          }
        }

        const response = await fetch("/api/websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to save mock website.");
        }

        setSaveStatus("Saved successfully!");
        fetchWebsites(true);
        setTimeout(() => {
          setView("list");
          setSaveStatus("");
        }, 1000);
      } catch (err) {
        console.error(err);
        setSaveStatus("Failed to save: " + err.message);
      }
    } else {
      try {
        const docRef = firestoreModule.doc(db, "websites", subClean);
        await firestoreModule.setDoc(docRef, payload);
        setSaveStatus("Saved to Firebase!");
        fetchWebsites(false);
        setTimeout(() => {
          setView("list");
          setSaveStatus("");
        }, 1000);
      } catch (err) {
        console.error(err);
        setSaveStatus("Failed to save: " + err.message);
      }
    }
  };

  // Delete website
  const handleDeleteWebsite = async (subdomain) => {
    if (!confirm(`Are you sure you want to delete "${subdomain}"?`)) return;

    if (isDemoMode) {
      try {
        const response = await fetch(`/api/websites?subdomain=${subdomain}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete website from local DB.");
        }
        fetchWebsites(true);
      } catch (err) {
        console.error("Delete failed:", err);
        alert(err.message);
      }
    } else {
      try {
        const docRef = firestoreModule.doc(db, "websites", subdomain);
        await firestoreModule.deleteDoc(docRef);
        fetchWebsites(false);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Open Editor
  const openEditor = (site = null) => {
    if (site) {
      setIsNewSite(false);
      setCurrentSite(site);
      setFormData({
        subdomain: site.subdomain,
        name: site.name || "",
        logoUrl: site.logoUrl || "",
        phone: site.phone || "",
        whatsapp: site.whatsapp || "",
        address: site.address || "",
        html: site.html || "",
        css: site.css || "",
        js: site.js || "",
        status: site.status || "active",
      });
    } else {
      setIsNewSite(true);
      setCurrentSite(null);
      setFormData({
        subdomain: "",
        name: "",
        logoUrl: "",
        phone: "",
        whatsapp: "",
        address: "",
        html: "",
        css: "",
        js: "",
        status: "active",
      });
    }
    setEditorTab("settings");
    setView("edit");
  };

  // Statistics Computations
  const totalSitesCount = websites.length;
  const activeSitesCount = websites.filter((w) => w.status === "active").length;
  const inactiveSitesCount = websites.filter((w) => w.status === "inactive").length;

  const filteredWebsites = websites.filter(
    (site) =>
      site.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.subdomain?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-layout">
      <div className="bg-gradient"></div>

      {/* ---------------- LOGIN STATE ---------------- */}
      {view === "login" && (
        <div className="auth-wrapper" style={{ width: "100%" }}>
          <div className="auth-card glass">
            <div className="auth-header">
              <h1>ShopBuilder Panel</h1>
              <p>Manage and host small shop websites easily</p>
              {isDemoMode && (
                <div style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", padding: "10px", borderRadius: "8px", fontSize: "12px", marginBottom: "20px", fontWeight: 600 }}>
                  ⚠️ Offline / Demo Mode (LocalStorage)
                </div>
              )}
            </div>
            <form onSubmit={handleLogin}>
              {!isDemoMode && (
                <>
                  <div className="form-group">
                    <label>Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@yourdomain.com"
                      className="input-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="input-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
              {authError && (
                <p style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "15px", textAlign: "left" }}>
                  {authError}
                </p>
              )}
              <button type="submit" className="btn btn-primary">
                {isDemoMode ? "Enter Admin Dashboard" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- SIDEBAR (Only visible when logged in) ---------------- */}
      {view !== "login" && isLoggedIn && (
        <aside className="sidebar">
          <div className="brand-area">
            <div className="brand-logo-icon">S</div>
            <div className="brand-text">
              <h2>ShopBuilder</h2>
              <span>Version 1.0.0</span>
            </div>
          </div>

          <nav className="nav-menu">
            <li>
              <button
                onClick={() => { setView("list"); setCurrentSection("websites"); }}
                className={`nav-item ${currentSection === "websites" && view === "list" ? "active" : ""}`}
              >
                📁 Client Websites
              </button>
            </li>
            <li>
              <button
                onClick={() => { setView("list"); setCurrentSection("templates"); }}
                className={`nav-item ${currentSection === "templates" && view === "list" ? "active" : ""}`}
              >
                🎨 Preset Templates
              </button>
            </li>
            <li>
              <button
                onClick={() => { setView("list"); setCurrentSection("deployment"); }}
                className={`nav-item ${currentSection === "deployment" && view === "list" ? "active" : ""}`}
              >
                🚀 Host on Vercel
              </button>
            </li>
          </nav>

          <div className="sidebar-footer">
            <div className="profile-info">
              <strong>Admin Portal</strong>
              <span>{isDemoMode ? "Offline DB" : "Firebase DB"}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-inline" style={{ padding: "8px 12px", fontSize: "12px" }}>
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* ---------------- MAIN CONTAINER ---------------- */}
      {view !== "login" && isLoggedIn && (
        <main className="main-content">
          {/* Top Navbar Header */}
          <header className="dashboard-header">
            <div className="header-title">
              {currentSection === "websites" && <h1>Websites Manager</h1>}
              {currentSection === "templates" && <h1>Preset Layouts</h1>}
              {currentSection === "deployment" && <h1>Vercel Deployment Guide</h1>}
            </div>
            <div className="header-actions">
              {currentSection === "websites" && view === "list" && (
                <button onClick={() => openEditor()} className="btn btn-primary btn-inline" style={{ padding: "8px 16px" }}>
                  ➕ Create New Website
                </button>
              )}
              {/* Theme Toggle Switch */}
              <button onClick={toggleTheme} className="theme-toggle-btn">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </header>

          {/* 1. SECTION: WEBSITES LIST VIEW */}
          {currentSection === "websites" && view === "list" && (
            <>
              {/* Statistics Grid */}
              <section className="stats-grid">
                <div className="stat-card glass">
                  <div className="stat-info">
                    <span>Total Shops</span>
                    <h2>{totalSitesCount}</h2>
                  </div>
                  <div className="stat-icon">📁</div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-info">
                    <span>Active Sites</span>
                    <h2>{activeSitesCount}</h2>
                  </div>
                  <div className="stat-icon">✅</div>
                </div>
                <div className="stat-card glass">
                  <div className="stat-info">
                    <span>Suspended</span>
                    <h2>{inactiveSitesCount}</h2>
                  </div>
                  <div className="stat-icon">⚠️</div>
                </div>
              </section>

              {/* Search Control */}
              <div style={{ marginBottom: "24px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search shop name or subdomain..."
                  className="input-control"
                  style={{ maxWidth: "400px" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Grid content */}
              {filteredWebsites.length === 0 ? (
                <div className="glass" style={{ padding: "60px", textAlignment: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>No client websites found. Let's create your first site!</p>
                  <button onClick={() => openEditor()} className="btn btn-primary btn-inline">
                    Create Website
                  </button>
                </div>
              ) : (
                <div className="sites-grid">
                  {filteredWebsites.map((site) => (
                    <div key={site.subdomain} className="site-card glass">
                      <span className={`site-badge ${site.status === "active" ? "badge-active" : "badge-inactive"}`}>
                        {site.status}
                      </span>
                      <div className="site-card-header">
                        <img 
                          src={site.logoUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150"} 
                          alt="shop logo" 
                          className="site-logo" 
                        />
                        <div className="site-info">
                          <h3>{site.name || "Unnamed Shop"}</h3>
                          <a href={`http://${site.subdomain}.localhost:3000`} target="_blank" rel="noopener noreferrer">
                            {site.subdomain}.yourdomain.xyz 🔗
                          </a>
                        </div>
                      </div>
                      <div className="site-card-body">
                        <div><strong>WhatsApp:</strong> {site.whatsapp || "Not set"}</div>
                        <div><strong>Phone:</strong> {site.phone || "Not set"}</div>
                        <div><strong>Address:</strong> {site.address || "Not set"}</div>
                      </div>
                      <div className="site-card-actions">
                        <button onClick={() => openEditor(site)} className="btn btn-secondary" style={{ padding: "8px", fontSize: "13px" }}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDeleteWebsite(site.subdomain)} className="btn btn-danger btn-inline" style={{ padding: "8px 16px", fontSize: "13px" }}>
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 2. SECTION: PRESET TEMPLATES PREVIEWS */}
          {currentSection === "templates" && view === "list" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                Browse our library of premium pre-built layouts. When you create or edit a client site, you can instantly apply these template configurations so they generate automatically without writing any code.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
                {templates.map((temp) => (
                  <div key={temp.id} className="glass" style={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ fontSize: "36px", marginBottom: "16px" }}>{temp.icon}</div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{temp.name}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", flexGrow: 1 }}>{temp.description}</p>
                    <button onClick={() => { openEditor(); setTimeout(() => applyTemplate(temp), 50); }} className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>
                      Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SECTION: VERCEL DEPLOYMENT CONFIGURATIONS */}
          {currentSection === "deployment" && view === "list" && (
            <div className="glass guide-container">
              <h2>Deploy Your Admin Panel to Vercel</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
                Deploy the workspace to Vercel and map wildcards to enable `subdomain.yourdomain.com` routing instantly.
              </p>

              <h3>Step 1: Push code to GitHub</h3>
              <p>Initialize git, commit all changes, and push your repository to your private/public GitHub account:</p>
              <pre>
{`git init
git add .
git commit -m "Launch ShopBuilder platform with Google Drive and Proxy routing"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main`}
              </pre>

              <h3>Step 2: Import into Vercel</h3>
              <ul>
                <li>Go to the <strong>Vercel Dashboard</strong> and click <strong>Add New &gt; Project</strong>.</li>
                <li>Import the GitHub repository you just pushed.</li>
                <li>Configure the <strong>Environment Variables</strong> matching your local settings before clicking deploy:</li>
              </ul>
              <pre>
{`NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBDFCqpZlwr9mOXtJvMs5pVJnN6D5E9kwA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = pkcreative-project2026.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = pkcreative-project2026
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = pkcreative-project2026.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 1022429307683
NEXT_PUBLIC_FIREBASE_APP_ID = 1:1022429307683:web:1d8e9749f5be7cf119e296

GOOGLE_DRIVE_CLIENT_EMAIL = your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_DRIVE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_DRIVE_PARENT_FOLDER_ID = your-parent-folder-id`}
              </pre>

              <h3>Step 3: Setup Wildcard Custom Subdomain</h3>
              <ul>
                <li>Once the project is deployed, go to <strong>Settings &gt; Domains</strong> in your Vercel Project.</li>
                <li>Add your custom domain as a wildcard. Enter: <strong><code>*.yourdomain.xyz</code></strong></li>
                <li>Go to your Domain DNS Provider (e.g. GoDaddy, Namecheap, Cloudflare) and create a <strong>CNAME record</strong>:
                  <ul>
                    <li>Type: <strong>CNAME</strong></li>
                    <li>Name/Host: <strong>*</strong></li>
                    <li>Target: <strong>cname.vercel-dns.com</strong></li>
                  </ul>
                </li>
              </ul>
            </div>
          )}

          {/* 4. MAIN CONTAINER EDITOR PANEL (Only when edit view) */}
          {view === "edit" && (
            <div className="editor-layout">
              {/* Left Column: Config settings form */}
              <form onSubmit={handleSaveWebsite} className="glass" style={{ padding: "28px" }}>
                <div className="panel-header">
                  <h2>1. Website Settings</h2>
                </div>

                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Green Grocery Hub"
                    className="input-control"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Subdomain (no spaces/symbols)</label>
                  <input
                    type="text"
                    required
                    disabled={!isNewSite}
                    placeholder="e.g. greenshop"
                    className="input-control"
                    value={formData.subdomain}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                  />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                    URL: <strong>{formData.subdomain || "subdomain"}.yourdomain.xyz</strong>
                  </span>
                </div>

                <div className="form-group">
                  <label>Upload Logo (Google Drive)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="input-control"
                  />
                  {isUploading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px", color: "var(--primary)" }}>
                      <div className="loading-spinner"></div> uploading file...
                    </div>
                  )}
                  {formData.logoUrl && (
                    <div className="upload-preview">
                      <img src={formData.logoUrl} alt="Logo preview" />
                      <div className="upload-details">
                        <p>Logo uploaded</p>
                        <span style={{ wordBreak: "break-all", fontSize: "10px" }}>{formData.logoUrl.substring(0, 40)}...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    className="input-control"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>WhatsApp Number (With Country Code)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919876543210"
                    className="input-control"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Shop Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop 42, Market Area, City"
                    className="input-control"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="input-control"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">Active (Online)</option>
                    <option value="inactive">Inactive / Suspended (Offline)</option>
                  </select>
                </div>

                <div style={{ marginTop: "30px", display: "flex", gap: "12px" }}>
                  <button type="submit" className="btn btn-primary">
                    {saveStatus || "Save Website"}
                  </button>
                  <button type="button" onClick={() => setView("list")} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>

              {/* Right Column: Code Editor tabs & Preset selection */}
              <div className="glass" style={{ padding: "28px", display: "flex", flexDirection: "column" }}>
                <div className="panel-header">
                  <h2>2. Code & Design Editor</h2>
                </div>

                {/* Tab select buttons */}
                <div className="tab-container">
                  <button
                    type="button"
                    className={`tab-btn ${editorTab === "settings" ? "active" : ""}`}
                    onClick={() => setEditorTab("settings")}
                  >
                    No-Code Presets
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${editorTab === "html" ? "active" : ""}`}
                    onClick={() => setEditorTab("html")}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${editorTab === "css" ? "active" : ""}`}
                    onClick={() => setEditorTab("css")}
                  >
                    CSS
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${editorTab === "js" ? "active" : ""}`}
                    onClick={() => setEditorTab("js")}
                  >
                    JavaScript
                  </button>
                </div>

                {/* Preset layouts tab */}
                {editorTab === "settings" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p style={{ fontStyle: "italic", fontSize: "13px", color: "var(--text-muted)" }}>
                      Choose a preset theme. This will automatically compile and insert beautiful layouts using your general settings (business name, logo, phone, whatsapp, address) above.
                    </p>
                    <div className="template-grid">
                      {templates.map((temp) => (
                        <div
                          key={temp.id}
                          className="template-option glass"
                          onClick={() => applyTemplate(temp)}
                        >
                          <span className="template-icon">{temp.icon}</span>
                          <strong>{temp.name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HTML Textarea */}
                {editorTab === "html" && (
                  <div className="form-group" style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                    <label>HTML Layout Code</label>
                    <textarea
                      className="input-control code-textarea"
                      style={{ flexGrow: 1 }}
                      value={formData.html}
                      onChange={(e) => setFormData((prev) => ({ ...prev, html: e.target.value }))}
                      placeholder="<!-- Custom HTML content structure -->"
                    ></textarea>
                  </div>
                )}

                {/* CSS Textarea */}
                {editorTab === "css" && (
                  <div className="form-group" style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                    <label>CSS Styling Stylesheet</label>
                    <textarea
                      className="input-control code-textarea"
                      style={{ flexGrow: 1 }}
                      value={formData.css}
                      onChange={(e) => setFormData((prev) => ({ ...prev, css: e.target.value }))}
                      placeholder="/* Custom CSS styling rules */"
                    ></textarea>
                  </div>
                )}

                {/* JS Textarea */}
                {editorTab === "js" && (
                  <div className="form-group" style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                    <label>JavaScript Client Logics</label>
                    <textarea
                      className="input-control code-textarea"
                      style={{ flexGrow: 1 }}
                      value={formData.js}
                      onChange={(e) => setFormData((prev) => ({ ...prev, js: e.target.value }))}
                      placeholder="// Custom JavaScript behaviors and triggers"
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
