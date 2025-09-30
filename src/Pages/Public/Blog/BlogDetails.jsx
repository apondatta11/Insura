import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blog-details", id],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/blogs/${id}?incrementVisit=true`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
            Article Not Found
          </h3>
          <p className="text-muted-foreground font-sans mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog" className="btn btn-primary font-sans">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const formatCategory = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{blog.title} - Insurance Articles</title>
      </Helmet>

      {/* Navigation */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm font-sans">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Articles
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground truncate max-w-xs">
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => navigate("/blog")}
          className="btn btn-ghost btn-sm font-sans text-muted-foreground mb-6 hover:text-foreground"
        >
          ← Back to Articles
        </button>

        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span className="badge badge-primary badge-lg font-sans">
              <span className="mx-3">{formatCategory(blog.category)}</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-sans mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {blog.author?.charAt(0)?.toUpperCase() || "A"}
                </span>
              </div>
              <span>{blog.author || "Anonymous"}</span>
            </div>

            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Published{" "}
              {new Date(blog.publishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {blog.totalVisits || 0} views
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl overflow-hidden mb-8">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        {/* Article Content */}
        <article className="max-w-none">
          <div className="bg-sidebar border border-border rounded-xl p-6 lg:p-8">
            <div
              className="font-sans text-foreground leading-relaxed whitespace-pre-line 
                    text-base lg:text-lg
                    prose prose-headings:font-serif prose-headings:text-foreground
                    prose-p:text-muted-foreground prose-p:leading-7
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:leading-7 prose-li:my-2
                    prose-blockquote:border-l-4 prose-blockquote:border-primary 
                    prose-blockquote:pl-4 prose-blockquote:italic
                    prose-blockquote:bg-primary/5 prose-blockquote:py-2
                    prose-blockquote:rounded-r-lg
                    max-w-none"
            >
              {/* Add some content formatting if needed */}
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Back to Articles Button */}
        <div className="mt-12 text-center">
          <Link to="/blog" className="btn btn-primary font-sans px-8">
            Explore More Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
