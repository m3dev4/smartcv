export const companys = [
  {
    id: 1,
    name: 'Amazon',
    image: '/icons/amazon.svg',
  },
  {
    id: 2,
    name: 'Google',
    image: '/icons/google.svg',
  },
  {
    id: 3,
    name: 'Sonatel',
    image: '/icons/sonatel.png',
  },
  {
    id: 4,
    name: 'Postman',
    image: '/icons/ibm.svg',
  },
  {
    id: 5,
    name: 'Tesla',
    image: '/icons/tesla.svg',
  },
];

export const functionality = [
  {
    id: 1,
    title: 'Grauit',
    icon: '/icons/dollar.svg',
  },
  {
    id: 2,
    title: 'Open Source',
    icon: '/icons/code.png',
  },
  {
    id: 3,
    title: 'Licence MIT',
    icon: '/icons/licence.png',
  },
  {
    id: 4,
    title: 'Pas de Publicité',
    icon: '/icons/publicite.png',
  },
  {
    id: 5,
    title: 'Auto-hébergement avec Docker',
    icon: '/icons/sociale.png',
  },
  {
    id: 6,
    title: 'Disponible en 50 langues',
    icon: '/icons/langue.png',
  },
  {
    id: 7,
    title: 'Fonctionnement avec OpenAI',
    icon: '/icons/ai.png',
  },
  {
    id: 8,
    title: 'Se connecter avec Github',
    icon: '/icons/github.png',
  },
  {
    id: 9,
    title: 'Se connecter avec Google',
    icon: '/icons/google.png',
  },

  {
    id: 8,
    title: 'Se connecter avec e-mail',
    icon: '/icons/e-mail.png',
  },
  {
    id: 9,
    title: "Sécurité avec l'authentification à deux facteurs",
    icon: '/icons/chiffrement.png',
  },
  {
    id: 10,
    title: 'Des choix de modèle de CV',
    icon: '/icons/template.png',
  },
  {
    id: 11,
    title: 'Concevoir des CV professionnels personnalisés',
    icon: '/icons/cv.png',
  },
  {
    id: 12,
    title: 'Gérer plusieur CVs',
    icon: '/icons/manage.png',
  },
  {
    id: 13,
    title: 'Palettes de couleurs personnalisables',
    icon: '/icons/palette.png',
  },
  {
    id: 14,
    title: 'Mise en page personnalisable',
    icon: '/icons/mise-en-page.png',
  },
  {
    id: 15,
    title: 'Section de CV personnalisées',
    icon: '/icons/etoile.png',
  },
  {
    id: 16,
    title: "Note personelles pour chaque cv avec l'aide de l'IA ",
    icon: '/icons/note.png',
  },
  {
    id: 17,
    title: 'Verrouiller un CV pour empêcher toute modification',
    icon: '/icons/lock.png',
  },
  {
    id: 18,
    title: 'Supporte les formats de page A4/Letter',
    icon: '/icons/a4.png',
  },
  {
    id: 19,
    title: "Choisissez n'importe quelle police de Google Fonts",
    icon: '/icons/font.png',
  },
  {
    id: 20,
    title: 'Thème clair ou sombre',
    icon: '/icons/darkmode.png',
  },
];

export const tesimonials = [
  {
    author: {
      id: 1,
      name: 'John Doe',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      handle: '@johndoe',
    },
    text: "J'utilise SmartCV pour concevoir mon CV professionnel et je suis impressionné par la qualité et la personnalisation. Je recommande vivement SmartCV !",
  },
  {
    author: {
      id: 2,
      name: 'Emma Thompson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      handle: '@emmaai',
    },
    text: "En tant que développeur, j'utilise SmartCV pour mettre en ligne mon CV professionnel et je suis impressionné par la qualité et la personnalisation. Je recommande vivement SmartCV !",
  },
  {
    author: {
      id: 3,
      name: 'David Park',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      handle: '@davidtech',
    },
    text: "Pour mes projets professionnels, j'utilise SmartCV pour concevoir des CVs professionnels et je suis impressionné par la qualité et la personnalisation. Je recommande vivement SmartCV !",
  },
  {
    author: {
      id: 4,
      name: 'Sofia Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      handle: '@sofiaml',
    },
    text: "Finalement ! J'utilise SmartCV pour concevoir mon CV professionnel et je suis impressionné par la qualidade et la personnalisation. Je recommande vivement SmartCV !",
  },
];



///Resumes

export const mockResume = {
  id: '1',
  title: 'Mon CV',
  personalInfo: {
    firstName: 'Jean',
    lastName: 'Dupont',
    photoUrl: 'https://img.freepik.com/photos-gratuite/belle-femme-afro-americaine-souriante-cheveux-nets-large-sourire-montre-dents-blanches-porte-t-shirt-lunettes-decontractes-se-tient-au-dessus-du-mur-se-rejouit-avoir-journee-conge-journaliste-femme-interieur_273609-15511.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740',
    title: 'Chef de projet',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    location: 'Paris, France',
    description:
      "Je suis un chef de projet passionné. Je suis expert en gestion de projet et j'aime travailler en equipe pour atteindre les objectifs de mon entreprise.",
  },
  // Ajoutez d'autres sections selon votre type Resume
  experiences: [
    {
      id: '1',
      position: 'Chef de projet',
      company: 'Entreprise A',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'emploi 1",
      order: 1,
    },
    {
      id: '2',
      position: 'Chef de projet',
      company: 'Entreprise B',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'emploi 2",
      order: 2,
    }
  ],
  educations: [
    {
      id: '1',
      title: 'Diplome 1',
      institution: 'Institut A',
      degree: 'Diplome 1',
      fieldOfStudy: 'Champ 1',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'education 1",
      location: 'Paris, France',
    },
    {
      id: '2',
      title: 'Diplome 2',
      institution: 'Institut B',
      degree: 'Diplome 2',
      fieldOfStudy: 'Champ 2',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'education 2",
      location: 'Paris, France',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'HTML',
      level: 57,
      order: 1,
    },
    {
      id: '2',
      name: 'CSS',
      level: 60,
      order: 2,
    },
    {
      id: '3',
      name: 'JavaScript',
      level: 70,
      order: 3,
    },
  ],
  languages: [
    {
      id: '1',
      name: 'Français',
      level: 100,
      order: 1,
    },
    {
      id: '2',
      name: 'Anglais',
      level: 50,
      order: 2,
    },
    {
      id: '3',
      name: 'Espagnol',
      level: 30,
      order: 3,
    },
  ],
  certfications: [
    {
      id: 1,
      name: 'Certification 1',
      issuer: 'Issuer 1',
      issueDate: '2022-01-01',
      expiryDate: '2023-01-01',
      credentialId: 'Credential ID 1',
      credentialUrl: 'example.com/credential/1',
      order: 1,
    },
  ],
  achievements: [
    {
      id: 1,
      title: 'Achievement 1',
      description: 'Description of Achievement 1',
      order: 1,
    }
  ],
};