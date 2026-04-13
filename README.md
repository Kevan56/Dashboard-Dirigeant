# Dashboard Dirigeant — Déploiement Vercel

## Structure du projet
```
dashboard-vercel/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── src/
    ├── main.jsx
    └── App.jsx
```

## Déploiement sur Vercel (10 minutes)

### Étape 1 — Créer un compte GitHub
→ https://github.com → Sign up (gratuit)

### Étape 2 — Créer un nouveau dépôt GitHub
1. Cliquer sur "New repository"
2. Nom : `dashboard-dirigeant`
3. Visibilité : Private (recommandé)
4. Cliquer "Create repository"

### Étape 3 — Uploader les fichiers
1. Dans le dépôt créé, cliquer "uploading an existing file"
2. Glisser-déposer TOUS les fichiers du dossier `dashboard-vercel`
   ⚠️ Respecter la structure : le dossier `src/` doit contenir `main.jsx` et `App.jsx`
3. Cliquer "Commit changes"

### Étape 4 — Créer un compte Vercel
→ https://vercel.com → Sign up with GitHub (gratuit)

### Étape 5 — Déployer
1. Sur Vercel → "Add New Project"
2. Sélectionner votre dépôt `dashboard-dirigeant`
3. Framework : Vite (détecté automatiquement)
4. Cliquer "Deploy"
5. ✅ Votre lien est prêt en 2 minutes !

## Résultat
Vous obtenez un lien permanent du type :
`https://dashboard-dirigeant-XXXX.vercel.app`

Ce lien est partageable avec vos clients par email.

## Personnalisation
- Modifier les données par défaut dans `src/App.jsx` (tableau `initialData`)
- Changer le nom de l'entreprise par défaut (ligne `useState("Dupont & Fils SARL")`)
- Changer l'année affichée (rechercher "2024" dans App.jsx)
