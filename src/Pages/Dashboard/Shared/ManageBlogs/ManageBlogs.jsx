import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Swal from "sweetalert2";
import useAuth from "@/Hooks/useAuth";
import useUserRole from "@/Hooks/useUserRole";

const BlogModal = ({
  isOpen,
  onClose,
  mode,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  user,
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
              className="btn btn-ghost btn-sm btn-circle text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
                value={user?.email}
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
              className="btn btn-ghost font-sans text-foreground border-border hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary font-sans text-primary-foreground bg-primary hover:bg-primary/90"
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
    author: "",
    category: "insurance-tips",
  });

  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();

  const {
    data: blogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", user?.email, role],
    queryFn: async () => {
      console.log("📝 Fetching blogs for role:", role, "user:", user?.email);
      
      let endpoint = "/blogs";
      if (role === "agent") {
        endpoint = `/blogs?author=${user?.email}`;
      }
      
      console.log("📝 Fetching blogs from:", endpoint);
      const response = await axiosSecure.get(endpoint);
      console.log(" Blogs fetched:", response.data.length);
      return response.data;
    },
    enabled: !!user?.email && !roleLoading,
  });

  const createMutation = useMutation({
    mutationFn: async (blogData) => {
      console.log("📝 Creating blog:", blogData);
      const response = await axiosSecure.post("/blogs", blogData);
      console.log("Blog created response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("🎉 Blog creation successful:", data);
      toast.success("Blog published successfully!");
      setIsCreateModalOpen(false);
      setFormData({
        title: "",
        content: "",
        author: user?.email,
        category: "insurance-tips",
      });
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (error) => {
      console.error(" Blog creation failed:", error);
      toast.error("Failed to publish blog: " + error.message);
    },
  });

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
    setFormData({
      title: "",
      content: "",
      author: user?.email,
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

    const blogAuthor = user?.email;

    const blogData = {
      ...formData,
      publishDate: new Date().toISOString(),
      author: blogAuthor,
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

  if (roleLoading || isLoading) {
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
            className="btn btn-primary font-sans text-primary-foreground px-6 bg-primary hover:bg-primary/90 border-primary hover:border-primary/90"
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
        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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

        <div className="card bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
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
        <div className="p-6 border-b border-border bg-sidebar/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-foreground">
                {role === "admin" ? "All Blog Posts" : "Your Blog Posts"}
              </h2>
              <p className="text-muted-foreground font-sans mt-1">
                {blogs.length} blog posts{" "}
                {role === "admin" ? "across the platform" : "by you"}
              </p>
            </div>
            {role === "admin" && (
              <div className="badge badge-lg badge-primary font-sans px-4 py-3 bg-primary/20 text-primary border-primary/30">
                Admin View - All Blogs
              </div>
            )}
            {role === "agent" && (
              <div className="badge badge-lg badge-warning font-sans px-4 py-3 bg-warning/20 text-warning border-warning/30">
                Agent View - Your Blogs
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
              {role === "admin" 
                ? "No blogs have been published yet" 
                : "Start sharing your insurance knowledge and insights with the community"
              }
            </p>
            {(role === "agent" || role === "admin") && (
              <button
                onClick={handleCreate}
                className="btn btn-primary font-sans bg-primary hover:bg-primary/90 border-primary hover:border-primary/90"
              >
                Create Your First Blog Post
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Remove zebra striping and use cleaner design */}
              <thead>
                <tr className="bg-sidebar/50 border-b border-border">
                  <th className="font-serif font-semibold text-foreground p-4 text-left">
                    Blog Title
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4 text-left">
                    Category
                  </th>
                  {role === "admin" && (
                    <th className="font-serif font-semibold text-foreground p-4 text-left">
                      Author
                    </th>
                  )}
                  <th className="font-serif font-semibold text-foreground p-4 text-left">
                    Published
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4 text-left">
                    Views
                  </th>
                  <th className="font-serif font-semibold text-foreground p-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog, index) => (
                  <tr
                    key={blog._id}
                    className={`border-b border-border transition-colors ${
                      index % 2 === 0 
                        ? 'bg-card hover:bg-sidebar/30' 
                        : 'bg-sidebar/10 hover:bg-sidebar/40'
                    }`}
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
                      <div className="badge badge-outline badge-sm font-sans capitalize px-3 py-2 bg-background border-border text-foreground">
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
                        <span className="text-foreground font-medium">
                          {blog.totalVisits || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="btn btn-outline btn-sm font-sans text-foreground border-border hover:bg-accent hover:border-accent px-3"
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
                          className="btn btn-outline btn-sm font-sans text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground px-3"
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
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={createMutation.isLoading}
        user={user}
      />

      <BlogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isLoading}
        user={user}
      />
    </div>
  );
};

export default ManageBlogs;
