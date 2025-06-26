# SmartCV PDF Server

Serveur de génération PDF pour SmartCV utilisant Puppeteer et Express.

## 🚀 Déploiement sur Render

### Prérequis
- Compte Render.com
- Repository Git avec le code du serveur

### Étapes de déploiement

1. **Connecter le repository**
   - Aller sur [Render.com](https://render.com)
   - Cliquer sur "New +" → "Web Service"
   - Connecter votre repository Git

2. **Configuration automatique**
   - Render détectera automatiquement le fichier `render.yaml`
   - Les paramètres seront appliqués automatiquement

3. **Configuration manuelle (alternative)**
   Si vous préférez configurer manuellement :
   ```
   Name: smartcv-pdf-server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Variables d'environnement**
   ```
   NODE_ENV=production
   PORT=3001
   ```

### 📋 Configuration du fichier render.yaml

Le fichier `render.yaml` inclut :
- Configuration automatique du service web
- Variables d'environnement
- Health check endpoint
- Optimisations pour Puppeteer

### 🔧 Fonctionnalités

- **Génération PDF** : Endpoint `/generate-pdf` pour créer des PDFs
- **Health Check** : Endpoint `/health` pour vérifier le statut
- **CORS** : Configuré pour accepter les requêtes cross-origin
- **Optimisations Puppeteer** : Configuration pour l'environnement de production

### 📡 Endpoints

#### POST /generate-pdf
Génère un PDF à partir d'une URL
```json
{
  "url": "https://example.com/cv/preview/123",
  "fileName": "CV_John_Doe",
  "resumeId": "123",
  "resumeData": { ... }
}
```

#### GET /health
Vérifie le statut du serveur
```json
{
  "status": "OK",
  "message": "PDF Server is running"
}
```

### 🛠️ Développement local

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Démarrage en production
npm start
```

### 📝 Notes importantes

- Le serveur utilise Puppeteer avec des optimisations pour l'environnement cloud
- Les polices Google Fonts sont préchargées pour une meilleure qualité PDF
- La configuration CORS permet l'intégration avec l'application principale
- Le health check est requis pour Render.com

### 🔗 Intégration

Une fois déployé, mettez à jour l'URL du serveur PDF dans votre application principale :
```javascript
const PDF_SERVER_URL = 'https://your-render-app.onrender.com';
