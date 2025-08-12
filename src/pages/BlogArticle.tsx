
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BlogArticle = () => {
  const { id } = useParams();

  // Mock article data - in a real app, this would be fetched based on the ID
  const article = {
    id: 1,
    title: "10 Tips for First-Time Home Buyers in Africa",
    content: `
      <p>Buying your first home is one of the most significant financial decisions you'll ever make, especially in the dynamic African real estate market. With proper preparation and knowledge, you can navigate this process successfully and find the perfect property for your needs.</p>

      <h2>1. Understand Your Financial Position</h2>
      <p>Before you start house hunting, it's crucial to have a clear understanding of your financial situation. Calculate your monthly income, expenses, and existing debts. This will help you determine how much you can realistically afford for a monthly mortgage payment.</p>

      <h2>2. Get Pre-approved for a Mortgage</h2>
      <p>Getting pre-approved for a mortgage gives you a clear idea of your budget and shows sellers that you're a serious buyer. Shop around with different lenders to find the best interest rates and terms.</p>

      <h2>3. Research the Local Market</h2>
      <p>Each African market has its unique characteristics. Research property values, neighborhood trends, and future development plans in your area of interest. This knowledge will help you make informed decisions.</p>

      <h2>4. Consider Location Carefully</h2>
      <p>Location is everything in real estate. Consider factors like proximity to work, schools, healthcare facilities, and transportation links. A good location often means better resale value in the future.</p>

      <h2>5. Budget for Additional Costs</h2>
      <p>Remember that the purchase price is just one part of the total cost. Budget for closing costs, legal fees, property taxes, insurance, and potential renovation costs.</p>

      <h2>6. Work with Qualified Professionals</h2>
      <p>Engage with reputable real estate agents, lawyers, and surveyors who understand the local market. Their expertise can save you time, money, and potential legal issues.</p>

      <h2>7. Inspect Before You Buy</h2>
      <p>Always conduct a thorough property inspection before finalizing your purchase. This can reveal potential issues that might cost you significantly later.</p>

      <h2>8. Understand the Legal Requirements</h2>
      <p>Different African countries have varying legal requirements for property ownership. Make sure you understand all documentation, restrictions, and processes involved.</p>

      <h2>9. Don't Rush the Decision</h2>
      <p>Take your time to view multiple properties and compare options. A hasty decision can lead to buyer's remorse and financial strain.</p>

      <h2>10. Plan for the Future</h2>
      <p>Consider your long-term plans when buying a home. Will this property meet your needs in 5-10 years? Is there potential for value appreciation?</p>

      <p>By following these tips and working with experienced professionals, you'll be well-equipped to make a smart first home purchase in the African real estate market.</p>
    `,
    author: "Sarah Johnson",
    date: "2024-01-15",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
    readTime: "5 min read",
    tags: ["First-time buyers", "Home buying", "Africa", "Real estate tips"]
  };

  const relatedArticles = [
    {
      id: 2,
      title: "The Rise of Smart Homes in Nigerian Cities",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "Investment Opportunities in African Real Estate Markets",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
      date: "2024-01-10"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Article Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link to="/blog" className="inline-flex items-center text-teal-600 hover:text-teal-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-teal-600 text-white mb-4">{article.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{article.title}</h1>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-teal-600 border-teal-600">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} to={`/blog/${relatedArticle.id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(relatedArticle.date).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogArticle;
