import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Home'
import GemstonesPage from './pages/Gemstones'
import './index.css'
import MysticalServices from './components/Services'
import Testimonials from './components/Testimonials'
import ServicesGrid from './components/ServicesGrid'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import KnowYourAstrologer from './components/Astrologer'
import Footer from './components/Footer'
import MantrasPage from './pages/Mantras'
import VedicAstrologyPage from './pages/Vedic'
gsap.registerPlugin(ScrollTrigger);

function MainLayout() {
  return (
    <>
      
      <Homepage />
      <MysticalServices />
      <ServicesGrid />
      <KnowYourAstrologer />
      <Testimonials />
      
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />  {/* ✅ Renders on every route */}
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/gemstones" element={<GemstonesPage />} />
        <Route path="/mantra" element={<MantrasPage />} />
        <Route path="/vedic-astrology" element={<VedicAstrologyPage />} />
      </Routes>
      <Footer />  {/* ✅ Renders on every route */}
    </BrowserRouter>
  )
}