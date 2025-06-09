import { ResumeTemplateType } from '@/enums/resumeEnum';
import { Template } from '@/lib/generated/prisma';

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
  // Propriétés manquantes ajoutées
  userId: 'mock-user-id',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  isPublic: false,
  publicUrl: null,
  templateId: ResumeTemplateType.MODERN, // Utiliser l'enum au lieu d'une chaîne
  themeId: 'default-theme',
  fontId: null,

  personalInfo: {
    firstName: 'Jean',
    lastName: 'Dupont',
    photoUrl:
      'https://img.freepik.com/photos-gratuite/belle-femme-afro-americaine-souriante-cheveux-nets-large-sourire-montre-dents-blanches-porte-t-shirt-lunettes-decontractes-se-tient-au-dessus-du-mur-se-rejouit-avoir-journee-conge-journaliste-femme-interieur_273609-15511.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740',
    title: 'Chef de projet',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    location: 'Paris, France',
    description:
      "Je suis un chef de projet passionné. Je suis expert en gestion de projet et j'aime travailler en equipe pour atteindre les objectifs de mon entreprise.",
  },
  experiences: [
    {
      id: '1',
      position: 'Chef de projet',
      company: 'Entreprise A',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      desctiption: "Description de l'emploi 1",
      current: true,
      order: 1,
    },
    {
      id: '2',
      position: 'Chef de projet',
      company: 'Entreprise B',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      desctiption: "Description de l'emploi 2",
      current: false,
      order: 2,
    },
  ],
  educations: [
    {
      id: '1',
      institutions: 'Institut A',
      degree: 'Diplome 1',
      fieldOfStudy: 'Champ 1',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'education 1",
      location: 'Paris, France',
      order: 1,
    },
    {
      id: '2',
      institutions: 'Institut B',
      degree: 'Diplome 2',
      fieldOfStudy: 'Champ 2',
      startDate: '2022-01-01',
      endDate: '2023-01-01',
      description: "Description de l'education 2",
      location: 'Paris, France',
      order: 2,
    },
  ],
  skills: [
    {
      id: '1',
      name: 'HTML',
      level: '57',
      order: 1,
    },
    {
      id: '2',
      name: 'CSS',
      level: '60',
      order: 2,
    },
    {
      id: '3',
      name: 'JavaScript',
      level: '70',
      order: 3,
    },
  ],
  languages: [
    {
      id: '1',
      name: 'Français',
      level: '100',
      order: 1,
    },
    {
      id: '2',
      name: 'Anglais',
      level: '50',
      order: 2,
    },
    {
      id: '3',
      name: 'Espagnol',
      level: '30',
      order: 3,
    },
  ],
  certfications: [
    {
      id: '1',
      name: 'Certification 1',
      issuer: 'Issuer 1',
      issueDate: new Date('2022-01-01'),
      expiryDate: new Date('2023-01-01'),
      credentialId: 'Credential ID 1',
      credentialUrl: 'example.com/credential/1',
      order: 1,
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'Achievement 1',
      description: 'Description of Achievement 1',
      order: 1,
    },
  ],
};

// Templates

export const templates: Template[] = [
  {
    id: ResumeTemplateType.MODERN,
    name: 'Modern',
    description: 'Design épuré et contemporain',
    thumbnail: '/resumes/modern.png',
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: ResumeTemplateType.CLASSIC,
    name: 'Classique',
    description: 'Design classique et traditionnel',
    thumbnail: '/resumes/classic.png',
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: ResumeTemplateType.PERFORMANCE,
    name: 'Performance',
    description: 'Design performant et moderne',
    thumbnail: '/resumes/performance.png',
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];



export const fontFamilies = [
  'Arial',
  'Cambria',
  'Garamond',
  'IBM Plex Sans',
  'IBM Plex Serif',
  'Lato',
  'Lora',
  'Merriweather',
  'Open Sans',
  'Playfair Display',
  'PT Sans',
  'PT Serif',
  'Roboto Condensed',
  'Times New Roman',
  'Roboto Slab',
  'Roboto',
  'Roboto Mono',
  'Monserrat',
  'Monserrat Subrayada',
  'Monserrat Alternates'
];


// Données d'exemple pour le CV principal
export const mainCV = {
  name: "John Doe",
  title: "Creative and Innovative Web Developer",
  location: "Pleasantville, CA 94588",
  phone: "(555) 123-4567",
  email: "john.doe@gmail.com",
  website: "https://johndoe.me/",
  linkedin: "johndoe",
  github: "johndoe",
  summary:
    "Innovative Web Developer with 5 years of experience in building impactful and user-friendly websites and applications. Specializes in front-end technologies and passionate about modern web standards and cutting-edge development techniques. Proven track record of leading successful projects from concept to deployment.",
  experience: [
    {
      company: "Creative Solutions Inc.",
      role: "Senior Web Developer",
      location: "San Francisco, CA",
      period: "January 2019 to Present",
      achievements: [
        "Spearheaded the redesign of the main product website, resulting in a 40% increase in user engagement.",
        "Developed and implemented a new responsive framework, improving cross-device compatibility.",
        "Mentored a team of four junior developers, fostering a culture of technical excellence.",
      ],
      website: "https://creativesolutions.inc/",
    },
    {
      company: "TechAdvancers",
      role: "Web Developer",
      location: "San Jose, CA",
      period: "June 2016 to December 2018",
      achievements: [
        "Collaborated in a team of 10 to develop high-quality web applications using React.js and Node.js.",
        "Managed the integration of third-party services such as Stripe for payments and Twilio for SMS services.",
        "Optimized application performance, achieving a 30% reduction in load times.",
      ],
      website: "https://techadvancers.com/",
    },
  ],
  education: {
    institution: "University of California",
    degree: "Bachelor's in Computer Science",
    period: "August 2012 to May 2016",
  },
  projects: [
    {
      name: "E-Commerce Platform",
      role: "Project Lead",
      description: "Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.",
    },
    {
      name: "Interactive Dashboard",
      role: "Frontend Developer",
      description:
        "Created an interactive analytics dashboard for a SaaS application, enhancing data visualization for clients.",
    },
  ],
  certifications: [
    {
      name: "Full-Stack Web Development",
      issuer: "CodeAcademy",
      year: "2020",
    },
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      year: "2019",
    },
  ],
  skills: {
    webTechnologies: ["HTML5", "JavaScript", "PHP", "Python"],
    frameworks: ["React.js", "Angular", "Vue.js", "Laravel", "Django"],
    tools: ["Webpack", "Git", "Jenkins", "Docker", "JIRA"],
  },
}

// Données pour les CV miniatures avec de vraies informations
export const miniCVs = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "UX Designer",
    company: "Google",
    avatar: "https://img.freepik.com/photos-gratuite/charmant-assistant-afro-americain-souriant-air-sympathique-vous-aide-faire-choix-souriant-agreablement-pointe-vers-index-gauche-favorisant-produit-espace-copie-debout-mur-blanc-joyeux-optimiste_176420-35359.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-pink-100 to-rose-100",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    title: "Data Scientist",
    company: "Microsoft",
    avatar: "https://img.freepik.com/photos-gratuite/beau-jeune-afro-americain-tshirt-polo-rose_176420-32115.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-blue-100 to-indigo-100",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    title: "Product Manager",
    company: "Apple",
    avatar: "https://img.freepik.com/photos-premium/femme-heureuse-souriante-tenant-quelque-chose-dans-sa-main_380164-288571.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-green-100 to-emerald-100",
  },
  {
    id: 4,
    name: "David Kim",
    title: "DevOps Engineer",
    company: "Amazon",
    avatar: "https://img.freepik.com/photos-gratuite/guy-chapeau-elegant-veste-beige-sourit-montre-son-doigt-camera_197531-23258.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-yellow-100 to-orange-100",
  },
  {
    id: 5,
    name: "Lisa Wang",
    title: "Frontend Dev",
    company: "Netflix",
    avatar: "https://img.freepik.com/psd-gratuit/portrait-adolescente_23-2151717384.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-purple-100 to-violet-100",
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    title: "Backend Dev",
    company: "Spotify",
    avatar: "https://img.freepik.com/psd-gratuit/homme-souriant-age-moyen-posant_23-2151842267.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-teal-100 to-cyan-100",
  },
  {
    id: 7,
    name: "Sophie Martin",
    title: "UI Designer",
    company: "Adobe",
    avatar: "https://img.freepik.com/photos-premium/portrait-jeune-femme-souriante-tour-fond_1048944-191737.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-red-100 to-pink-100",
  },
  {
    id: 8,
    name: "James Wilson",
    title: "Full Stack Dev",
    company: "Tesla",
    avatar: "https://img.freepik.com/photos-gratuite/jeune-photographe-masculin-elegant-utilisant-appareil-photo-tout-explorant-ville_23-2149186702.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-indigo-100 to-blue-100",
  },
  {
    id: 9,
    name: "Maria Garcia",
    title: "QA Engineer",
    company: "Meta",
    avatar: "https://img.freepik.com/photos-gratuite/femme-arabe-souriante-vue-face-posant-interieur_23-2150757142.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-emerald-100 to-green-100",
  },
  {
    id: 10,
    name: "Ryan O'Connor",
    title: "Mobile Dev",
    company: "Uber",
    avatar: "https://img.freepik.com/photos-gratuite/portrait-jeune-homme-dans-rue_641386-861.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-orange-100 to-yellow-100",
  },
  {
    id: 11,
    name: "Priya Patel",
    title: "AI Engineer",
    company: "OpenAI",
    avatar: "https://img.freepik.com/photos-gratuite/homme-souriant-tir-moyen_23-2149915905.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-violet-100 to-purple-100",
  },
  {
    id: 12,
    name: "Tom Anderson",
    title: "Security Expert",
    company: "Cloudflare",
    avatar: "https://img.freepik.com/photos-premium/portrait-jeune-homme-debout-contre-batiments_1048944-921993.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-cyan-100 to-teal-100",
  },
  {
    id: 13,
    name: "Nina Kowalski",
    title: "Scrum Master",
    company: "Atlassian",
    avatar: "https://img.freepik.com/photos-premium/portrait-jeune-femme-souriante_1048944-2195879.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-pink-100 to-red-100",
  },
  {
    id: 14,
    name: "Carlos Silva",
    title: "Cloud Architect",
    company: "AWS",
    avatar: "https://img.freepik.com/photos-gratuite/jeune-homme-chemise-rouge-chapeau-noir-debout-bras-croises-vue-face_176474-23350.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-blue-100 to-indigo-100",
  },
  {
    id: 15,
    name: "Yuki Tanaka",
    title: "Game Developer",
    company: "Unity",
    avatar: "https://img.freepik.com/photos-gratuite/agence-marketing-authentique-petite-jeune_23-2150167349.jpg?uid=R153625292&ga=GA1.1.1724044792.1741577356&semt=ais_hybrid&w=740",
    color: "from-green-100 to-emerald-100",
  },
]