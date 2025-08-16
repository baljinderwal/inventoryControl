import React from 'react';
import HeroSection from './HeroSection';
import FeaturesCarousel from './FeaturesCarousel';
import FeatureSections from './FeatureSections';
import ThemingDemo from './ThemingDemo';
import TechStack from './TechStack';
import DemoVideo from './DemoVideo';
import Testimonials from './Testimonials';
import CTASection from './CTASection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesCarousel />
      <FeatureSections />
      <ThemingDemo />
      <TechStack />
      <DemoVideo />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default HomePage;
