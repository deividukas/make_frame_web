import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ContentProvider } from "@/lib/content-context";
import { CookieBanner } from "@/components/ui/cookie-banner";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import AdminSettings from "@/pages/admin";
import AdminResources from "@/pages/admin-resources";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Contacts from "@/pages/contacts";
import Resources from "@/pages/resources";
import ResourceArticle from "@/pages/resource-article";
import FAQ from "@/pages/faq";
import AdminFaq from "@/pages/admin-faq";

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
