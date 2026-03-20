import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">A página que você está procurando não existe.</p>
        <Button 
          onClick={() => setLocation("/")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  );
}
