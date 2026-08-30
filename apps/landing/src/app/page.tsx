
import { Metadata } from 'next'
import Hero from '@/components/Home/Hero'
import Faq from '@/components/Home/Faq'
import ProductShowcase from "@/components/Home/ProductShowcase";
import ObraFlow from "@/components/Home/ObraFlow";
import Pricing from '@/components/Home/Pricing';
import Benefits from "@/components/Home/Benefits";
import CTA from "@/components/Home/CTA";


export const metadata: Metadata = {
  title: 'ObraKit',
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Benefits />
      <ProductShowcase />
      <ObraFlow />
      <Pricing />
      <Faq />
      <CTA />
    </main>
  )
}
