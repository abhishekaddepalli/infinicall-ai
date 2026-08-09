(function () {
  "use strict";

  // Embedded search index with content from all documentation pages
  const SEARCH_INDEX = [
    {
      url: "index.html",
      title: "Introduction",
      content:
        "Pixel AI Advanced AI Content & Image Generation Platform Overview. Built on a modular architecture using Next.js 16 and Node.js for maximum scalability. Integrates seamlessly with GPT-4, Claude 3.5, and Gemini Pro for nuanced dialogue and high-fidelity text generation. Creative Suite features include professional-grade article writing and DALL-E 3/Stable Diffusion image generation. Developer Tools integrate a smart code assistant and AI content detector. Document Intelligence allows users to upload and chat with PDF, Docx, and CSV files. Social Automation schedules and manages posts across Instagram, Facebook, and LinkedIn. Enterprise Control via a robust Admin Dashboard with User management, RBAC, and system-wide configurations for scaling AI businesses.",
    },
    {
      url: "prerequisite.html",
      title: "Prerequisite",
      content:
        "Technical Prerequisites and System Requirements for Pixel AI. Requires Node.js version 18.0.0 or higher and npm/yarn package managers. Database requires MongoDB version 5.0 or higher (local instance or MongoDB Atlas). Modern web browser support for Chrome, Firefox, Safari, and Edge. Essential AI Provider API Keys: OpenAI (GPT-4o/DALL-E), Anthropic (Claude), Google (Gemini), and Stability AI for image generation. Storage solutions include AWS S3, Cloudinary, or local filesystem storage. Deployment requirements for VPS hosting (Ubuntu 20.04+) or Vercel cloud hosting. Domain configuration with SSL/TLS certificates for secure HTTPS connections and Socket.io support.",
    },
    {
      url: "overview.html",
      title: "Installation Overview",
      content:
        "Pixel AI Installation Roadmap and Project Architecture. Comprehensive guide for setting up the three primary components: API Backend, Frontend Application, and Admin Panel. Detailed folder structure breakdown: autocall-api for Node.js logic, autocall-frontend for Next.js 16 UI, and autocall-admin for the management module. Sequential setup process: Verify prerequisites, download and extract package, configure .env environment variables, install dependencies using npm install, and launch servers. Overview of global configuration files and security best practices for initial setup.",
    },
    {
      url: "frontend-installation.html",
      title: "Frontend Installation",
      content:
        "Next.js 16 Frontend Installation Guide. Detailed steps for setting up the client-side application. Environment Configuration: Creating the .env file with NEXT_PUBLIC_API_URL for backend communication and NEXT_PUBLIC_SOCKET_URL for real-time features. Dependency Management: Running npm install to fetch React, Tailwind CSS, and Framer Motion packages. Development Workflow: Launching the local server with npm run dev. Production Readiness: Building the optimized bundle with npm run build. Troubleshooting common frontend issues like hydration errors, environment variable caching, and API connectivity problems.",
    },
    {
      url: "backend-local-server.html",
      title: "Backend Local Server",
      content:
        "Backend Local Installation for Node.js and Express. Configuration of the .env file including MONGODB_URI connection strings, JWT_SECRET for authentication, and server PORT (default 5000). MongoDB setup: Instructions for local service startup or cloud Atlas connection. dependency installation: npm install for Express, Mongoose, and Socket.io. Server Execution: Running the application using nodemon or npm run dev for auto-reloading. API Endpoint testing and server health verification. Handling CORS issues and database indexing for performance.",
    },
    {
      url: "backend-live-server.html",
      title: "Backend Live Server",
      content:
        "Deploying the Pixel AI Backend to a Production Live Server. PM2 Lifecycle Management: Using pm2 start, pm2 restart, and pm2 logs to manage persistent Node.js processes. Nginx Reverse Proxy: Detailed configuration for port forwarding (80/443 to 5000). SSL/TLS Encryption: Implementation of Let's Encrypt with Certbot for secure HTTPS. Production .env hardening: Setting NODE_ENV=production and securing sensitive keys. Monitoring logs, memory usage, and CPU performance. Security hardening with firewall (ufw) rules and rate limiting.",
    },
    {
      url: "deployment-vercel.html",
      title: "Vercel Deployment",
      content:
        "Step-by-step guide for deploying the Next.js 16 Frontend on Vercel. Connecting GitHub/GitLab repositories for CI/CD. Dashboard Configuration: Adding production environment variables for API and Socket.io URLs. Build Settings: Configuring output directories and framework presets. Custom Domain Integration: Setting up CNAME and A records for branding. Vercel Edge Functions: Overview of performance optimizations. Automatic deployments on every push and preview deployments for pull requests.",
    },
    {
      url: "deployment-vps.html",
      title: "VPS Deployment",
      content:
        "Virtual Private Server (VPS) Deployment Masterclass for Ubuntu 20.04/22.04. Initial server setup: SSH access, user permissions, and package updates. Software Stack: Installing Node.js via NVM, MongoDB, and Nginx. Application deployment: Cloning repositories, environment setup, and PM2 process management. Nginx Load Balancing: Configuring sites-available and sites-enabled. SSL Integration: Certbot installation for automated certificate renewals. Firewall configuration (ufw allow 80/443) and systemd autostart for PM2 (pm2 startup).",
    },
    {
      url: "ai-features.html",
      title: "AI Tools Explorer",
      content:
        "Detailed Encyclopedia of Pixel AI Core Capabilities. AI Writer: 50+ specialized modules for blogs, SEO ads, and social content with automatic logging. AI Code Assistant: Generates high-quality code across 10+ languages with smart history. Speech to Text: High-accuracy transcription powered by OpenAI Whisper v3. ] Re-Writer: Reshapes content with regeneration and export options. AI Detection & Plagiarism: Visual summaries of Human vs. AI writing with percentage reports. AI File Chat: Question-answering over PDF, Docx, and CSV files. AI Presentation: Creates slide decks in seconds with premium themes Pearl and Vortex. Article Writer: 5-step guided SEO workflow from concept to final draft.",
    },

    {
      url: "marketing-bot-overview.html",
      title: "Campaign Hub Overview",
      content:
        "Comprehensive Campaign Hub Features and Lead Generation. Multi-channel reach across Email, WhatsApp, and Telegram. Bulk messaging capabilities with lead segmentation. Automation workflows for follow-ups and engagement tracking. Centralized marketing dashboard for monitoring conversion funnels and platform reach. Integration with inner CRM contacts for targeted campaigns. Scaling your reach with AI-driven marketing strategies.",
    },

    {
      url: "admin-user-management.html",
      title: "Admin User Management",
      content:
        "Super Admin Control over Registered Users. Searchable User Table: View email, subscription plan, and registration date. Account Actions: Toggle status (Active/Inactive), trigger password resets, and view granular credit balances for each AI module. User Activity Monitoring: Track login history and device usage. Bulk Export: Download user lists for external CRM sync. Managing suspended users and handling manual plan overrides.",
    },
    {
      url: "admin-role-management.html",
      title: "Role Management (RBAC)",
      content:
        "Role-Based Access Control (RBAC) and System Security. Create and customize roles (e.g., Moderator, Support, Content Manager). Permissions Editor: Granular control over View, Create, Edit, and Delete rights for every documentation module. Assigning roles to administrative staff to maintain platform security. Audit Logs: Track who made changes to system configurations and roles. Ensuring least privilege security architecture.",
    },
    {
      url: "admin-plans.html",
      title: "Subscription & Billing Plans",
      content:
        "Monetization and Feature Gate Management. Plan Builder: Create Free, Bronze, Silver, and Gold tiers with specific pricing. Credit Allocation: Define monthly credit limits for AI Writer, Content Analysis, and Article generation. Feature Limits: Enable/Disable specific modules (Social Suite, Campaign Hub) per plan. Stripe and PayPal integration settings for automated billing and renewal cycles. Plan duration management (Monthly vs Yearly).",
    },
    {
      url: "admin-faq.html",
      title: "FAQ & Help Center Management",
      content:
        "Admin Module for Creating a User-Facing Knowledge Base. Categorization: Organize help articles into logical categories (Installation, Billing, Features). Content Editor: Rich text support for detailed question and answer creation. Visibility: Toggle FAQs between Draft and Published status. SEO-friendly slugs for every FAQ entry. User engagement tracking: Monitoring which help articles are most viewed to improve support content.",
    },
    {
      url: "admin-pages.html",
      title: "Dynamic Pages CMS",
      content:
        "Managing Custom System Pages and Legal Content. Create SEO-optimized pages like Privacy Policy, GDPR Compliance, and Terms of Service. Page Architecture: Custom slugs, meta titles, and descriptions for search engine indexing. Full-featured WYSIWYG editor for rich content creation. Page Status: Draft, Publish, or Archive pages. Custom templates support for landing pages and information-heavy documentation.",
    },
    {
      url: "admin-settings.html",
      title: "Global System Settings",
      content:
        "The Control Center for Pixel AI Branding and Operations. General Info: Manage app name, SEO descriptions, and maintenance modes. Resource Limits: Set global hard limits (MB) for Image, Video, and Document uploads. Credit Configuration: Detailed economy setup for AI consumption costs per action. Branding Suite: Upload Light/Dark logos, sidebars, and Favicons. SMTP Configuration: Host, Port, and Credential setup for system emails and OTP delivery. Localization: Manage multiple languages and translation locale files.",
    },
    {
      url: "technologies.html",
      title: "Technologies & Engineering Stack",
      content:
        "Deep Dive into the Pixel AI Technical Architecture. Frontend: Built with Next.js 16, React, Tailwind CSS, Framer Motion, and Redux Toolkit for state management. Backend: Powered by Node.js, Express, and MongoDB with Socket.io for real-time bidirectional communication. AI Engines: Deep integration with OpenAI GPT models, Anthropic Claude, Google Gemini, and Stable Diffusion via official APIs. UI Components: Styled with Bootstrap 5 and Lucide Icons for a premium interface.",
    },
  ];

  /**
   * Initialize search functionality
   */
  function initSearch() {
    const searchInput = document.querySelector(
      '.home-search input[type="search"]',
    );
    const searchContainer = document.querySelector(".home-search");

    if (!searchInput || !searchContainer) return;

    // Create results container
    const resultsContainer = createResultsContainer();
    searchContainer.appendChild(resultsContainer);

    // Search input event
    let searchTimeout;

    // Populate search input from URL if present
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    if (queryParam) {
      searchInput.value = queryParam;
    }

    searchInput.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length === 0) {
        removeHighlights();
        hideResults(resultsContainer);
        // Clean URL
        const url = new URL(window.location);
        url.searchParams.delete("q");
        window.history.replaceState({}, "", url);
        return;
      }

      if (query.length < 2) {
        hideResults(resultsContainer);
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, resultsContainer);
      }, 300);
    });

    // Close results when clicking outside
    document.addEventListener("click", function (e) {
      if (!searchContainer.contains(e.target)) {
        hideResults(resultsContainer);
      }
    });

    // Prevent closing when clicking inside results
    resultsContainer.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  /**
   * Create results container element
   */
  function createResultsContainer() {
    const container = document.createElement("div");
    container.className = "search-results-container";
    container.style.display = "none";
    return container;
  }

  /**
   * Perform search across all indexed pages
   */
  function performSearch(query, resultsContainer) {
    const results = searchInIndex(query);

    if (results.length === 0) {
      showNoResults(resultsContainer, `No results found for "${query}"`);
    } else {
      displayResults(results, query, resultsContainer);
    }
  }

  /**
   * Search through the index
   */
  function searchInIndex(query) {
    const results = [];
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);

    // If query is too short, return empty
    if (normalizedQuery.length < 1) {
      return results;
    }

    SEARCH_INDEX.forEach((page) => {
      // Normalize content (case-insensitive)
      const searchText = (page.title + " " + page.content)
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ");

      let exactMatchCount = 0;
      let partialMatchCount = 0;
      let totalScore = 0;

      // Check for exact phrase match (highest priority)
      if (searchText.includes(normalizedQuery)) {
        totalScore += 100;
      }

      // Check each query word
      for (const word of queryWords) {
        if (word.length < 1) continue;

        // Exact word match (word boundary) - higher score
        const exactWordRegex = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
        if (exactWordRegex.test(searchText)) {
          exactMatchCount++;
          totalScore += 10;
        } else {
          // Partial match (substring) - lower score but still counts
          const partialRegex = new RegExp(escapeRegex(word), "i");
          if (partialRegex.test(searchText)) {
            partialMatchCount++;
            totalScore += 3;
          }
        }
      }

      // Match if we have any matches (exact or partial)
      if (exactMatchCount > 0 || partialMatchCount > 0 || totalScore > 0) {
        // Calculate relevance: prioritize exact matches
        const relevance =
          (exactMatchCount * 2 + partialMatchCount) /
          Math.max(queryWords.length, 1);
        const snippet = findRelevantSnippet(
          page.content,
          queryWords,
          normalizedQuery,
        );
        results.push({
          page: page.title,
          url: page.url,
          snippet,
          relevance,
          matchCount: exactMatchCount + partialMatchCount,
          totalScore, // Use totalScore for better sorting
        });
      }
    });

    // Sort: prioritize by total score (exact phrase > exact words > partial matches), then relevance
    results.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return b.relevance - a.relevance;
    });

    return results.slice(0, 20);
  }

  /**
   * Find a relevant snippet containing search terms
   */
  function findRelevantSnippet(content, queryWords, normalizedQuery) {
    const text = content.replace(/\s+/g, " ").toLowerCase();
    let bestSentence = "";
    let maxMatches = 0;

    // First, try to find exact phrase match
    if (normalizedQuery && text.includes(normalizedQuery)) {
      const phraseIndex = text.indexOf(normalizedQuery);
      const start = Math.max(0, phraseIndex - 60);
      const end = Math.min(
        text.length,
        phraseIndex + normalizedQuery.length + 120,
      );
      const snippet = text.substring(start, end);
      return snippet + "...";
    }

    // Otherwise, find best match for individual words (exact or partial)
    for (const word of queryWords) {
      if (word.length < 1) continue;

      // Try exact word match first
      let regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
      let match = regex.exec(text);

      // If no exact match, try partial match
      if (!match) {
        regex = new RegExp(escapeRegex(word), "gi");
        match = regex.exec(text);
      }

      if (match) {
        const start = Math.max(0, match.index - 60);
        const end = Math.min(text.length, match.index + word.length + 120);
        const snippet = text.substring(start, end);

        // Count how many query words appear in this snippet (exact or partial)
        let matches = 0;
        for (const w of queryWords) {
          if (w.length < 1) continue;
          const exactRegex = new RegExp(`\\b${escapeRegex(w)}\\b`, "i");
          const partialRegex = new RegExp(escapeRegex(w), "i");
          if (exactRegex.test(snippet) || partialRegex.test(snippet)) {
            matches++;
          }
        }

        if (matches > maxMatches) {
          maxMatches = matches;
          bestSentence = snippet;
        }
      }
    }

    return bestSentence ? bestSentence + "..." : text.substring(0, 150) + "...";
  }

  /**
   * Highlight matching text (case-insensitive, supports partial matches)
   */
  function highlightText(text, query) {
    if (!query) return text;

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 0);
    let highlightedText = text;

    // Use a placeholder to avoid double-highlighting
    const placeholder = "___HIGHLIGHT_PLACEHOLDER___";
    const placeholders = [];

    // First, protect already highlighted text (if any)
    let placeholderIndex = 0;
    highlightedText = highlightedText.replace(
      /<mark>([^<]*)<\/mark>/gi,
      (match, content) => {
        placeholders[placeholderIndex] = match;
        return placeholder + placeholderIndex++ + placeholder;
      },
    );

    // Highlight exact phrase first (if query has multiple words)
    if (normalizedQuery.length > 2 && queryWords.length > 1) {
      const phraseRegex = new RegExp(`(${escapeRegex(normalizedQuery)})`, "gi");
      highlightedText = highlightedText.replace(phraseRegex, "<mark>$1</mark>");
    }

    // Then highlight individual words (both exact and partial matches)
    queryWords.forEach((word) => {
      if (word.length > 0) {
        // Match word anywhere (partial match), case-insensitive, but not inside mark tags
        const regex = new RegExp(`(${escapeRegex(word)})`, "gi");
        highlightedText = highlightedText.replace(regex, "<mark>$1</mark>");
      }
    });

    // Restore protected highlights
    placeholders.forEach((original, index) => {
      highlightedText = highlightedText.replace(
        placeholder + index + placeholder,
        original,
      );
    });

    // Clean up any nested mark tags (shouldn't happen, but just in case)
    highlightedText = highlightedText.replace(
      /<mark>(.*?)<mark>(.*?)<\/mark>(.*?)<\/mark>/gi,
      "<mark>$1$2$3</mark>",
    );

    return highlightedText;
  }

  /**
   * Escape regex special characters
   */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Show no results message
   */
  function showNoResults(container, message) {
    container.innerHTML = `
      <div class="search-no-results">
        <i class="fa fa-search"></i>
        <p>${message}</p>
      </div>
    `;
    container.style.display = "block";
  }

  /**
   * Display search results
   */
  function displayResults(results, query, container) {
    const html = results
      .map((result) => {
        const highlightedSnippet = highlightText(result.snippet, query);
        const relevancePercent = Math.round(result.relevance * 100);

        // Preserve existing query parameters if any
        const urlWithQuery = result.url.includes("?")
          ? `${result.url}&q=${encodeURIComponent(query)}`
          : `${result.url}?q=${encodeURIComponent(query)}`;

        return `
        <a href="${urlWithQuery}" class="search-result-item">
          <div class="search-result-header">
            <span class="search-result-page">${result.page}</span>
            <span class="search-result-relevance">${relevancePercent}% match</span>
          </div>
          <div class="search-result-snippet">${highlightedSnippet}</div>
        </a>
      `;
      })
      .join("");

    container.innerHTML = `
    <div class="search-results-header">
      <span>Found ${results.length} result${results.length !== 1 ? "s" : ""}</span>
    </div>
    <div class="search-results-list">
      ${html}
    </div>
  `;
    container.style.display = "block";

    // Optional: handle click on results without full page reload (scroll smoothly)
    container.querySelectorAll(".search-result-item").forEach((link) => {
      link.addEventListener("click", (e) => {
        // Only if same page, prevent reload
        const linkUrl = new URL(link.href, window.location.origin);
        const currentUrl = window.location.href.split("?")[0];
        if (linkUrl.pathname === currentUrl) {
          e.preventDefault();
          const queryParam = linkUrl.searchParams.get("q");
          if (queryParam) {
            highlightAndScroll(queryParam);
          }
        }
      });
    });
  }

  /**
   * Hide results container
   */
  function hideResults(container) {
    container.style.display = "none";
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();

// ===============================
// Global Scroll-to-Search Feature
// ===============================

// Module-level helpers so both IIFEs can access them
function escapeRegexGlobal(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightAndScroll(query) {
  const safeQuery = query.trim();
  if (!safeQuery) return;

  // Remove existing highlights before adding new ones
  removeHighlights();

  const regex = new RegExp(`\\b(${escapeRegexGlobal(safeQuery)})\\b`, "gi");

  document
    .querySelectorAll("p, li, td, span, div, h1, h2, h3, h4, h5, h6")
    .forEach((el) => {
      // Only process leaf nodes (elements with only text content)
      if (el.children.length === 0 && el.textContent.match(regex)) {
        el.innerHTML = el.innerHTML.replace(
          regex,
          `<mark class="search-highlight">$1</mark>`,
        );
      }
    });

  const first = document.querySelector(".search-highlight");
  if (first) {
    first.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function removeHighlights() {
  const highlights = document.querySelectorAll(".search-highlight");
  highlights.forEach((highlight) => {
    const parent = highlight.parentNode;
    if (parent) {
      const textNode = document.createTextNode(highlight.textContent);
      parent.replaceChild(textNode, highlight);
      parent.normalize();
    }
  });
}

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (!query) return;
    highlightAndScroll(query);
  });
})();
