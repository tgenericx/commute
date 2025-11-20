export const WhySection = () => {
  return (
    <section className="py-20 px-4 bg-muted/50 border-y border-border">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <h2 className="mb-6 text-4xl md:text-5xl font-bold text-foreground">
            Why We're Doing It
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground">
            <p>
              We've all felt how scattered campus life can be — events
              everywhere, information nowhere, and communities that feel
              disconnected.
            </p>
            <p className="text-2xl font-semibold text-foreground leading-relaxed">
              Buddy started as a simple idea: make it easier for students to
              find what's happening and stay connected without the chaos.
            </p>
            <p>
              We're building this because we've lived these problems ourselves,
              and we know campus can be so much better when everything finally
              comes together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
