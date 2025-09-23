import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, ArrowLeft, Share2, Heart, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  authorName: string;
  author: string;
  createdAt: string;
  readTime?: string;
  categories?: string[];
  featuredImage?: {
    url: string;
    altText?: string;
  };
  tags?: string[];
}

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Array<{
    _id: string;
    title: string;
    slug: string;
    featuredImage?: { url: string };
    createdAt: string;
  }>>([]);

  useEffect(() => {
    console.log(slug)
    if (!slug) {
      setError('Invalid blog post URL');
      setLoading(false);
      return;
    } 
    
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the specific blog post using the correct URL format
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${slug}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        setBlog(data.data);

        
        // Fetch related posts (optional)
        if (data.data.categories?.length > 0) {
          fetchRelatedPosts(data.data.categories[0], data.data._id);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
        toast.error('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedPosts = async (category: string, currentPostId: string) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/blogs?category=${encodeURIComponent(category)}&limit=2`
        );
        
        if (response.ok) {
          const data = await response.json();
          // Filter out the current post and limit to 2 related posts
          const filtered = (data.data || [])
            .filter((post: any) => post._id !== currentPostId)
            .slice(0, 2);
          setRelatedPosts(filtered);
        }
      } catch (err) {
        console.error('Error fetching related posts:', err);
      }
    };

    fetchBlogPost();
  }, [slug]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog Post</h1>
            <p className="text-gray-600 mb-6">{error || 'The requested blog post could not be found.'}</p>
            <Button onClick={() => navigate('/blog')}>
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Article Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')} 
            className="text-teal-600 hover:text-teal-700 mb-6 pl-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="max-w-4xl mx-auto">
            {blog.categories?.map((category, index) => (
              <Badge key={index} className="bg-teal-600 text-white mb-4 mr-2">
                {category}
              </Badge>
            ))}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{blog.title}</h1>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  <span>{blog.authorName || 'Anonymous'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{blog.readTime || '5 min read'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
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
            {blog.featuredImage?.url && (
              <img
                src={blog.featuredImage.url}
                alt={blog.featuredImage.altText || blog.title}
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
            )}
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
            
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-teal-600 border-teal-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className="block">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                      {post.featuredImage?.url && (
                        <img
                          src={post.featuredImage.url}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-teal-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogArticle;
