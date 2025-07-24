import Header from './components/Header'
import HeroSection from './components/HeroSection'
import CategorySection from './components/CategorySection'
import WhyChooseUs from './components/WhyChooseUs'
import PopularProducts from './components/PopularProducts'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import Contact from './components/Contact'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9f8f3]">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <WhyChooseUs />
        <PopularProducts />
        <TestimonialsSection />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
