import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentProvider } from "@/lib/content-context";
import { Suspense, lazy } from "react";

// Lazy load CookieBanner to avoid framer-motion in initial bundle
const CookieBanner = lazy(() => import("@/components/ui/cookie-banner").then(m => ({ default: m.CookieBanner })));

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Lazy load all secondary pages to reduce initial bundle size
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Contacts = lazy(() => import("@/pages/contacts"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceArticle = lazy(() => import("@/pages/resource-article"));
const FAQ = lazy(() => import("@/pages/faq"));
const AdminSettings = lazy(() => import("@/pages/admin"));
const AdminResources = lazy(() => import("@/pages/admin-resources"));
const AdminFaq = lazy(() => import("@/pages/admin-faq"));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
      <Route path="/privacy">
        <Suspense fallback={<LoadingSpinner />}>
          <Privacy />
        </Suspense>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<LoadingSpinner />}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/contacts">
        <Suspense fallback={<LoadingSpinner />}>
          <Contacts />
        </Suspense>
      </Route>
      <Route path="/resources">
        <Suspense fallback={<LoadingSpinner />}>
          <Resources />
        </Suspense>
      </Route>
      <Route path="/resources/:slug">
        <Suspense fallback={<LoadingSpinner />}>
          <ResourceArticle />
        </Suspense>
      </Route>
      <Route path="/faq">
        <Suspense fallback={<LoadingSpinner />}>
          <FAQ />
        </Suspense>
      </Route>
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
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </TooltipProvider>
      </ContentProvider>
    </QueryClientProvider>
  );
}

export default App;
