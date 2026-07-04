import { HeroSection } from '@/features/landing/components/HeroSection'
import { TrustedBySection } from '@/features/landing/components/TrustedBySection'
import { FeaturesSection } from '@/features/landing/components/FeaturesSection'
import { ProgramsSection } from '@/features/landing/components/ProgramsSection'
import { BMISection } from '@/features/landing/components/BMISection'
import { PricingSection } from '@/features/landing/components/PricingSection'
import { TrainersSection } from '@/features/landing/components/TrainersSection'
import { AppCTASection } from '@/features/landing/components/AppCTASection'

export function LandingPage() {
  return (
    <div className="relative">
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <ProgramsSection />
      <BMISection />
      <PricingSection />
      <TrainersSection />
      <AppCTASection />
    </div>
  )
}
