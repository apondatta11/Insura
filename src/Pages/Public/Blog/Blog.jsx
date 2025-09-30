// src/Pages/Public/Blog/Blog.jsx
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/Hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Link } from 'react-router';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const axiosSecure = useAxiosSecure();

  // Fetch all published blogs
  const { data: blogs = [], isLoading, error } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => {
      const response = await axiosSecure.get('/blogs');
      return response.data;
    },
  });

  // Filter blogs by category
  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="alert alert-error bg-destructive text-destructive-foreground max-w-md">
          <span>Error loading articles: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Insurance Articles & Blog - Expert Insights</title>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-4">
            Insurance Insights
          </h1>
          <p className="text-xl text-muted-foreground font-sans max-w-2xl mx-auto">
            Expert advice, tips, and latest updates on insurance policies, financial planning, and securing your future.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-sidebar text-foreground border border-border hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {category === 'all' ? 'All Articles' : category.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              No Articles Found
            </h3>
            <p className="text-muted-foreground font-sans">
              {selectedCategory === 'all' 
                ? 'No articles have been published yet.' 
                : `No articles found in the ${selectedCategory} category.`
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredBlogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Stats */}
            <div className="text-center">
              <p className="text-muted-foreground font-sans">
                Showing {filteredBlogs.length} of {blogs.length} articles
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
// Blog Card Component - Updated version
const BlogCard = ({ blog }) => {
  const axiosSecure = useAxiosSecure();

  const truncateContent = (content, wordLimit = 25) => {
    const words = content.split(' ');
    if (words.length <= wordLimit) return content;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatCategory = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <article className="card bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Blog Image */}
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
        {blog.image ? (
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-4xl text-primary/40">
            📄
          </div>
        )}
      </div>

      {/* Card Content - This section will grow and push button to bottom */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="badge badge-outline badge-sm font-sans text-xs">
            {formatCategory(blog.category)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-foreground text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem] flex items-start">
          {blog.title}
        </h3>

        {/* Content Preview */}
        <div className="flex-grow mb-4">
          <p className="text-muted-foreground font-sans text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
            {truncateContent(blog.content, 25)}
          </p>
        </div>

        {/* Author and Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-sans font-medium text-primary">
                {blog.author?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className="text-xs font-sans font-medium text-foreground">
                {blog.author || 'Anonymous'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date(blog.publishDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {blog.totalVisits || 0}
            </span>
          </div>
        </div>

        {/* Read More Button - This stays at bottom */}
        <Link 
          to={`/blog/${blog._id}`}
          className="btn btn-outline btn-sm w-full font-sans border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 mt-auto"
        >
          Read Full Article
        </Link>
      </div>
    </article>
  );
};

export default Blog;