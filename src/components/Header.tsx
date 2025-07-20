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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="What do you want to watch?"
              className="pl-10 bg-ocean-mid/50 border-ocean-light text-foreground placeholder:text-muted-foreground focus:ring-cyan-bright focus:border-cyan-bright"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;