<div align="center">

# SmartCV

<img src="public/logo.png" alt="SmartCV Logo" width="200"/>

*Transformez votre parcours professionnel avec des CV innovants et percutants*

[![Next.js](https://img.shields.io/badge/Next.js-13.5+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

## 📋 À propos

SmartCV est une plateforme web innovante conçue pour la création et la gestion de CV professionnels. Notre application permet aux utilisateurs de créer, personnaliser et partager des curriculum vitae de qualité professionnelle, adaptés aux exigences du marché du travail moderne.

Avec une interface utilisateur intuitive et des fonctionnalités avancées, SmartCV transforme l'expérience de création de CV en un processus simple et efficace, tout en maximisant l'impact visuel et le contenu de votre profil professionnel.

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