import HeroSection from './components/HeroSection'
import CategorySection from './components/CategorySection'
import PromoBanners from './components/PromoBanners'
import PopularProducts from './components/PopularProducts'
import WhyChooseUs from './components/WhyChooseUs'
import FarmToHomeSection from './components/FarmToHomeSection'

import NaturalFreshSection from './components/NaturalFreshSection'
import PartnerWithUsSection from './components/PartnerWithUsSection'
import BottomBanner from './components/BottomBanner'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <main className="flex-grow">
        <HeroSection />
        <CategorySection />
        <PromoBanners />
        <PopularProducts />
        <WhyChooseUs /> {/* Feature Section: Organic And Fresh */}
        <FarmToHomeSection />
        <NaturalFreshSection />
        <PartnerWithUsSection />

      </main>
    </div>
  )
}
