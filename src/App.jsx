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
import NumerologyPage from './pages/Numerology'
import AboutPage from './pages/About'
import RudrakshaPage from './pages/Rudraksha'
import VaastuPage from './pages/Vaastu'
import LoveMarriagePage from './pages/LoveMarriage'
import HealthPage from './pages/Health'
import CareerPage from './pages/Career'
import FinancePage from './pages/Finance'
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
        <Route path="/rudraksha" element={<RudrakshaPage />} />
        <Route path="/mantra" element={<MantrasPage />} />
        <Route path="/vedic-astrology" element={<VedicAstrologyPage />} />
        <Route path='/numerology' element={<NumerologyPage/>}/>
        <Route path='/about' element={<AboutPage />} />
        <Route path='/vaastu' element={<VaastuPage />} />
        <Route path='/life-solutions/love-marriage' element={<LoveMarriagePage />} />
        <Route path='/life-solutions/health' element={<HealthPage />} />
        <Route path='/life-solutions/career' element={<CareerPage />} />
        <Route path='/life-solutions/finance' element={<FinancePage />} />
      </Routes>
      <Footer />  {/* ✅ Renders on every route */}
    </BrowserRouter>
  )
}