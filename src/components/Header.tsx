import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ocean-deep/80 backdrop-blur-md border-b border-ocean-light">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-ocean rounded-lg flex items-center justify-center">
                <span className="text-cyan-bright font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">P-Stream</span>
            </Link>
          </div>


          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/discover?category=movie" className="text-foreground hover:text-cyan-bright transition-colors">
              Movies
            </Link>
            <Link to="/discover?category=tv" className="text-foreground hover:text-cyan-bright transition-colors">
              TV Shows
            </Link>
           
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
        </div>
      </div>
    </header>
  );
};

export default Header;