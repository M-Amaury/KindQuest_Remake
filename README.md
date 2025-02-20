# 🚀 Projet de Gestion de Missions - Évolution Hackathon

Un système de gestion de missions moderne et évolutif, initialement développé lors d'un hackathon XRPL et considérablement amélioré.

## 🌟 Origine et Évolution

KindQuest a vu le jour lors d'un hackathon où nous avions développé une version initiale avec des technologies de base. J'ai décidé de reprendre ce projet pour en faire une application complète et professionnelle, en ajoutant :

- **Base de données réelle** : Migration de SQLite vers PostgreSQL avec Prisma
- **Authentification sécurisée** : Implémentation d'un système d'authentification robuste
- **Intégration XRP Ledger** : Ajout de la fonctionnalité de paiement que nous n'avions pas pu finaliser lors du hackathon
- **Architecture scalable** : Refonte complète avec Next.js pour une meilleure maintenabilité

## 🛠️ Technologies Utilisées

### Core Stack
- **Framework** : Next.js 14
- **Base de données** : PostgreSQL + Prisma ORM
- **Authentification** : NextAuth.js
- **Styling** : Tailwind CSS
- **Validation** : Zod
- **Paiements** : XRP Ledger

### Outils de Développement
- **TypeScript** : Pour une meilleure sécurité et maintenabilité du code
- **ESLint + Prettier** : Pour un code propre et cohérent
- **Jest + React Testing Library** : Pour des tests unitaires et d'intégration
- **Docker** : Pour un environnement de développement cohérent

## 🚀 Fonctionnalités Principales

### Utilisateurs
- **Inscription sécurisée**
- **Profil utilisateur** avec historique des missions

### Missions
- **Création de missions** (accès admin)
- **Validation des missions** (accès admin)
- **Système de paiement** via XRP Ledger et KindToken avec EVM sidechain

### Administration
- **Tableau de bord** complet
- **Gestion des utilisateurs**
- **Validation des missions**
- **Suivi des transactions**

## 🏗️ Structure du Projet

frontend/
├── app/
│ ├── register/ # Page d'inscription
│ ├── missions/ # Page des missions
│ ├── admin/
│ │ ├── validate/ # Validation admin
│ │ └── create-mission/ # Création de missions
│ └── ... # Autres pages
├── components/ # Composants réutilisables
├── lib/ # Utilitaires et helpers
├── prisma/ # Schémas et migrations Prisma
└── public/ # Assets statiques

## 🔐 Configuration des Variables d'Environnement

Le projet utilise plusieurs variables d'environnement sensibles pour sécuriser l'application. Voici les principales :

### Frontend
```env
DATABASE_URL="prisma+postgres://..." # URL de connexion à la base de données
JWT_SECRET="..." # Clé secrète pour les tokens JWT
KIND_TOKEN_ADDRESS="0x..." # Adresse du contrat KindToken
PROVIDER_URL="https://..." # URL du provider EVM
ADMIN_PRIVATE_KEY="..." # Clé privée admin pour les transactions
XRPL_ADMIN_SEED="..." # Seed XRPL pour les paiements
```

### Contrat
```env
XRPL_EVM_URL="https://..." # URL du réseau EVM XRPL
PRIVATE_KEY="..." # Clé privée pour les déploiements
CONTRACT_ADDRESS="0x..." # Adresse du contrat déployé
```

⚠️ **Important** : Ces variables doivent être conservées secrètes et ne jamais être commitées dans le dépôt. Utilisez un fichier `.env.local` pour le développement local.

## 🚀 Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/votre-projet.git
   ```

2. Installer les dépendances :
   ```bash
   cd frontend
   npm install
   ```

3. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env.local
   ```

4. Configurer la base de données PostgreSQL et appliquer les migrations Prisma :
   ```bash
   npx prisma migrate dev
   ```

5. Démarrer le serveur de développement :
   ```bash
   npm run dev
   ```

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
