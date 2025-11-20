import { Calendar, Users, Zap } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Join Your Campus",
    description:
      "Create your profile in under a minute. Connect with your university community and personalize your experience.",
    step: "01",
  },
  {
    icon: Calendar,
    title: "Discover & Engage",
    description:
      "Find events, browse marketplace listings, and join conversations. RSVP to events, buy what you need, sell what you don't.",
    step: "02",
  },
  {
    icon: Zap,
    title: "Create & Grow",
    description:
      "Host your own events, list items for sale, book venues, and build your campus presence—all from one place.",
    step: "03",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-linear-to-r from-primary to-primary/50" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center relative z-10">
                    <Icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
