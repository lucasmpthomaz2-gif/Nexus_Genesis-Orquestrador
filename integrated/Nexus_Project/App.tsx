import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Council from "./pages/Council";
import Startups from "./pages/Startups";
import Treasury from "./pages/Treasury";
import Market from "./pages/Market";
import Arbitrage from "./pages/Arbitrage";
import SoulVault from "./pages/SoulVault";
import Moltbook from "./pages/Moltbook";
import Audit from "./pages/Audit";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/council" component={Council} />
      <Route path="/startups" component={Startups} />
      <Route path="/treasury" component={Treasury} />
      <Route path="/market" component={Market} />
      <Route path="/arbitrage" component={Arbitrage} />
      <Route path="/soul-vault" component={SoulVault} />
      <Route path="/moltbook" component={Moltbook} />
      <Route path="/audit" component={Audit} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
