import React, { useEffect } from 'react';
import { IBM_Plex_Sans } from 'next/font/google';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { companys } from '@/constants';
import Image from 'next/image';
import { useAuth } from '@/hooks/auth';
import Link from 'next/link';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

const Hero = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <main className="container relative mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="relative flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-auto lg:min-h-0 lg:items-center py-12 md:py-16 lg:py-24 bg-white dark:bg-black">
        <div
          className={cn(
            'absolute inset-0 z-0 opacity-30',
            '[background-size:30px_30px] sm:[background-size:40px_40px]',
            '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
            'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
          )}
        />
        <div
          className={`relative lg:-mt-30 grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full h-full ${ibmPlexSans.className}`}
        >
          <div className="flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeIn' }}
            >
              <p className="font-medium text-base sm:text-lg">Enfin,</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold leading-tight mt-1">
                Un créateur de CV professionnel
                <span className="block">gratuit et</span>
                <span className="block">moderne</span>
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <p className="text-lg sm:text-xl leading-relaxed max-w-md mx-auto lg:mx-0 mt-4">
                Un créateur de CV gratuit et open-source qui simplifie le processus de création,
                mise à jour et partage de votre CV professionnel.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Link href="/dashboard/resumes">
                  <Button
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-50 bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-md w-full sm:w-auto"
                  >
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-md w-full sm:w-auto"
                  >
                    Commencer
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-md w-full sm:w-auto"
              >
                En savoir plus
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
            className="relative mt-10 lg:mt-0"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl dark:shadow-slate-800/50">
              <Image
                src="/resumes/classic.png"
                alt="hero"
                width={900}
                height={690}
                className="object-contain max-w-full h-auto"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-16 md:py-24"
      >
        <div className="text-center space-y-4 md:space-y-6">
          <h3 className="text-muted-foreground text-lg sm:text-xl font-semibold px-4">
            Smart CV a contribué au succès professionnel de candidats recrutés par :
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 md:gap-x-16 gap-y-8 mt-8">
            {companys.map((company, index) => (
              <div key={index} className="flex-shrink-0">
                <Image
                  src={company.image}
                  alt={company.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default Hero;
