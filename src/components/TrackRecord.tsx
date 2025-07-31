
import { TrendingUp, Users, MapPin } from 'lucide-react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

const TrackRecord = () => {
  const propertiesSold = useAnimatedCounter({ end: 2500 });
  const clientsServed = useAnimatedCounter({ end: 3200 });
  const siteVisits = useAnimatedCounter({ end: 15000 });

  const stats = [
    {
      icon: TrendingUp,
      count: propertiesSold,
      label: 'Properties Sold',
      suffix: '+'
    },
    {
      icon: Users,
      count: clientsServed,
      label: 'Clients Served',
      suffix: '+'
    },
    {
      icon: MapPin,
      count: siteVisits,
      label: 'Site Visits',
      suffix: '+'
    }
  ];

  return (
    <section className="py-16 bg-brand-green text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Track Record</h2>
          <p className="text-white/90 max-w-2xl mx-auto">
            Numbers that speak for themselves - a testament to our commitment and success in the real estate industry
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2">
                  {stat.count.toLocaleString()}{stat.suffix}
                </div>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrackRecord;
