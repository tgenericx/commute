import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTAProps {
  onGetStarted: () => void;
}

export const CTASection = ({ onGetStarted }: CTAProps) => {
  return (
    <section className="py-20 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="mx-auto max-w-2xl text-center animate-fade-in">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold text-foreground">
            Ready to connect?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join your campus community today. It's free, always will be.
          </p>
          <Button size="lg" className="gap-2 group" onClick={onGetStarted}>
            Get Started Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};
