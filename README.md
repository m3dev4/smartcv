<div align="center">

# 🚀 SmartCV

<img src="public/logo.png" alt="SmartCV Logo" width="180"/>

**Réinventez votre CV. Révélez votre potentiel.**

[![Next.js](https://img.shields.io/badge/Next.js-13.5+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

## ✨ Présentation

**SmartCV** est la plateforme web ultime pour créer, personnaliser et gérer vos CV avec un impact visuel unique. Pensée pour les professionnels modernes, SmartCV vous permet de concevoir des CV qui captivent l’attention des recruteurs grâce à une expérience utilisateur fluide et des fonctionnalités avancées, dont un affichage circulaire innovant et l’intégration de l’IA.

---

## 🖼️ Aperçu visuel

L’interface de SmartCV met en avant votre CV principal, entouré de miniatures de vos autres modèles dans une disposition circulaire dynamique. Ce design immersif valorise votre profil et facilite la gestion de plusieurs versions de CV pour différents objectifs professionnels.

---

## 🚩 Fonctionnalités clés

- 🎨 **Création intuitive de CV** : Interface drag-and-drop ultra fluide
- 🌀 **Affichage circulaire** : Présentation centrale du CV entourée de miniatures pour une navigation rapide
- 🏆 **Modèles professionnels** : Large choix de designs adaptés à tous les secteurs
- 📱 **Responsive design** : Parfaitement adapté desktop, tablette et mobile
- 📤 **Exportation multi-format** : Téléchargement en PDF, DOCX ou partage par URL
- 🤖 **Analyse IA** : Suggestions personnalisées pour optimiser votre CV
- 🔒 **Gestion de profil** : Sauvegarde et organisation de multiples CV
- 🔗 **Partage instantané** : Génération de liens publics sécurisés

---

## 🛠️ Technologies

- **Frontend** : Next.js, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL
- **Authentification** : Better Auth, Nodemailer
- **Gestion d’état** : React Context API
- **Animations** : Framer Motion
- **Autres** : React Hook Form, Radix UI, Tiptap Editor

---

## 🚀 Installation rapide

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/smartcv.git
cd smartcv

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Puis renseignez vos valeurs :
# DATABASE_URL, EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, NEXT_PUBLIC_BASE_URL

# Exécuter les migrations Prisma
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

Accédez à [http://localhost:3000](http://localhost:3000) pour découvrir SmartCV.

---

## 🗂️ Structure du projet

```text
smartcv/
├── app/           # App Router Next.js (pages, auth, dashboard)
├── components/    # Composants réutilisables (cv, landing, ui)
├── hooks/         # Custom React hooks
├── lib/           # Fonctions utilitaires, client Prisma
├── middleware.ts  # Middleware Next.js
├── public/        # Fichiers statiques (images, logos)
├── prisma/        # Schéma et migrations Prisma
├── utils/         # Fonctions utilitaires diverses
├── types/         # Types TypeScript
```

---

## 📖 Utilisation

### Authentification
1. **Inscription** : Créez un compte avec votre email
2. **Vérification** : Confirmez via le lien reçu par email
3. **Connexion** : Accédez à votre espace personnel

### Gestion de CV
1. **Tableau de bord** : Visualisez et organisez vos CV
2. **Création** : Sélectionnez un modèle, personnalisez le contenu et le style
3. **Personnalisation avancée** : Modifiez couleurs, polices, sections
4. **Export/Partage** : Téléchargez ou partagez instantanément

---

## 🛣️ Roadmap

- [ ] Intégration LinkedIn pour import automatique
- [ ] Analyse sémantique d’offres d’emploi
- [ ] Mode collaboration (feedback RH)
- [ ] Application mobile native
- [ ] Authentification sociale (Google, GitHub, etc.)
- [ ] Système de récupération de mot de passe

---

## 🤝 Contribuer

Toute contribution est la bienvenue ! Merci de consulter le fichier `CONTRIBUTING.md` pour les bonnes pratiques.

---

## 📄 Licence

Ce projet est sous licence MIT.

## ✨ Caractéristiques

- **Création intuitive de CV** : Interface drag-and-drop pour une personnalisation facile
- **Modèles professionnels** : Variété de designs modernes et adaptés à différents secteurs
- **Affichage circulaire innovant** : Visualisation unique de vos modèles de CV
- **Responsive design** : Compatible avec tous les appareils (desktop, tablette, mobile)
- **Exportation multiformat** : PDF, DOCX, et partage direct via URL
- **Analyse de CV** : Suggestions d'amélioration basées sur l'IA
- **Gestion de profil** : Sauvegarde de plusieurs versions de CV pour différents emplois

## 🚀 Technologies utilisées

- **Frontend** : Next.js, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Database** : PostgreSQL
- **Authentication** : Système personnalisé avec Better Auth, Nodemailer
- **State Management** : React Context API
- **Styling** : Tailwind CSS avec configuration Prettier
- **Déploiement** : Vercel
- **Autres** : React Hook Form, Framer Motion pour les animations

## 🛠️ Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/smartcv.git
cd smartcv

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créez un fichier .env.local à la racine du projet avec les variables suivantes :
DATABASE_URL="votre_url_de_connexion_postgresql"
EMAIL_HOST="smtp.gmail.com" # ou votre serveur SMTP
EMAIL_PORT=587
EMAIL_USERNAME="votre_email@exemple.com"
EMAIL_PASSWORD="votre_mot_de_passe"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Exécuter les migrations Prisma
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

Accédez à [http://localhost:3000](http://localhost:3000) pour voir l'application en action.

## 🔍 Structure du projet

```
smartcv/
├── app/                   # App Router de Next.js
│   ├── (auth)/           # Routes d'authentification (sign-up, sign-in, verify-email)
│   └── dashboard/        # Interface utilisateur après connexion
├── components/            # Composants React réutilisables
│   ├── cv/               # Composants spécifiques aux CV
│   ├── landing/          # Composants de la page d'accueil
│   └── ui/               # Composants d'interface utilisateur génériques
├── hooks/                 # Custom React hooks incluant les hooks d'authentification
├── lib/                   # Utilitaires et fonctions partagées
│   └── prisma.ts         # Client Prisma pour la connexion à la base de données
├── middleware.ts         # Middleware Next.js pour protéger les routes
├── public/               # Fichiers statiques
├── utils/                # Fonctions utilitaires
│   └── auth.ts           # Fonctions d'authentification (signUp, signIn, etc.)
├── prisma/               # Configuration Prisma et migrations
│   └── schema.prisma     # Schéma de base de données
└── types/                # Définitions de types TypeScript
```

## 📖 Guide d'utilisation

### Système d'authentification

1. **Inscription** : Créez un compte avec votre email et mot de passe
2. **Vérification d'email** : Vérifiez votre adresse email via le lien envoyé à votre boîte de réception
3. **Connexion** : Connectez-vous avec vos identifiants après vérification de l'email

### Utilisation de l'application

1. **Tableau de bord** : Accédez à votre espace personnel après connexion
2. **Création de CV** : Choisissez un modèle et personnalisez-le
3. **Édition** : Ajoutez vos informations personnelles, expériences et compétences
4. **Personnalisation** : Modifiez les couleurs, polices et la mise en page
5. **Exportation** : Téléchargez votre CV ou partagez-le via un lien

## 📝 Roadmap




- [ ] Intégration avec LinkedIn pour l'importation de profils
- [ ] Analyse sémantique des offres d'emploi pour optimiser les CV
- [ ] Mode collaboration pour les retours d'experts RH
- [ ] Application mobile native
- [ ] Authentification sociale (Google, GitHub, etc.)
- [ ] Système de récupération de mot de passe
- [ ] Gestion avancée du profil utilisateur
- [ ] Tableau de bord administrateur pour la gestion des utilisateurs

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add some amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- **Email** : contact@smartcv.com
- **Site web** : [www.smartcv.com](https://www.smartcv.com)

---

<div align="center">

**SmartCV** - © 2025 - Transformez votre avenir professionnel

</div>