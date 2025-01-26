document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".theme-doc-sidebar-menu");

  // Fonction pour récupérer les meta-features depuis l'API
  async function fetchMetaFeatures() {
    const response = await fetch("/api/features");
    if (!response.ok) {
      console.error("Erreur lors de la récupération des meta-features.");
      return {};
    }
    return response.json();
  }

  function buildSidebar(structure, parentElement, parentPath = "") {
    Object.keys(structure).forEach((key) => {
      const value = structure[key];
      const li = document.createElement("li");
      li.className = "menu__list-item";
  
      const link = document.createElement("a");
      link.className = "menu__link menu__link--sublist";
      link.textContent = key;
      link.href = "#";
      link.addEventListener("click", (event) => {
        event.preventDefault();
  
        // Construit le chemin du dossier (remplace `path.join`)
        const folderPath = parentPath ? `${parentPath}/${key}` : key;
  
        // Vérifie si c'est un dernier niveau
        if (Object.keys(value).length === 0) {
          loadFeatureFiles(folderPath); // Charge les fichiers associés
        }
      });
  
      li.appendChild(link);
  
      if (typeof value === "object" && Object.keys(value).length > 0) {
        const subList = document.createElement("ul");
        subList.className = "menu__list";
        buildSidebar(value, subList, parentPath ? `${parentPath}/${key}` : key);
        li.appendChild(subList);
      }
  
      parentElement.appendChild(li);
    });
  }
  
  

  async function loadFeatureFiles(folderPath) {
    const encodedPath = encodeURIComponent(folderPath);
    const response = await fetch(`/api/features/files/${encodedPath}`);
    if (!response.ok) {
      console.error("Erreur lors du chargement des fichiers :", folderPath);
      return;
    }
  
    const files = await response.json();
    const contentDiv = document.getElementById("content");
  
    // Efface le contenu précédent
    const tabList = document.getElementById("fileTabs");
    const tabContent = document.getElementById("fileTabContent");
    tabList.innerHTML = "";
    tabContent.innerHTML = "";
  
    files.forEach((file, index) => {
      const tabId = `tab-${index}`;
      const paneId = `pane-${index}`;
  
      // Crée un onglet
      const tabItem = document.createElement("li");
      tabItem.className = "nav-item";
      tabItem.setAttribute("role", "presentation");
  
      const tabButton = document.createElement("button");
      tabButton.className = `nav-link ${index === 0 ? "active" : ""}`;
      tabButton.id = `${tabId}`;
      tabButton.setAttribute("data-toggle", "tab");
      tabButton.setAttribute("data-target", `#${paneId}`);
      tabButton.setAttribute("type", "button");
      tabButton.setAttribute("role", "tab");
      tabButton.setAttribute("aria-controls", paneId);
      tabButton.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tabButton.textContent = file.name
  
      tabItem.appendChild(tabButton);
      tabList.appendChild(tabItem);
  
      // Crée le contenu de l'onglet
      const tabPane = document.createElement("div");
      tabPane.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
      tabPane.id = paneId;
      tabPane.setAttribute("role", "tabpanel");
      tabPane.setAttribute("aria-labelledby", tabId);
      tabPane.innerHTML = `
        <pre><code>${file.content}</code></pre>
      `;
      tabContent.appendChild(tabPane);
    });
    // Applique la mise en évidence de syntaxe avec Highlight.js
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  // Initialisation de la sidebar
  async function initSidebar() {
    const structure = await fetchMetaFeatures();
    buildSidebar(structure, sidebar);
  }

  initSidebar();
});
