import { functionality } from '@/constants';
import Image from 'next/image';
import React from 'react';
import CircularCvDisplay from './circularCvDisplay';

const LearnMore = () => {
  return (
    <div className="flex flex-col py-30 my-20 overfmlow-hidden px-8">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full py-5">
          <h2 className="text-3xl font-bold">Riche en fonctionnalités, pas en prix.</h2>
          <p className="text-sm leading-relaxed py-2">
            Reactive Resume est le fruit d’un travail passionné et rigoureux, ayant donné naissance
            à de nombreuses idées et fonctionnalités soigneusement améliorées pour tendre vers
            (presque) la perfection.
          </p>
        </div>
        <div className="p-auto grid lg:grid-cols-5 md:grid-cols-2 gap-4">
          {functionality.map((feature, index) => (
            <div
              key={index}
              className="border-1 p-4 flex gap-4 w-full  border-gray-200/10 rounded-lg items-center"
            >
              <Image src={feature.icon} alt={feature.title} width={20} height={20} />
              <p className="text-sm px-2">{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center mt-24 mb-12">
        <div className="w-full text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Transformez votre parcours professionnel en opportunités
          </h2>
          <p className="text-lg leading-relaxed">
            Démarquez-vous dans un marché compétitif avec un CV qui reflète parfaitement vos
            compétences et expérience.
          </p>
        </div>
      </div>
      <div className="w-full my-16">
        <CircularCvDisplay />
      </div>
    </div>
  );
};

export default LearnMore;
