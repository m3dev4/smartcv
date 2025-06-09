'use client';

import ContributeSection from '@/components/landing/contributeSection';
import Footer from '@/components/landing/footer';
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import LearnMore from '@/components/landing/learnMore';
import Testimonial from '@/components/landing/testimonial';
import React, { useEffect, useState } from 'react';

/**
 * The main landing page component.
 *
 * This component renders the main landing page, and contains the following components:
 *
 * - {@link Header}: The header component containing the logo and navigation.
 * - {@link Hero}: The main hero component containing the title and call-to-action.
 * - {@link LearnMore}: A component that renders the learn more section.
 * - {@link Testimonial}: A component that renders the testimonial section.
 * - {@link ContributeSection}: A component that renders the contribute section.
 * - {@link Footer}: The footer component containing the copyright and other details.
 *
 * @return The main landing page component.
 */
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
