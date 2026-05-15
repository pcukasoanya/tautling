import React, { lazy, Suspense } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Navigation } from './Navigation';
import { Hero } from './Hero';
import './globals.css';

const BentoCollection = lazy(() => import('./BentoCollection'));
const Specifications = lazy(() => import('./Specifications'));
const PerformanceLab = lazy(() => import('./PerformanceLab'));
const ClimateSection = lazy(() => import('./Climate'));
const Pricing = lazy(() => import('./Pricing'));
const Contact = lazy(() => import('./Contact'));
const Footer = lazy(() => import('./Footer'));

function SectionFallback() {
  return <div className="h-96 bg-bone animate-pulse" />;
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="bg-bone text-graphite" style={{ backgroundColor: '#f8f6f2', color: '#1a1a1a', fontFamily: 'Satoshi, Inter, system-ui, sans-serif' }}>
        <Navigation />
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <BentoCollection />
          <Specifications />
          <PerformanceLab />
          <ClimateSection />
          <Pricing />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </LazyMotion>
  );
}

export default App;
