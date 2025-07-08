"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaChevronRight, FaBolt, FaMicrochip, FaShieldAlt, FaTools, FaThumbsUp, FaHeart, FaSearch, FaTimes } from 'react-icons/fa';
import Hero from './component/Hero';
import FeaturedProducts from './component/FeaturedProducts';
import Categories from './component/Categories';
import PerformanceSection from './component/PerformanceSection';
import Testimonials from './component/Testimonials';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <PerformanceSection />
      <Testimonials />
    </>
  );
}