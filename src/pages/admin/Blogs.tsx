import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Search, List, Grid, Calendar, Clock, Tag, Folder, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {ImageIcon} from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorName: string;
  featuredImage?: {
    data?: {
      type: string;
      data: number[];
    };
    mimetype?: string;
    altText?: string;
    url?: string;
  };
  categories: string[];
  tags: string[];
  readTime: number;
  status: string;
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
  createdAt: string;
  slug: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // or 'authToken' depending on your app
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .trim();
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    authorName: "Admin User",
    featuredImage: { url: "", altText: "" },
    categories: [],
    tags: [],
    readTime: 5,
    status: "draft",
    seo: { metaTitle: "", metaDescription: "", keywords: [] },
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Blog;
    direction: "ascending" | "descending";
  }>({ key: "createdAt", direction: "descending" });
  const itemsPerPage = 9;

  // ✅ Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`, {
          headers: getAuthHeaders()
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            window.location.href = '/login';
            return;
          }
          throw new Error("Failed to fetch blogs");
        }
        
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        toast({
          title: "Error",
          description: "Failed to load blogs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ Handle form input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Open modal for create
  const openCreateModal = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      author: "",
      authorName: "Admin User",
      featuredImage: { url: "", altText: "" },
      categories: [],
      tags: [],
      readTime: 5,
      status: "draft",
      seo: { metaTitle: "", metaDescription: "", keywords: [] },
    });
    setSelectedBlog(null);
    setSelectedImage(null);
    setImagePreview(null);
    setShowCreateModal(true);
  };

  // ✅ Save (create or update)
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Generate slug from title
      const slug = generateSlug(formData.title || '');
      
      // Append text fields
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('slug', slug);  
      formDataToSend.append('excerpt', formData.excerpt || '');
      formDataToSend.append('content', formData.content || '');
      formDataToSend.append('readTime', String(formData.readTime || 5));
      formDataToSend.append('status', formData.status || 'draft');
      
      // Append categories and tags as JSON strings if they exist
      if (formData.categories && formData.categories.length > 0) {
        formDataToSend.append('categories', JSON.stringify(formData.categories));
      }
      
      if (formData.tags && formData.tags.length > 0) {
        formDataToSend.append('tags', JSON.stringify(formData.tags));
      }
      
      // Handle SEO data
      if (formData.seo) {
        formDataToSend.append('seo', JSON.stringify(formData.seo));
      }

      // Handle image upload
      if (selectedImage) {
        formDataToSend.append('featuredImage', selectedImage);
        if (formData.featuredImage?.altText) {
          formDataToSend.append('altText', formData.featuredImage.altText);
        }
      } else if (formData.featuredImage?.altText) {
        // If only updating alt text without changing the image
        formDataToSend.append('altText', formData.featuredImage.altText);
      }

      const method = selectedBlog ? 'PUT' : 'POST';
      const url = selectedBlog
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${selectedBlog._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`;

      const headers = getAuthHeaders();
      // Remove Content-Type header to let the browser set it with the correct boundary
      delete headers['Content-Type'];

      const response = await fetch(url, {
        method,
        headers,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to ${selectedBlog ? 'update' : 'create'} blog`
        );
      }

      const result = await response.json();
      
      toast({
        title: 'Success',
        description: `Blog ${selectedBlog ? 'updated' : 'created'} successfully`,
      });

      // Refresh the blogs list
      const blogsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`, {
        headers: getAuthHeaders(),
      });
      const blogsData = await blogsRes.json();
      setBlogs(blogsData.data || []);
      
      // Close the modal and reset form
      setShowCreateModal(false);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        authorName: "Admin User",
        featuredImage: { url: "", altText: "" },
        categories: [],
        tags: [],
        readTime: 5,
        status: "draft",
        seo: { metaTitle: "", metaDescription: "", keywords: [] },
      });
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedBlog(null);
    } catch (error) {
      console.error('Error saving blog:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save blog',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit blog
  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData(blog);
    setImagePreview(blog.featuredImage?.url || null);
    setSelectedImage(null);
    setShowCreateModal(true);
  };

  // ✅ Delete blog
  const handleDeleteBlog = async () => {
    if (!selectedBlog) return;
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${selectedBlog._id}`,
        { 
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      if (!res.ok) throw new Error("Failed to delete blog");

      setBlogs(blogs.filter((b) => b._id !== selectedBlog._id));
      setShowDeleteDialog(false);
      setSelectedBlog(null);

      toast({
        title: "Deleted",
        description: "Blog deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      });
    }
  };

  // Filter and sort blogs
  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Blog) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'archived':
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>

    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search blogs..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="whitespace-nowrap">
                {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                Published
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('archived')}>
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openCreateModal} className="whitespace-nowrap">
            + New Blog
          </Button>
        </div>
      </div>

      <Tabs defaultValue={view} onValueChange={(value) => setView(value as "grid" | "list")}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid className="h-4 w-4" /> Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" /> List
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'} found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading blogs...</p>
          </div>
        ) : (
          <>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBlogs.map((blog) => (
                  <Card key={blog._id} className="h-full flex flex-col">
                    <div className="relative pt-[56.25%] bg-muted/50 rounded-t-md overflow-hidden">
                      {blog.featuredImage?.data ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${blog._id}/image`}
                          alt={blog.featuredImage.altText || blog.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{blog.readTime || 5} min read</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blog.categories?.slice(0, 2).map((category, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {blog.categories?.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.categories.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {blog.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBlog(blog)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBlog(blog);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => requestSort("title")}
                      >
                        Title
                        {sortConfig.key === "title" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => requestSort("status")}
                      >
                        Status
                        {sortConfig.key === "status" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => requestSort("createdAt")}
                      >
                        Date
                        {sortConfig.key === "createdAt" && (
                          <span className="ml-1">
                            {sortConfig.direction === "ascending" ? "↑" : "↓"}
                          </span>
                        )}
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBlogs.map((blog) => (
                      <TableRow key={blog._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {blog.featuredImage?.url && (
                              <img
                                src={blog.featuredImage.url}
                                alt={blog.featuredImage.altText || ''}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{blog.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {blog.excerpt}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {blog.categories?.slice(0, 2).map((category, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {blog.categories?.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{blog.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(blog.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {blog.createdAt ? format(new Date(blog.createdAt), 'MMM d, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditBlog(blog)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedBlog(blog);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentBlogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No blogs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredBlogs.length)}
              </span>{' '}
              of <span className="font-medium">{filteredBlogs.length}</span> posts
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate page numbers with ellipsis
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'bg-primary text-primary-foreground' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Tabs>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlog ? "Edit Blog" : "Create New Blog"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBlog} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Blog title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Short description"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Blog content"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categories (comma separated)</label>
                  <Input
                    name="categories"
                    value={formData.categories?.join(", ")}
                    onChange={(e) => {
                      const categories = e.target.value
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, categories });
                    }}
                    placeholder="e.g., Technology, Business, Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <Input
                    name="tags"
                    value={formData.tags?.join(", ")}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                      setFormData({ ...formData, tags });
                    }}
                    placeholder="e.g., react, node, design"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Featured Image</label>
                  <div className="mt-1 flex items-center">
                    <label
                      htmlFor="featured-image"
                      className="cursor-pointer bg-gray-50 rounded-md border border-dashed border-gray-300 p-4 w-full text-center hover:bg-gray-100 transition-colors"
                    >
                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white">Change Image</span>
                          </div>
                        </div>
                      ) : formData.featuredImage?.url ? (
                        <div className="relative group">
                          <img
                            src={formData.featuredImage.url}
                            alt={formData.featuredImage.altText || 'Blog featured image'}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                              Upload an image
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, WEBP up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        id="featured-image"
                        name="featured-image"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {formData.featuredImage?.altText && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">
                        Image Alt Text
                      </label>
                      <Input
                        name="featuredImage.altText"
                        value={formData.featuredImage.altText}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featuredImage: {
                              ...formData.featuredImage!,
                              altText: e.target.value,
                            },
                          })
                        }
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Read Time (minutes)</label>
                  <Input
                    name="readTime"
                    type="number"
                    min="1"
                    value={formData.readTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-2">SEO Settings</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Meta Title</label>
                      <Input
                        name="seo.metaTitle"
                        value={formData.seo?.metaTitle || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: {
                              ...formData.seo,
                              metaTitle: e.target.value,
                            },
                          })
                        }
                        placeholder="SEO title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Meta Description</label>
                      <Textarea
                        name="seo.metaDescription"
                        value={formData.seo?.metaDescription || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: {
                              ...formData.seo,
                              metaDescription: e.target.value,
                            },
                          })
                        }
                        placeholder="SEO description"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Keywords (comma separated)</label>
                      <Input
                        name="seo.keywords"
                        value={formData.seo?.keywords?.join(", ") || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            seo: {
                              ...formData.seo,
                              keywords: e.target.value
                                .split(",")
                                .map((kw) => kw.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                        placeholder="seo, keywords, blog"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Blog"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this blog?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBlog}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
};

export default BlogsPage;
