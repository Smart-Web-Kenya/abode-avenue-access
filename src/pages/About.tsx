
import Header from '@/components/Header';
import AboutUs from '@/components/AboutUs';
import WhyChooseUs from '@/components/WhyChooseUs';
import TrackRecord from '@/components/TrackRecord';
import Footer from '@/components/Footer';
import person1 from '@/assets/images/person1.jpg';
import person2 from '@/assets/images/person2.jpeg';
import person3 from '@/assets/images/person3.jpg';
import person4 from '@/assets/images/person4.jpeg';


const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Merit Africa Homes</h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property across Africa
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUs />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Track Record Section */}
      <TrackRecord />

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to helping you achieve your real estate goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Benson Ochieng",
                role: "Senior Real Estate Agent",
                image:person4
              },
              {
                name: "Michael Chen",
                role: "Property Investment Specialist",
                image: person2
              },
              {
                name: "Emma Williams",
                role: "Market Research Analyst",
                image: person3
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-teal-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
