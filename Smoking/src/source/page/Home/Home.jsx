import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Section from './Section'
import TeamSection from './TeamSection'
import FAQWithImage from './FAQWithImage'
import FeedBack from './FeedBack'
import NewsSection from './NewsSection'
import Footer from './Footer'
import UpgradePackages from './UpgradePackages'

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <Section />
      <TeamSection />
      <FAQWithImage />
      <UpgradePackages />
      <FeedBack />
      <NewsSection />
      <Footer />
    </>
  )
}

export default Home
