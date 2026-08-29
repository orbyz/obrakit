
import { Metadata } from 'next'
import Hero from '@/components/Home/Hero'
import Faq from '@/components/Home/Faq'
import ProductShowcase from "@/components/Home/ProductShowcase";
import ObraFlow from "@/components/Home/ObraFlow";

export const metadata: Metadata = {
  title: 'ObraKit',
}

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductShowcase />
      <ObraFlow />
      <Faq/>
    </main>
  )
}
