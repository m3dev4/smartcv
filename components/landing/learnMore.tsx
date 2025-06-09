import { functionality } from '@/constants';
import Image from 'next/image';
import React from 'react';
import CircularCvDisplay from './circularCvDisplay';
import { motion } from 'framer-motion';

const LearnMore = () => {
  return (
    <div className="flex flex-col py-30 my-20 overfmlow-hidden px-8">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full py-5">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-3xl font-bold"
          >
            Riche en fonctionnalités, pas en prix.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-sm leading-relaxed py-2"
          >
            Reactive Resume est le fruit d’un travail passionné et rigoureux, ayant donné naissance
            à de nombreuses idées et fonctionnalités soigneusement améliorées pour tendre vers
            (presque) la perfection.
          </motion.p>
        </div>
        <div className="p-auto grid lg:grid-cols-5 md:grid-cols-2 gap-4">
          {functionality.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              key={index}
              className="border-1 p-4 flex gap-4 w-full  border-gray-200/10 rounded-lg items-center"
            >
              <Image src={feature.icon} alt={feature.title} width={20} height={20} />
              <p className="text-sm px-2">{feature.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center mt-24 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">
            Transformez votre parcours professionnel en opportunités
          </h2>
          <p className="text-lg leading-relaxed">
            Démarquez-vous dans un marché compétitif avec un CV qui reflète parfaitement vos
            compétences et expérience.
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full my-16"
      >
        <CircularCvDisplay />
      </motion.div>
    </div>
  );
};

export default LearnMore;
