import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import Layout from './components/Layout';

// Home is eager (primary entry); secondary pages are code-split so they don't
// bloat the initial bundle — each loads on first navigation.
import Home from './pages/Home';
const Clients = lazy(() => import('./pages/Clients'));
const WhatWeDo = lazy(() => import('./pages/WhatWeDo'));
const About = lazy(() => import('./pages/About'));
const Team = lazy(() => import('./pages/Team'));
const TeamMember = lazy(() => import('./pages/TeamMember'));
const Careers = lazy(() => import('./pages/Careers'));
const RoleDetail = lazy(() => import('./pages/RoleDetail'));
const Apply = lazy(() => import('./pages/Apply'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:slug" element={<TeamMember />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:slug" element={<RoleDetail />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
          </Route>
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}
