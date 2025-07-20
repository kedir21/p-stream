import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-ocean overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-bright/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-cyan-bright/50 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-cyan-bright/40 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-cyan-bright/35 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-60 left-1/3 w-1 h-1 bg-cyan-bright/45 rounded-full animate-pulse delay-500"></div>
        
        {/* Floating fish-like shapes */}
        <div className="absolute top-32 left-1/2 w-8 h-4 bg-cyan-bright/20 rounded-full animate-bounce"></div>
        <div className="absolute top-80 right-1/4 w-6 h-3 bg-cyan-bright/15 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-10 h-5 bg-cyan-bright/10 rounded-full animate-bounce delay-1200"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          What would you like to{" "}
          <span className="text-transparent bg-gradient-to-r from-cyan-bright to-primary bg-clip-text">
            watch
          </span>{" "}
          this afternoon?
        </h1>

        {/* Search section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="What do you want to watch?"
              className="pl-12 pr-4 py-4 text-lg bg-ocean-mid/50 border-ocean-light text-foreground placeholder:text-muted-foreground focus:ring-cyan-bright focus:border-cyan-bright backdrop-blur-sm rounded-xl"
            />
          </div>

       
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-deep to-transparent"></div>
    </section>
  );
};

export default Hero;