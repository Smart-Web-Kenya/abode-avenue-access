
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import nigeria from '@/assets/images/nigeria.jpg';
import h1 from '@/assets/images/h1.webp';
import h2 from '@/assets/images/aff.jpg';
import hmerket from '@/assets/images/hmarket.webp';
import h3 from '@/assets/images/h3.jpeg';
import nbo from '@/assets/images/nbo.webp';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "The Future of Smart Homes: Tech Innovations in Real Estate",
      excerpt: "Buying your first home can be overwhelming. Here are essential tips to help you navigate the African real estate market successfully.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      category: "Buying Guide",
      image: h2,
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Rent vs. Buy: Which Option Makes More Sense in Today’s Market?",
      excerpt: "Explore how technology is revolutionizing residential properties across major Nigerian cities and what it means for property values.",
      author: "Michael Chen",
      date: "2024-01-12",
      category: "Technology",
      image:nigeria,
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Investment Opportunities in Kenyan Real Estate Markets",
      excerpt: "Discover the most promising real estate investment opportunities across Africa and how to maximize your returns.",
      author: "Emma Williams",
      date: "2024-01-10",
      category: "Investment",
      image: h1,
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Sustainable Building Practices in Modern Kenyan Architecture",
      excerpt: "Learn about eco-friendly construction methods that are shaping the future of African real estate development.",
      author: "David Okafor",
      date: "2024-01-08",
      category: "Sustainability",
      image: h3,
      readTime: "8 min read"
    },
    {
      id: 5,
      title: "Profitable Real Estate Investment Opportunities in Kenya",
      excerpt: "Our comprehensive analysis of real estate market trends and predictions for the African property market in 2024.",
      author: "Sarah Johnson",
      date: "2024-01-05",
      category: "Market Analysis",
      image: nbo,
      readTime: "10 min read"
    },
    {
      id: 6,
      title: "How to Increase Your Property Value Before Selling",
      excerpt: "Understanding the legal framework and documentation required for property transactions across different African countries.",
      author: "Michael Chen",
      date: "2024-01-03",
      category: "Legal",
      image: hmerket,
      readTime: "12 min read"
    }
  ];

  const categories = ["All", "Buying Guide", "Technology", "Investment", "Sustainability", "Market Analysis", "Legal"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Real Estate Blog</h1>
          <p className="text-xl md:text-2xl text-teal-100 max-w-3xl mx-auto">
            Stay informed with the latest insights, trends, and tips from the African real estate market
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredPosts.length} Article{filteredPosts.length !== 1 ? 's' : ''} Found
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-teal-600 text-white">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(post.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <div className="flex items-center text-teal-600 font-medium group-hover:text-teal-700 transition-colors">
                      <span>Read More</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button className="bg-teal-600 text-white">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
