import { useContent } from "@/lib/content-context";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function AdminSettings() {
  const { content, updateContent, resetContent } = useContent();
  const { toast } = useToast();
  
  useEffect(() => {
    const password = localStorage.getItem("admin-password");
    if (!password) {
      const promptPass = prompt("Enter Admin Password to enable editing:");
      if (promptPass) {
        localStorage.setItem("admin-password", promptPass);
      }
    }
  }, []);

  const form = useForm({
    defaultValues: content,
    mode: "onChange"
  });

  const { fields: navLinkFields } = useFieldArray({
    control: form.control,
    name: "navigation.links"
  });

  const { fields: footerLinkFields } = useFieldArray({
    control: form.control,
    name: "footer.links"
  });

  const { fields: freeFeaturesFields } = useFieldArray({
    control: form.control,
    name: "pricing.free.features" as any
  });

  const { fields: premiumFeaturesFields } = useFieldArray({
    control: form.control,
    name: "pricing.premium.features" as any
  });

  const { fields: addOnsFields } = useFieldArray({
    control: form.control,
    name: "pricing.addOns"
  });

  // Reset form when content changes (e.g. on reset)
  useEffect(() => {
    form.reset(content);
  }, [content, form]);

  const onSubmit = async (data: typeof content) => {
    try {
      await updateContent(data);
      toast({
        title: "Settings Saved",
        description: "Your changes have been applied to the live site.",
      });
    } catch (error: any) {
      console.error("Save error:", error);
      
      if (error.message?.includes("Unauthorized")) {
        localStorage.removeItem("admin-password");
        const promptPass = prompt("Password expired or incorrect. Please enter Admin Password:");
        if (promptPass) {
          localStorage.setItem("admin-password", promptPass);
          // Retry save once
          try {
            await updateContent(data);
            toast({
              title: "Settings Saved",
              description: "Your changes have been applied after re-authentication.",
            });
            return;
          } catch (retryError) {
            console.error("Retry error:", retryError);
          }
        }
      }

      toast({
        title: "Save Failed",
        description: error.message || "An unexpected error occurred while saving.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content to default?")) {
      resetContent();
      toast({
        title: "Content Reset",
        description: "All content has been restored to defaults.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
              <p className="text-muted-foreground">Edit your landing page content in real-time.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Defaults
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-white p-1 shadow-sm border mb-8 overflow-x-auto">
              <TabsTrigger value="general" className="h-10">General & Nav</TabsTrigger>
              <TabsTrigger value="hero" className="h-10">Hero Section</TabsTrigger>
              <TabsTrigger value="pricing" className="h-10">Pricing & Add-ons</TabsTrigger>
              <TabsTrigger value="footer" className="h-10">Footer</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                  <CardDescription>Manage your site title and menu links.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Site Title</Label>
                    <Input {...form.register("navigation.title")} />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Menu Links</Label>
                    <div className="space-y-4">
                      {navLinkFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-slate-50">
                          <h4 className="font-medium mb-3">Link {index + 1}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Label</Label>
                              <Input placeholder="Label" {...form.register(`navigation.links.${index}.label`)} />
                            </div>
                            <div className="grid gap-2">
                              <Label>URL</Label>
                              <Input placeholder="URL (#section)" {...form.register(`navigation.links.${index}.href`)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <Label className="text-base font-semibold">Header Buttons</Label>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg bg-slate-50">
                        <h4 className="font-medium mb-3">Sign In Button</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Text</Label>
                            <Input {...form.register("navigation.signIn.text")} placeholder="Sign in" />
                          </div>
                          <div className="grid gap-2">
                            <Label>URL</Label>
                            <Input {...form.register("navigation.signIn.href")} placeholder="https://app.make-frame.com/login" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg bg-indigo-50/50 border-indigo-100">
                        <h4 className="font-medium mb-3 text-primary">Get Started Button</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label>Text</Label>
                            <Input {...form.register("navigation.getStarted.text")} placeholder="Get Started Free" />
                          </div>
                          <div className="grid gap-2">
                            <Label>URL</Label>
                            <Input {...form.register("navigation.getStarted.href")} placeholder="https://staging.make-frame.com/signup" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hero">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>The first thing visitors see.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label>Headline</Label>
                    <Input {...form.register("hero.headline")} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Subheadline</Label>
                    <Textarea {...form.register("hero.subhead")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>CTA Text</Label>
                      <Input {...form.register("hero.cta.text")} />
                    </div>
                    <div className="grid gap-2">
                      <Label>CTA Link</Label>
                      <Input {...form.register("hero.cta.href")} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plans</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="p-4 border rounded-lg bg-slate-50">
                      <h3 className="font-semibold mb-4">Free Plan</h3>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                           <Label>Price Display</Label>
                           <Input {...form.register("pricing.free.price")} />
                        </div>
                        <div className="grid gap-2">
                           <Label>Features</Label>
                           {freeFeaturesFields.map((field, i) => (
                             <Input key={field.id} {...form.register(`pricing.free.features.${i}`)} />
                           ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-indigo-50/50 border-indigo-100">
                      <h3 className="font-semibold mb-4 text-primary">Premium Plan</h3>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                           <Label>Price Display</Label>
                           <Input {...form.register("pricing.premium.price")} />
                        </div>
                        <div className="grid gap-2">
                           <Label>Features</Label>
                           {premiumFeaturesFields.map((field, i) => (
                             <Input key={field.id} {...form.register(`pricing.premium.features.${i}`)} />
                           ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Extra Frame Packages</CardTitle>
                    <CardDescription>Manage prices and details for extra frame packages.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {addOnsFields.map((field, i) => (
                      <div key={field.id} className="p-4 border rounded-lg bg-white grid md:grid-cols-4 gap-4 items-end">
                         <div className="grid gap-2">
                           <Label>Size Name</Label>
                           <Input {...form.register(`pricing.addOns.${i}.size`)} />
                         </div>
                         <div className="grid gap-2">
                           <Label>Frame Count</Label>
                           <Input {...form.register(`pricing.addOns.${i}.count`)} />
                         </div>
                         <div className="grid gap-2">
                           <Label>Price</Label>
                           <Input {...form.register(`pricing.addOns.${i}.price`)} />
                         </div>
                         <div className="grid gap-2">
                           <Label>Per Frame Cost</Label>
                           <Input {...form.register(`pricing.addOns.${i}.perFrame`)} />
                         </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="footer">
               <Card>
                <CardHeader>
                  <CardTitle>Footer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Copyright Text</Label>
                    <Input {...form.register("footer.copyright")} />
                  </div>
                  <div className="space-y-4">
                    <Label>Footer Links</Label>
                    <div className="grid gap-4">
                      {footerLinkFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg bg-slate-50">
                          <h4 className="font-medium mb-3">Link {index + 1}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label>Label</Label>
                              <Input placeholder="Label" {...form.register(`footer.links.${index}.label`)} />
                            </div>
                            <div className="grid gap-2">
                              <Label>URL</Label>
                              <Input placeholder="URL" {...form.register(`footer.links.${index}.href`)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
