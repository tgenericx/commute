import TimelinePost from "@/components/feed";
import FloatingActionButton from "@/components/FloatingActionButton";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />

      <TimelinePost />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
