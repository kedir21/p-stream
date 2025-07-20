import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-ocean flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-cyan-bright/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-cyan-bright">404</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="ocean">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <button className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
