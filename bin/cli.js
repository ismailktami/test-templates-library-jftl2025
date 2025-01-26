#!/usr/bin/env node

const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

function serveStaticFile(res, filepath, contentType, responseCode = 200) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Internal Server Error');
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}
function getMetaFeatures(dir) {
  const result = {};
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory()) {
      result[entry.name] = getMetaFeatures(path.join(dir, entry.name));
    }
  });
  return result;
}




// API pour récupérer les méta-features
app.get("/api/features", (req, res) => {
  const featuresDir = path.join(__dirname, "./../meta-features");
  if (!fs.existsSync(featuresDir)) {
    return res.status(404).json({ error: "Le dossier des features n'existe pas." });
  }
  try {
    const metaFeatures = getMetaFeatures(featuresDir);
    res.json(metaFeatures);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la lecture des méta-features." });
  }
});

app.get("/api/features/files/:folderPath(*)", (req, res) => {
  const folderPath = decodeURIComponent(req.params.folderPath); // Décode le chemin encodé
  console.log(req.params.folderPath);
  const fullPath = path.join(__dirname, "./../meta-features", folderPath);

  if (!fs.existsSync(fullPath)) {
    res.status(404).json({ error: "Dossier introuvable" });
    return;
  }

  const files = fs.readdirSync(fullPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && (entry.name.endsWith(".feature") || entry.name.endsWith(".js") || entry.name.endsWith(".md")))
    .map((entry) => {
      const filePath = path.join(fullPath, entry.name);
      const content = fs.readFileSync(filePath, "utf-8");
      return { name: entry.name, content };
    });

  res.json(files);
});



// Servir les fichiers statiques (index.html, JS, CSS)
app.use((req, res, next) => {
  const filePath = path.join(__dirname, "../public", req.url === "/" ? "index.html" : req.url);
  const extname = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.exists(filePath, (exist) => {
    if (!exist) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found");
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      serveStaticFile(res, path.join(filePath, "index.html"), "text/html");
    } else {
      serveStaticFile(res, filePath, contentType);
    }
  });
});
// Fonction pour ajouter une méta-feature au projet
function addFeature(featureName) {
  const featuresDir = path.join(__dirname, "../meta-features");
  const projectFeaturesDir = path.join(process.cwd(), "cypress/e2e/features");

  if (!fs.existsSync(featuresDir)) {
    console.error("Erreur : Le dossier des méta-features n'existe pas.");
    process.exit(1);
  }

  const featurePath = path.join(featuresDir, featureName, `${featureName}.feature`);
  const stepsPath = path.join(featuresDir, featureName, `${featureName}.js`);

  if (!fs.existsSync(featurePath)) {
    console.error(`Erreur : La méta-feature ${featureName} n'existe pas.`);
    process.exit(1);
  }

  // Copier la feature dans le projet utilisateur
  if (!fs.existsSync(projectFeaturesDir)) {
    fs.mkdirSync(projectFeaturesDir, { recursive: true });
  }
  fs.copyFileSync(featurePath, path.join(projectFeaturesDir, `${featureName}.feature`));
  console.log(`Méta-feature "${featureName}" ajoutée avec succès dans ${projectFeaturesDir}.`);

  // Copier les steps si présents
  const projectStepsDir = path.join(process.cwd(), "cypress/e2e/support");
  if (fs.existsSync(stepsPath)) {
    if (!fs.existsSync(projectStepsDir)) {
      fs.mkdirSync(projectStepsDir, { recursive: true });
    }
    fs.copyFileSync(stepsPath, path.join(projectStepsDir, `${featureName}.js`));
    console.log(`Steps "${featureName}.js" ajoutés dans ${projectStepsDir}.`);
  }
}

// Démarrage du serveur
function startServer() {
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
    console.log("Visualisez les méta-features à l'adresse http://localhost:3000");
  });
}

// Gestion des commandes CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Usage:
  cypress-reusable-library serve                 # Lancer le serveur local pour visualiser les features
  cypress-reusable-library add:feature <name>   # Ajouter une méta-feature à votre projet
  `);
  process.exit(0);
}

const command = args[0];

if (command === "serve") {
  startServer();
} else if (command === "add:feature") {
  const featureName = args[1];
  if (!featureName) {
    console.error("Erreur : Nom de la méta-feature manquant.");
    process.exit(1);
  }
  addFeature(featureName);
} else {
  console.error("Erreur : Commande inconnue.");
  process.exit(1);
}
