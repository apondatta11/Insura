import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Swal from "sweetalert2";
import useAuth from "@/Hooks/useAuth";

const BlogModal = ({
  isOpen,
  onClose,
  mode,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  user, // Add user as a prop
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl bg-card border border-border shadow-2xl p-0 overflow-hidden max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-sidebar border-b border-border p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-serif font-bold text-foreground">
                {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
              </h3>
              <p className="text-muted-foreground font-sans mt-1">
                {mode === "create"
                  ? "Share insurance tips and insights"
                  : "Update your blog content"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label className="label font-sans text-sm font-medium text-foreground">
                Blog Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="Enter an engaging title for your blog post..."
                className="input input-bordered w-full font-sans bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="label font-sans text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="select select-bordered w-full font-sans bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary"
                required
              >
                <option value="insurance-tips">Insurance Tips</option>
                <option value="financial-planning">Financial Planning</option>
                <option value="life-insurance">Life Insurance</option>
                <option value="health-insurance">Health Insurance</option>
                <option value="investment">Investment</option>
                <option value="retirement">Retirement Planning</option>
              </select>
            </div>

            {/* Author (Read-only) */}
            <div>
              <label className="label font-sans text-sm font-medium text-foreground">
                Author
              </label>
              <input
                type="text"
                value={user?.email} // Show email instead of formData.author
                readOnly
                className="input input-bordered w-full font-sans bg-muted border-border text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2 font-sans">
                This will be displayed as the author of the blog post
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="label font-sans text-sm font-medium text-foreground">
                Blog Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={onInputChange}
                placeholder="Write your blog content here... Share valuable insurance insights, tips, and information that will help your readers."
                rows={12}
                className="textarea textarea-bordered w-full font-sans bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary resize-vertical"
                required
              />
              <p className="text-xs text-muted-foreground mt-2 font-sans">
                Write in a clear, engaging manner. Use paragraphs and bullet
                points for better readability.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost font-sans text-foreground border-border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary font-sans text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {mode === "create" ? "Publishing..." : "Updating..."}
                </>
              ) : mode === "create" ? (
                "Publish Blog"
              ) : (
                "Update Blog"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageBlogs = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "", // This will be set when creating
    category: "insurance-tips",
  });

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user, role } = useAuth(); // Assuming you have role in your auth context

  // Fetch blogs based on user role
  //   const { data: blogs = [], isLoading, error } = useQuery({
  //     queryKey: ['blogs', user?.email],
  //     queryFn: async () => {
  //       const endpoint = role === 'admin' ? '/blogs' : `/blogs?author=${user?.email}`;
  //       const response = await axiosSecure.get(endpoint);
  //       return response.data;
  //     },
  //     enabled: !!user?.email
  //   });

  //   // Create blog mutation
  //   const createMutation = useMutation({
  //     mutationFn: async (blogData) => {
  //       const response = await axiosSecure.post('/blogs', blogData);
  //       return response.data;
  //     },
  //     onSuccess: () => {
  //       toast.success('Blog published successfully!');
  //       setIsCreateModalOpen(false);
  //       setFormData({ title: '', content: '', author: user?.displayName || user?.email, category: 'insurance-tips' });
  //       queryClient.invalidateQueries(['blogs']);
  //     },
  //     onError: (error) => {
  //       toast.error('Failed to publish blog: ' + error.message);
  //     }
  //   });

  // In your ManageBlogs component, add these console logs:
  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", user?.email],
    queryFn: async () => {
      const endpoint =
        role === "admin" ? "/blogs" : `/blogs?author=${user?.email}`;
      console.log("📝 Fetching blogs from:", endpoint);
      const response = await axiosSecure.get(endpoint);
      console.log("✅ Blogs fetched:", response.data);
      return response.data;
    },
    enabled: !!user?.email,
  });

const createMutation = useMutation({
  mutationFn: async (blogData) => {
    console.log("📝 Creating blog:", blogData);
    const response = await axiosSecure.post("/blogs", blogData);
    console.log("✅ Blog created response:", response.data);
    return response.data;
  },
  onSuccess: (data) => {
    console.log("🎉 Blog creation successful:", data);
    toast.success("Blog published successfully!");
    setIsCreateModalOpen(false);
    setFormData({
      title: "",
      content: "",
      author: user?.email, // Use email consistently here too
      category: "insurance-tips",
    });
    queryClient.invalidateQueries(["blogs"]);
  },
  onError: (error) => {
    console.error("❌ Blog creation failed:", error);
    toast.error("Failed to publish blog: " + error.message);
  },
});

  // Update blog mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, blogData }) => {
      const response = await axiosSecure.patch(`/blogs/${id}`, blogData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Blog updated successfully!");
      setIsEditModalOpen(false);
      setSelectedBlog(null);
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      toast.error("Failed to update blog: " + error.message);
    },
  });

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      const response = await axiosSecure.delete(`/blogs/${blogId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Blog deleted successfully!");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      toast.error("Failed to delete blog: " + error.message);
    },
  });

  const handleCreate = () => {
    // Set author to email for consistency
    setFormData({
      title: "",
      content: "",
      author: user?.email, // Use email here too
      category: "insurance-tips",
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      category: blog.category || "insurance-tips",
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (blog) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${blog.title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "oklch(0.9914 0.0098 87.4695)",
      color: "oklch(0.3760 0.0225 64.3434)",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(blog._id);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use email consistently for author
    const blogAuthor = user?.email; // Always use email

    const blogData = {
      ...formData,
      publishDate: new Date().toISOString(),
      author: blogAuthor, // This will now be the email
      totalVisits: 0,
      status: "published",
    };

    console.log("💾 Blog data to send:", blogData);

    if (isCreateModalOpen) {
      createMutation.mutate(blogData);
    } else if (isEditModalOpen) {
      updateMutation.mutate({ id: selectedBlog._id, blogData });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="text-muted-foreground font-serif">
            Loading your blogs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error bg-destructive text-destructive-foreground">
        <span>Error loading blogs: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <Helmet>
        <title>Manage Blogs - Insurance Platform</title>
      </Helmet>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground tracking-tight">
              Manage Blogs
            </h1>
            <p className="text-muted-foreground font-sans mt-3 text-lg">
              {role === "admin"
                ? "Manage all blog posts across the platform"
                : "Create and manage your insurance-related blog posts"}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn btn-primary font-sans text-primary-foreground px-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Blog Post
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Total Blogs
              </p>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">
                {blogs.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Total Views
              </p>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">
                {blogs.reduce(
                  (total, blog) => total + (blog.totalVisits || 0),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-success"
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
            </div>
          </div>
        </div>

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-sans text-muted-foreground font-medium">
                Categories
              </p>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">
                {new Set(blogs.map((blog) => blog.category)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* Blogs Table */}
      <div className="card bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                Your Blog Posts
              </h2>
              <p className="text-muted-foreground font-sans mt-1">
                {blogs.length} blog posts{" "}
                {role === "admin" ? "across the platform" : "by you"}
              </p>
            </div>
            {role === "admin" && (
              <div className="badge badge-lg badge-primary font-sans">
                Admin View
              </div>
            )}
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
              No Blog Posts Yet
            </h3>
            <p className="text-muted-foreground font-sans mb-6">
              Start sharing your insurance knowledge and insights with the
              community
            </p>
            <button
              onClick={handleCreate}
              className="btn btn-primary font-sans"
            >
              Create Your First Blog Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-sidebar border-b border-border">
                  <th className="font-serif font-semibold text-foreground p-4">
                    Blog Title
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4">
                    Category
                  </th>
                  {role === "admin" && (
                    <th className="font-serif font-semibold text-foreground p-4">
                      Author
                    </th>
                  )}
                  <th className="font-serif font-semibold text-foreground p-4">
                    Published
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4">
                    Views
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="border-b border-border hover:bg-sidebar/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-serif font-semibold text-foreground">
                        {blog.title}
                      </div>
                      <div className="font-sans text-sm text-muted-foreground mt-1 line-clamp-2">
                        {blog.content.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="badge badge-outline badge-sm font-sans capitalize">
                        {blog.category?.replace("-", " ") || "insurance-tips"}
                      </div>
                    </td>
                    {role === "admin" && (
                      <td className="p-4">
                        <div className="font-sans text-foreground">
                          {blog.author}
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <div className="font-sans text-sm text-foreground">
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </div>
                      <div className="font-sans text-xs text-muted-foreground">
                        {new Date(blog.publishDate).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-sans">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
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
                        <span className="text-foreground">
                          {blog.totalVisits || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="btn btn-outline btn-sm font-sans text-foreground border-border hover:bg-sidebar"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(blog)}
                          disabled={deleteMutation.isLoading}
                          className="btn btn-outline btn-sm font-sans text-error border-error hover:bg-error hover:text-error-foreground"
                        >
                          {deleteMutation.isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <BlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        formData={formData}
        onInputChange={handleInputChange} // Now this function exists
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading}
        user={user} // Add this line
      />
      {/* Edit Modal */}
      <BlogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        formData={formData}
        onInputChange={handleInputChange} // Now this function exists
        onSubmit={handleSubmit}
        isLoading={updateMutation.isLoading}
        user={user} // Add this line
      />
    </div>
  );
};

export default ManageBlogs;
