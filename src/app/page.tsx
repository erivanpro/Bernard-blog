import React from 'react'
import Navbar from './components/navbar'
import Blog from './components/blog'
import Hero from './components/hero'
import Presentation from './components/presentation'
import Footer from './components/footer'

export default function Home() {
  return (
    <>
        <Hero/>
        <Blog/>
        <Presentation/>
        <Footer/>
    </>
  )
}
