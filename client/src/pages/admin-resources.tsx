import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUpload } from "@/hooks/use-upload";
import type { Resource } from "@shared/schema";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (char) => {
      const map: Record<string, string> = {
        'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i',
        'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminResources() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadFile, isUploading } = useUpload();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    keyTakeaways: "",
    featuredImage: "",
    featuredImageAlt: "",
    metaTitle: "",
    metaDescription: "",
    isPublished: false,
  });

  useEffect(() => {
    const storedPassword = localStorage.getItem("admin-password");
    if (storedPassword) {
      setPassword(storedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  const getAuthHeader = () => {
    const encoded = btoa(unescape(encodeURIComponent(password)));
    return { "x-admin-password-encoded": encoded };
  };

  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["admin-resources"],
    queryFn: async () => {
      const res = await fetch("/api/admin/resources", {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch resources");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create resource");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast({ title: "Article created!" });
      resetForm();
      setIsEditorOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update resource");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast({ title: "Article updated!" });
      resetForm();
      setIsEditorOpen(false);
      setEditingResource(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to delete resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      toast({ title: "Article deleted!" });
    },
    onError: () => {
      toast({ title: "Error deleting article", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      keyTakeaways: "",
      featuredImage: "",
      featuredImageAlt: "",
      metaTitle: "",
      metaDescription: "",
      isPublished: false,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin-password", password);
    setIsAuthenticated(true);
  };

  const openEditor = (resource?: Resource) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        slug: resource.slug,
        content: resource.content,
        excerpt: resource.excerpt || "",
        keyTakeaways: resource.keyTakeaways || "",
        featuredImage: resource.featuredImage || "",
        featuredImageAlt: resource.featuredImageAlt || "",
        metaTitle: resource.metaTitle || "",
        metaDescription: resource.metaDescription || "",
        isPublished: resource.isPublished,
      });
    } else {
      setEditingResource(null);
      resetForm();
    }
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingResource) {
      updateMutation.mutate({ id: editingResource.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container max-w-6xl py-8 px-4 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin-settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Articles (Resources)</h1>
          </div>
          <Button onClick={() => openEditor()} className="gap-2">
            <Plus className="h-4 w-4" />
            New article
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : resources.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No articles created yet</p>
              <Button onClick={() => openEditor()} className="gap-2">
                <Plus className="h-4 w-4" />
                Create first article
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{resource.title}</h3>
                        {resource.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            <Eye className="h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        /resources/{resource.slug}
                      </p>
                      {resource.excerpt && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {resource.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.isPublished && (
                        <Link href={`/resources/${resource.slug}`} target="_blank">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditor(resource)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this article?")) {
                            deleteMutation.mutate(resource.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingResource ? "Edit article" : "New article"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="content">
                <TabsList className="w-full">
                  <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                  <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Article title"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>URL Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="article-title"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /resources/{formData.slug || "..."}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Short description shown in article list..."
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Key Takeaways (AI Optimization)</Label>
                    <Textarea
                      value={formData.keyTakeaways}
                      onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}
                      placeholder="Summarize key points for AI/search engines. Use bullet points: • Point 1 • Point 2"
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Displayed at top of article. Helps AI engines understand and cite content.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Featured Image</Label>
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          value={formData.featuredImage}
                          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                          placeholder="https://example.com/image.jpg or upload below"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      {formData.featuredImage && (
                        <div className="relative w-24 h-16 rounded border overflow-hidden bg-slate-100">
                          <img 
                            src={formData.featuredImage} 
                            alt="Featured preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          className="max-w-xs"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const response = await uploadFile(file);
                                if (response) {
                                  setFormData({ ...formData, featuredImage: response.objectPath });
                                  toast({
                                    title: "Image Uploaded",
                                    description: "Featured image has been uploaded successfully.",
                                  });
                                }
                              } catch (err) {
                                toast({
                                  title: "Upload Failed",
                                  description: "Failed to upload image.",
                                  variant: "destructive",
                                });
                              }
                            }
                          }}
                          disabled={isUploading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Upload an image or paste a URL above</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label className="text-sm">Alt Text (Image Description)</Label>
                      <Input
                        value={formData.featuredImageAlt}
                        onChange={(e) => setFormData({ ...formData, featuredImageAlt: e.target.value })}
                        placeholder="Describe the image for accessibility and SEO"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Content *</Label>
                    <RichTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({ ...formData, content })}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: checked })
                      }
                    />
                    <Label>Publish article</Label>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>SEO Title (Meta Title)</Label>
                    <Input
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="Custom SEO title (max. 60 characters)"
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>SEO Description (Meta Description)</Label>
                    <Textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Custom SEO description (max. 160 characters)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>

                  <Card className="bg-slate-50">
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium mb-2">Google Preview:</p>
                      <div className="space-y-1">
                        <p className="text-blue-600 text-lg">
                          {formData.metaTitle || formData.title || "Article title"}
                        </p>
                        <p className="text-green-700 text-sm">
                          make-frame.com/resources/{formData.slug || "..."}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formData.metaDescription || formData.excerpt || "Article description..."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingResource(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingResource
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
