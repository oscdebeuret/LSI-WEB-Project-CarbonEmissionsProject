# 🌍 Carbon Emissions Project

IBOS Geoffrey - DEBEURET Oscar

Cette application permet aux utilisateurs de **calculer et comparer leurs émissions de CO₂** selon plusieurs types d'activités, avec un système de **favoris persistants** en base via Firebase. L'authentification est gérée via Microsoft et Google OAuth.

---

## 🚀 Lancer le projet

### 1. Cloner le projet

```bash
git clone https://github.com/oscdebeuret/LSI-WEB-Project-CarbonEmissionsProject
cd email-manager
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur en développement

```bash
npm run dev
```

L'application sera accessible sur : [http://localhost:8080](http://localhost:8080)

---

## ✨ Fonctionnalités principales

- 🔐 Authentification avec **Google** et **Microsoft** (OAuth 2.0)
- 📊 Calcul des émissions de CO₂ via l’API **Climatiq**
  - Cloud computing : CPU, RAM, Stockage, VM
  - Vols (Flight activity)
  - Électricité (kWh)
- ⭐ Système de **favoris** avec persistance via **Firebase Firestore**
- 📈 **Graphiques comparatifs** via Chart.js (ex. : émissions recommandées vs personnelles)
- 🔌 Tunnel **ngrok** utilisé pour exposer en local l’application avec Firebase

---

## 🔧 Stack technique

- **Vue 3** (Composition API)
- **Pinia** + `pinia-plugin-persistedstate`
- **Vue Router**
- **Chart.js** & `vue-chartjs`
- **Climatiq API**
- **Firebase (auth + Firestore)**
- **OAuth 2.0** (Google & Microsoft)
- **Tailwind CSS**
- **Vite**

---

## 📁 Organisation

```
src/
├── components/          // Composants Vue (formulaires, cartes résultats)
├── views/               // Pages Vue.js
├── services/            // API calls (Climatiq, Firebase)
├── store/               // Pinia stores
└── assets/              // Styles, icônes, etc.
```
