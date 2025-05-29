import React from 'react';
import { IBM_Plex_Sans } from 'next/font/google';
import { Button } from '../ui/button';
import { GridBackground } from '../backgroundGrid';
import { cn } from '@/lib/utils';
import { companys } from '@/constants';
import Image from 'next/image';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

const Hero = () => {
  return (
    <main className="container relative mx-auto w-full">
      <div className="relative flex h-[40rem] w-full bg-white dark:bg-black">
        <div
          className={cn(
            'absolute inset-0',
            '[background-size:40px_40px]',
            '[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]',
            'dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]'
          )}
        />
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center absolute top-0 left-0 w-full h-full ${ibmPlexSans.className}`}
        >
          {/* Left container */}
          <div className="">
            <div className="">
              <p className="font-medium">Enfin,</p>
              <h1 className="text-6xl lg:text-[60px] font-bold leading-tight">
                Un créateur de CV professionnel
                <span className="block">gratuit et</span>
                <span className="block">moderne</span>
              </h1>
              <p className="text-xl leading-relaxed max-w-lg">
                Un créateur de CV gratuit et open-souce qui simplifie le processus de création, mise
                à jour et partage de votre CV professionnel.
              </p>
            </div>
            {/* Action Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                Commencer
              </Button>
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <span className="mr-2">📖</span>
                En savoir plus
              </Button>
            </div>
          </div>
          {/* Right container */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ">
              {/* img hero */}

              {/* overlay  */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div> */}

      <section className="mt-24 grid  md:gridcols-3 gap-8">
        <div className="text-center space-y-3">
          <h3 className="text-muted-foreground text-xl font-semibold ">
            Smart CV a contribué au succès professionnel de candidats recrutés par :
          </h3>
          <div className="flex items-center justify-center gap-20">
            {companys.map((company, index) => (
              <div key={index} className="">
                <Image
                  src={company.image}
                  alt={company.name}
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
