import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentProvider } from "@/lib/content-context";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { GoogleTagManager } from "@/components/analytics/gtm";
import { Suspense, lazy } from "react";
import Home from "@/pages/home";

const AdminSettings = lazy(() => import("@/pages/admin"));
const AdminResources = lazy(() => import("@/pages/admin-resources"));
const AdminFaq = lazy(() => import("@/pages/admin-faq"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Contacts = lazy(() => import("@/pages/contacts"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceArticle = lazy(() => import("@/pages/resource-article"));
const FAQ = lazy(() => import("@/pages/faq"));
const AdminLandingPages = lazy(() => import("@/pages/admin-landing-pages"));
const LandingPageView = lazy(() => import("@/pages/landing-page"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin-settings" component={AdminSettings} />
      <Route path="/admin-settings/resources" component={AdminResources} />
      <Route path="/admin-settings/faq" component={AdminFaq} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:slug" component={ResourceArticle} />
      <Route path="/faq" component={FAQ} />
      <Route path="/admin-settings/landing-pages" component={AdminLandingPages} />
      <Route path="/lp/:slug" component={LandingPageView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentProvider>
        <TooltipProvider>
          <GoogleTagManager />
          <Toaster />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
          <CookieBanner />
        </TooltipProvider>
      </ContentProvider>
    </QueryClientProvider>
  );
}

export default App;
