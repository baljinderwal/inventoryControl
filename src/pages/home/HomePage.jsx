import React, { useRef } from 'react';
import HeroSection from './HeroSection';
import FeaturesCarousel from './FeaturesCarousel';
import FeatureSections from './FeatureSections';
import ThemingDemo from './ThemingDemo';
import TechStack from './TechStack';
import DemoVideo from './DemoVideo';
import Testimonials from './Testimonials';
import CTASection from './CTASection';

const HomePage = () => {
  const featuresRef = useRef(null);

  const handleScrollDown = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <HeroSection onScrollDown={handleScrollDown} />
      <FeaturesCarousel ref={featuresRef} />
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
