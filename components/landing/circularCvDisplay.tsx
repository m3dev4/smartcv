'use client';

import type React from 'react';
import { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { mainCV, miniCVs } from '@/constants';

const CircularCvDisplay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const centerRef = useRef<{ x: number; y: number; radius: number }>({ x: 0, y: 0, radius: 0 });

  // Fonction pour calculer les dimensions du cercle
  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    centerRef.current = { x: centerX, y: centerY, radius };
  }, []);

  // Fonction pour positionner les miniatures avec une rotation basée sur le temps
  const positionMiniatures = useCallback((timestamp: number) => {
    const container = containerRef.current;
    if (!container) return;

    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const miniatures = container.querySelectorAll('.mini-cv');
    const { x: centerX, y: centerY, radius } = centerRef.current;

    // Utiliser le temps écoulé pour une rotation stable
    const elapsedTime = (timestamp - startTimeRef.current) / 1000; // en secondes
    const rotationSpeed = 0.2; // radians par seconde (ajustez selon vos préférences)
    const baseRotation = elapsedTime * rotationSpeed;

    miniatures.forEach((mini, index) => {
      const angle = baseRotation + (index / miniatures.length) * Math.PI * 2;
      const x = centerX + radius * Math.cos(angle) - 40; // 40 = moitié de la taille (80px/2)
      const y = centerY + radius * Math.sin(angle) - 40;

      // Utiliser transform3d pour de meilleures performances
      (mini as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    animationRef.current = requestAnimationFrame(positionMiniatures);
  }, []);

  useEffect(() => {
    updateDimensions();

    // Démarrer l'animation
    animationRef.current = requestAnimationFrame(positionMiniatures);

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);

    // Nettoyer l'animation et les événements
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [positionMiniatures, updateDimensions]);

  return (
    <div className="py-16 px-4 min-h-screen">
      <div ref={containerRef} className="relative w-full h-[700px] mx-auto overflow-hidden">
        {/* CV principal au centre */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-[380px] max-h-[480px] overflow-auto scale-[0.7]">
          {/* En-tête du CV */}
          <div className="text-center mb-6">
            <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden mb-4 mx-auto">
              <Image
                src="/placeholder.svg?height=96&width=96"
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
            className={`mini-cv absolute w-20 h-20 rounded-full bg-gradient-to-br ${miniCV.color} overflow-hidden shadow-lg border-2 border-white z-0 will-change-transform hover:scale-110 transition-transform duration-200 cursor-pointer group`}
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {/* Contenu de la miniature CV */}
            <div className="relative w-full h-full p-1 flex flex-col items-center justify-center text-center">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden mb-1 border border-white/50">
                <Image
                  src={miniCV.avatar || '/placeholder.svg'}
                  alt={miniCV.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Nom (tronqué) */}
              <div className="text-[8px] font-semibold text-gray-700 leading-tight mb-0.5 truncate w-full px-0.5">
                {miniCV.name.split(' ')[0]}
              </div>

              {/* Titre */}
              <div className="text-[6px] text-gray-600 leading-tight truncate w-full px-0.5">
                {miniCV.title}
              </div>

              {/* Tooltip au hover */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="font-semibold">{miniCV.name}</div>
                <div className="text-[10px]">
                  {miniCV.title} @ {miniCV.company}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircularCvDisplay;
