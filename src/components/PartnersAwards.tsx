
import { useState } from 'react';

const PartnersAwards = () => {
  const partners = [
    { name: "Real Estate Board", logo: "https://via.placeholder.com/120x60/036153/FFFFFF?text=REB" },
    { name: "Property Association", logo: "https://via.placeholder.com/120x60/FF6500/FFFFFF?text=PA" },
    { name: "Banking Partner", logo: "https://via.placeholder.com/120x60/036153/FFFFFF?text=BANK" },
    { name: "Insurance Partner", logo: "https://via.placeholder.com/120x60/FF6500/FFFFFF?text=INS" },
    { name: "Legal Partners", logo: "https://via.placeholder.com/120x60/036153/FFFFFF?text=LAW" },
    { name: "Award Body", logo: "https://via.placeholder.com/120x60/FF6500/FFFFFF?text=AWARD" }
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
