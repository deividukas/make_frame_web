import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Edit2, X } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import type { FaqItem, InsertFaqItem } from "@shared/schema";

function getAuthHeaders(): Record<string, string> {
  const password = localStorage.getItem("admin-password") || "";
  const encodedPassword = btoa(unescape(encodeURIComponent(password)));
  return {
    "Content-Type": "application/json",
    "X-Admin-Password-Encoded": encodedPassword,
  };
}

interface FaqFormData {
  category: string;
  question: string;
  answer: string;
  isPublished: boolean;
}

export default function AdminFaq() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState<FaqFormData>({
    category: "",
    question: "",
    answer: "",
    isPublished: true,
  });

  useEffect(() => {
    const password = localStorage.getItem("admin-password");
    if (!password) {
      const promptPass = prompt("Enter Admin Password to enable editing:");
      if (promptPass) {
        localStorage.setItem("admin-password", promptPass);
      }
    }
  }, []);

  const { data: faqItems = [], isLoading } = useQuery<FaqItem[]>({
    queryKey: ["admin-faq"],
    queryFn: async () => {
      const res = await fetch("/api/admin/faq", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("admin-password");
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch FAQ items");
      }
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FaqFormData) => {
      const res = await fetch("/api/admin/faq", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create FAQ item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faq"] });
      setShowNewForm(false);
      resetForm();
      toast({ title: "FAQ item created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<FaqFormData> }) => {
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update FAQ item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faq"] });
      setEditingId(null);
      resetForm();
      toast({ title: "FAQ item updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/faq/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete FAQ item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faq"] });
      toast({ title: "FAQ item deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ category: "", question: "", answer: "", isPublished: true });
  };

  const handleEdit = (item: FaqItem) => {
    setEditingId(item.id);
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      isPublished: item.isPublished,
    });
    setShowNewForm(false);
  };

  const handleSave = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowNewForm(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this FAQ item?")) {
      deleteMutation.mutate(id);
    }
  };

  const categories = Array.from(new Set(faqItems.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin-settings">
              <Button variant="ghost" size="icon" data-testid="back-button">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">FAQ Manager</h1>
              <p className="text-muted-foreground">Manage frequently asked questions.</p>
            </div>
          </div>
          <Button onClick={() => { setShowNewForm(true); setEditingId(null); resetForm(); }} data-testid="new-faq-button">
            <Plus className="mr-2 h-4 w-4" />
            New FAQ Item
          </Button>
        </div>

        {(showNewForm || editingId) && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>{editingId ? "Edit FAQ Item" : "New FAQ Item"}</CardTitle>
              <CardDescription>
                {editingId ? "Update the FAQ item details." : "Add a new FAQ item to the page."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., General & Product Overview"
                  list="categories"
                  data-testid="faq-category-input"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What is your question?"
                  data-testid="faq-question-input"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a detailed answer..."
                  rows={5}
                  data-testid="faq-answer-input"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  data-testid="faq-published-switch"
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending} data-testid="faq-save-button">
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button variant="outline" onClick={handleCancel} data-testid="faq-cancel-button">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading FAQ items...</div>
        ) : faqItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No FAQ items yet. Click "New FAQ Item" to add your first question.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-lg font-semibold mb-3 text-muted-foreground">{category}</h2>
                <div className="space-y-3">
                  {faqItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <Card key={item.id} className={!item.isPublished ? "opacity-60" : ""} data-testid={`faq-card-${item.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">{item.question}</h3>
                                {!item.isPublished && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Draft</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} data-testid={`edit-faq-${item.id}`}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} data-testid={`delete-faq-${item.id}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-8">
          <Link href="/faq">
            <Button variant="outline">View Public FAQ Page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
