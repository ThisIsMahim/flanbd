import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <Hero />
            <FeaturedProducts />

            {/* Add more home sections as needed:
      <Collections />
      <Testimonials />
      <VideoSection />
      <Newsletter />
      */}
        </div>
    );
};

export default HomePage;
