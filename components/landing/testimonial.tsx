import React, { useState } from 'react';
import { TestimonialsSection } from '../testimonials-with-marquee';
import { tesimonials } from '@/constants';

const Testimonial = () => {
    return (
        <div className="w-full h-full flex flex-1 flex-col overflow-hidden items-center justify-center mt-12 mb-12">
            <div className="max-w-[1280px] animate-marquee">
                <TestimonialsSection
                    title="Témoignages"
                    description="J'apprécie toujours que les utilisateurs de Reactive Resume me fassent part de leurs commentaires ou de leur soutien. Voici quelques-uns des messages que j'ai reçus."
                    testimonials={tesimonials}
                />
            </div>
        </div>
    );
};

export default Testimonial;
