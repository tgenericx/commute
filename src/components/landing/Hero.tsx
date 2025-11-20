import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background -z-10" />

      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-foreground/80">
              Built by students, for students
            </span>
          </div>

          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Campus life shouldn't be{" "}
            <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              scattered
            </span>
          </h1>

          <p className="mb-8 text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            A central hub where students can easily discover, manage, and
            connect around events happening on and off campus. Because you
            deserve better than a dozen WhatsApp groups.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="gap-2 group" onClick={onGetStarted}>
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Free forever · No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};
