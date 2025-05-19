import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './assets/Components/Header'
import Hero from './assets/Components/Hero'
import Footer from './assets/Components/Footer/Footer'
import NewsSection from './assets/Components/BlogNews/NewsSection'
import FeedBack from './assets/Components/FeedBack/FeedBack'
import Section from './assets/Components/Section'

function App() {
 

  return (
    <>
     <Header/>
     <Hero/>
     <Section/>
      <FeedBack/>
     <NewsSection/>
     <Footer/>
    </>
  )
}

export default App
