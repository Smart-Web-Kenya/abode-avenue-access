
import houses from '@/assets/images/houses.jpg';

const AboutUs = () => {

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                With over 15 years of experience in the real estate industry, we've built our reputation on trust, 
                expertise, and unwavering commitment to our clients. Our team of dedicated professionals understands 
                that buying or selling a property is one of life's most significant decisions.
              </p>
              <p>
                We pride ourselves on providing personalized service, leveraging cutting-edge technology, and 
                maintaining deep knowledge of local markets to ensure our clients achieve their real estate goals. 
                From first-time buyers to seasoned investors, we guide every client through their journey with 
                transparency and professionalism.
              </p>
              <p>
                Our mission is simple: to make real estate transactions smooth, successful, and stress-free for 
                everyone we serve. We don't just sell properties; we build lasting relationships and help create 
                communities where people thrive.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src={houses}
              alt="Our team"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
