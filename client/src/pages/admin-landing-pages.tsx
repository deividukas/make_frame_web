import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LandingPage } from "@shared/schema";

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

export default function AdminLandingPages() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<LandingPage | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    htmlContent: "",
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

  const { data: pages = [], isLoading } = useQuery<LandingPage[]>({
    queryKey: ["admin-landing-pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/landing-pages", {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to fetch landing pages");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/landing-pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create landing page");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
      toast({ title: "Landing page created!" });
      resetForm();
      setIsEditorOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await fetch(`/api/admin/landing-pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update landing page");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
      toast({ title: "Landing page updated!" });
      resetForm();
      setIsEditorOpen(false);
      setEditingPage(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/landing-pages/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error("Failed to delete landing page");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
      toast({ title: "Landing page deleted!" });
    },
    onError: () => {
      toast({ title: "Error deleting landing page", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      htmlContent: "",
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

  const openEditor = (page?: LandingPage) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        title: page.title,
        slug: page.slug,
        htmlContent: page.htmlContent,
        metaTitle: page.metaTitle || "",
        metaDescription: page.metaDescription || "",
        isPublished: page.isPublished,
      });
    } else {
      setEditingPage(null);
      resetForm();
    }
    setIsEditorOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
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
                  data-testid="input-admin-password"
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-admin-login">
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
              <Button variant="ghost" size="icon" data-testid="button-back-admin">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Landing Pages</h1>
          </div>
          <Button onClick={() => openEditor()} className="gap-2" data-testid="button-new-landing-page">
            <Plus className="h-4 w-4" />
            New Landing Page
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading...
          </div>
        ) : pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No landing pages created yet</p>
              <Button onClick={() => openEditor()} className="gap-2" data-testid="button-create-first-landing-page">
                <Plus className="h-4 w-4" />
                Create first landing page
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pages.map((page) => (
              <Card key={page.id} data-testid={`card-landing-page-${page.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold" data-testid={`text-title-${page.id}`}>{page.title}</h3>
                        {page.isPublished ? (
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
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-slug-${page.id}`}>
                        /lp/{page.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {page.isPublished && (
                        <Link href={`/lp/${page.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" data-testid={`button-view-${page.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditor(page)}
                        data-testid={`button-edit-${page.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this landing page?")) {
                            deleteMutation.mutate(page.id);
                          }
                        }}
                        data-testid={`button-delete-${page.id}`}
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
                {editingPage ? "Edit Landing Page" : "New Landing Page"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="content">
                <TabsList className="w-full">
                  <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                  <TabsTrigger value="seo" className="flex-1">SEO</TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Landing page title"
                      required
                      data-testid="input-title"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>URL Slug *</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="landing-page-slug"
                      required
                      data-testid="input-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /lp/{formData.slug || "..."}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>HTML Content *</Label>
                    <Textarea
                      value={formData.htmlContent}
                      onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                      placeholder="<!DOCTYPE html>
<html>
<head><title>My Page</title></head>
<body>
  <h1>Hello World</h1>
</body>
</html>"
                      rows={16}
                      className="font-mono text-sm"
                      data-testid="textarea-html-content"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.isPublished}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isPublished: checked })
                      }
                      data-testid="switch-published"
                    />
                    <Label>Publish page</Label>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Meta Title</Label>
                    <Input
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                      placeholder="Custom SEO title (max. 60 characters)"
                      maxLength={60}
                      data-testid="input-meta-title"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label>Meta Description</Label>
                    <Textarea
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="Custom SEO description (max. 160 characters)"
                      maxLength={160}
                      rows={3}
                      data-testid="input-meta-description"
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
                          {formData.metaTitle || formData.title || "Page title"}
                        </p>
                        <p className="text-green-700 text-sm">
                          make-frame.com/lp/{formData.slug || "..."}
                        </p>
                        <p className="text-sm text-slate-600">
                          {formData.metaDescription || "Page description..."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-2 bg-slate-100 border-b text-sm text-muted-foreground">
                      HTML Preview
                    </div>
                    {formData.htmlContent ? (
                      <iframe
                        srcDoc={formData.htmlContent}
                        title="HTML Preview"
                        className="w-full border-0"
                        style={{ minHeight: "400px" }}
                        sandbox="allow-scripts"
                        data-testid="iframe-html-preview"
                      />
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Enter HTML content to see a preview
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditorOpen(false);
                    setEditingPage(null);
                    resetForm();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingPage
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
