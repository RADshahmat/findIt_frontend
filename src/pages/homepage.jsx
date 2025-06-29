
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/homepage/Hero"
import CityRegionSelector from "../components/homepage/CityRegionSelector"
import CategoryGrid from "../components/homepage/CategoryGrid"
import FeaturesComponent from "../components/homepage/Features"
import HowItWorks from "../components/homepage/HowItWorks"
import Statistics from "../components/homepage/Statistics"
import TestimonialsComponent from "../components/homepage/Testimonials"
import FAQ from "../components/homepage/FAQ"
import CTA from "../components/homepage/CTA"
import Footer from "../components/Footer"
import SearchBar from "../components/homepage/SearchBar"

function HomePage() {
  //const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrollY, setScrollY] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  
  const handleSearch = (query) => {
    setSearchQuery(query)
    //console.log("Searching for:", query)
    // In a real app, you would connect this to your backend
  } 
    

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const sections = ["home", "features", "how-it-works", "testimonials", "faq"]

    const sectionElements = sections.map((section) => ({
      id: section,
      element: document.getElementById(section),
      offset: document.getElementById(section)?.offsetTop - 100,
    }))

    const currentSection = sectionElements.reduce((acc, section) => {
      if (scrollY >= section.offset) {
        return section.id
      }
      return acc
    }, "home")

   setActiveSection(currentSection)
  }, [scrollY])





  return (

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <Hero onSearch={handleSearch} />
      <SearchBar onSearch={handleSearch} className="lg:hidden mx-auto max-w-md px-4 -mt-6 mb-16" />
      <CityRegionSelector />
      <CategoryGrid />
      <FeaturesComponent />
      <HowItWorks />
      <Statistics />
      <TestimonialsComponent />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default HomePage;
