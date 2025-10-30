import FloatingActionButton from "@/components/FloatingActionButton";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <div className="max-w-3xl mx-auto p-4 mt-8 space-y-8">
        <h1 className="text-lg">Greetings</h1>
        <p>we're still getting our shit together, bear with us.</p>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Index;
