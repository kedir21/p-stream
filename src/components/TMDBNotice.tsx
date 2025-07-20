import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const TMDBNotice = () => {
  return (
    <div className="bg-ocean-mid/50 border border-ocean-light rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-6 h-6 text-cyan-bright flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            TMDB API Configuration Required
          </h3>
          <p className="text-muted-foreground mb-4">
            To display real movie and TV show data, you'll need to configure your TMDB API key. 
            The Movie Database (TMDB) is a free API that provides comprehensive movie and TV show information.
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground mb-1">Steps to get your API key:</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1 ml-4">
                <li>Create a free account at themoviedb.org</li>
                <li>Go to your account settings</li>
                <li>Navigate to the API section</li>
                <li>Request an API key</li>
                <li>Add your key to the useTMDB.ts file</li>
              </ol>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://www.themoviedb.org/signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2"
              >
                <span>Get TMDB API Key</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TMDBNotice;