import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

// Données d'exemple pour le CV principal
const mainCV = {
  name: 'John Doe',
  title: 'Creative and Innovative Web Developer',
  location: 'Pleasantville, CA 94588',
  phone: '(555) 123-4567',
  email: 'john.doe@gmail.com',
  website: 'https://johndoe.me/',
  linkedin: 'johndoe',
  github: 'johndoe',
  summary:
    'Innovative Web Developer with 5 years of experience in building impactful and user-friendly websites and applications. Specializes in front-end technologies and passionate about modern web standards and cutting-edge development techniques. Proven track record of leading successful projects from concept to deployment.',
  experience: [
    {
      company: 'Creative Solutions Inc.',
      role: 'Senior Web Developer',
      location: 'San Francisco, CA',
      period: 'January 2019 to Present',
      achievements: [
        'Spearheaded the redesign of the main product website, resulting in a 40% increase in user engagement.',
        'Developed and implemented a new responsive framework, improving cross-device compatibility.',
        'Mentored a team of four junior developers, fostering a culture of technical excellence.',
      ],
      website: 'https://creativesolutions.inc/',
    },
    {
      company: 'TechAdvancers',
      role: 'Web Developer',
      location: 'San Jose, CA',
      period: 'June 2016 to December 2018',
      achievements: [
        'Collaborated in a team of 10 to develop high-quality web applications using React.js and Node.js.',
        'Managed the integration of third-party services such as Stripe for payments and Twilio for SMS services.',
        'Optimized application performance, achieving a 30% reduction in load times.',
      ],
      website: 'https://techadvancers.com/',
    },
  ],
  education: {
    institution: 'University of California',
    degree: "Bachelor's in Computer Science",
    period: 'August 2012 to May 2016',
  },
  projects: [
    {
      name: 'E-Commerce Platform',
      role: 'Project Lead',
      description:
        'Led the development of a full-stack e-commerce platform, improving sales conversion by 25%.',
    },
    {
      name: 'Interactive Dashboard',
      role: 'Frontend Developer',
      description:
        'Created an interactive analytics dashboard for a SaaS application, enhancing data visualization for clients.',
    },
  ],
  certifications: [
    {
      name: 'Full-Stack Web Development',
      issuer: 'CodeAcademy',
      year: '2020',
    },
    {
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      year: '2019',
    },
  ],
  skills: {
    webTechnologies: ['HTML5', 'JavaScript', 'PHP', 'Python'],
    frameworks: ['React.js', 'Angular', 'Vue.js', 'Laravel', 'Django'],
    tools: ['Webpack', 'Git', 'Jenkins', 'Docker', 'JIRA'],
  },
};

// Données pour les CV miniatures
const miniCVs = Array(15)
  .fill(null)
  .map((_, index) => ({
    id: index,
    imageSrc: `/avatars/avatar-${(index % 5) + 1}.png`, // Vous devrez créer ces images
  }));

const CircularCvDisplay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation des miniatures CV
    const container = containerRef.current;
    if (!container) return;

    const miniatures = container.querySelectorAll('.mini-cv');
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.85; // Augmenter le rayon pour plus d'espace

    // Fonction pour positionner les miniatures
    const positionMiniatures = (rotation: number) => {
      miniatures.forEach((mini, index) => {
        const angle = rotation + (index / miniatures.length) * Math.PI * 2;
        const x = centerX + radius * Math.cos(angle) - 32; // 32 est la moitié de la taille des miniatures
        const y = centerY + radius * Math.sin(angle) - 32;

        (mini as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    // Position initiale
    positionMiniatures(0);

    // Animation de rotation
    let animationFrame: number;
    let rotation = 0;

    const animate = () => {
      rotation += 0.001; // Augmenter la vitesse de rotation
      positionMiniatures(rotation);
      animationFrame = requestAnimationFrame(animate);
    };

    // Démarrer l'animation
    animate();

    // Nettoyer l'animation lorsque le composant est démonté
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="py-16 px-4">
      <div ref={containerRef} className="relative w-full h-[700px] mx-auto overflow-hidden">
        {/* CV principal au centre */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-[380px] max-h-[480px] overflow-auto scale-[0.7]">
          {/* En-tête du CV */}
          <div className="text-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden mb-4 mx-auto">
              <Image
                src="/avatars/main-avatar.png"
                alt={mainCV.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold mb-1">{mainCV.name}</h1>
            <p className="text-md text-gray-600 mb-3">{mainCV.title}</p>

            <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{mainCV.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{mainCV.phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{mainCV.email}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 mb-3">
              <a
                href={mainCV.website}
                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                {mainCV.website}
              </a>
              <a
                href={`https://linkedin.com/in/${mainCV.linkedin}`}
                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                {mainCV.linkedin}
              </a>
              <a
                href={`https://github.com/${mainCV.github}`}
                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                {mainCV.github}
              </a>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Résumé */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center mb-2">Résumé</h2>
            <p className="text-sm leading-relaxed text-gray-600">{mainCV.summary}</p>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Expérience */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center mb-4">Expérience</h2>
            {mainCV.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">{exp.company}</h3>
                  <span className="text-sm text-gray-500">{exp.location}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">{exp.role}</p>
                  <span className="text-sm text-gray-500">{exp.period}</span>
                </div>
                <ul className="list-disc pl-5 mb-2 text-sm">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx} className="text-gray-600 mb-1">
                      {achievement}
                    </li>
                  ))}
                </ul>
                <a
                  href={exp.website}
                  className="text-blue-500 hover:underline text-xs flex items-center gap-1 mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  {exp.website}
                </a>
              </div>
            ))}
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Éducation */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center mb-4">Éducation</h2>
            <div>
              <h3 className="font-medium">{mainCV.education.institution}</h3>
              <p className="text-sm text-gray-600">{mainCV.education.degree}</p>
              <p className="text-sm text-gray-500">{mainCV.education.period}</p>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Projets */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center mb-4">Projets</h2>
            <div className="grid grid-cols-2 gap-4">
              {mainCV.projects.map((project, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.role}</p>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Certifications */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-center mb-4">Certifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {mainCV.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

          {/* Compétences */}
          <div>
            <h2 className="text-lg font-semibold text-center mb-4">Compétences</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-1">Web Technologies</h3>
                <p className="text-sm text-gray-600">{mainCV.skills.webTechnologies.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Frameworks</h3>
                <p className="text-sm text-gray-600">{mainCV.skills.frameworks.join(', ')}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Outils</h3>
                <p className="text-sm text-gray-600">{mainCV.skills.tools.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Miniatures de CV qui tournent autour */}
        {miniCVs.map(miniCV => (
          <div
            key={miniCV.id}
            className="mini-cv absolute w-16 h-16 rounded-full bg-gray-200 overflow-hidden shadow-md transition-transform duration-1000 z-0"
            style={{ transform: 'translate(0, 0)' }} // Position initiale, sera mise à jour par JavaScript
          >
            <Image
              src={miniCV.imageSrc}
              alt="Miniature CV"
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularCvDisplay;
