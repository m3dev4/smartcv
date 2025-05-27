'use client';

import ContributeSection from '@/components/landing/contributeSection';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import LearnMore from '@/components/landing/learnMore';
import Testimonial from '@/components/landing/testimonial';
import React, { useEffect, useState } from 'react';

const LandingPage = () => {
    return (
        <main className="w-full h-full ">
            <Header />
            <div className="container relative mx-auto">
                <Hero />
                <LearnMore />
                <Testimonial />
                <ContributeSection />
                <Footer />
            </div>
        </main>
    );
};

export default LandingPage;
