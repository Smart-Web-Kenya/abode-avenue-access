
import { Award, Building, Users, FileText } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

const WhyChooseUs = () => {
  const yearsCount = useAnimatedCounter({ end: 15 });
  const projectsCount = useAnimatedCounter({ end: 500 });
  const clientsCount = useAnimatedCounter({ end: 1200 });
  const deedsCount = useAnimatedCounter({ end: 450 });

  const stats = [
    {
      icon: Award,
      count: yearsCount,
      label: 'Years of Experience',
      suffix: '+'
    },
    {
      icon: Building,
      count: projectsCount,
      label: 'Projects Completed',
      suffix: '+'
    },
    {
      icon: Users,
      count: clientsCount,
      label: 'Happy Clients',
      suffix: '+'
    },
    {
      icon: FileText,
      count: deedsCount,
      label: 'Title Deeds Issued',
      suffix: '+'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We deliver exceptional real estate services with proven results and unwavering commitment to our clients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-brand-green/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-brand-green" />
                </div>
                <div className="text-3xl font-bold text-brand-green mb-2">
                  {stat.count}{stat.suffix}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
