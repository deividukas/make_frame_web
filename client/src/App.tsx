import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentProvider } from "@/lib/content-context";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contacts from "@/pages/contacts";
import Resources from "@/pages/resources";
import ResourceArticle from "@/pages/resource-article";
import FAQ from "@/pages/faq";

const AdminSettings = lazy(() => import("@/pages/admin"));
const AdminResources = lazy(() => import("@/pages/admin-resources"));
const AdminFaq = lazy(() => import("@/pages/admin-faq"));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin-settings">
        <Suspense fallback={<LoadingSpinner />}>
          <AdminSettings />
        </Suspense>
      </Route>
      <Route path="/admin-settings/resources">
        <Suspense fallback={<LoadingSpinner />}>
          <AdminResources />
        </Suspense>
      </Route>
      <Route path="/admin-settings/faq">
        <Suspense fallback={<LoadingSpinner />}>
          <AdminFaq />
        </Suspense>
      </Route>
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:slug" component={ResourceArticle} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </ContentProvider>
    </QueryClientProvider>
  );
}

export default App;
