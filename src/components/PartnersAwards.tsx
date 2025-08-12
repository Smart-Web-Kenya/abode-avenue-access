
import { useState } from 'react';

import award from '@/assets/images/award.webp';
import property from '@/assets/images/propertyas.jpeg';
import banking from '@/assets/images/bnking.jpg';
import insurance from '@/assets/images/insurance.webp';
import legal from '@/assets/images/legal.png';
import partner from '@/assets/images/plp.jpg'

const PartnersAwards = () => {
  const partners = [
    { name: "Real Estate Board", logo: partner },
    { name: "Property Association", logo: property },
    { name: "Banking Partner", logo: banking },
    { name: "Insurance Partner", logo: insurance },
    { name: "Legal Partners", logo: legal },
    { name: "Award Body", logo: award }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Partners & Awards</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by industry leaders and recognized for our excellence in real estate services
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-16 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersAwards;
