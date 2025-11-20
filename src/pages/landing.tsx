import { useState } from "react";
import {
  Header,
  Hero,
  Features,
  HowItWorks,
  Why,
  Vision,
  CTA,
  Footer,
} from "@/components/landing";
import { AuthModal } from "@/components/auth";
import { useAuth } from "@/contexts/auth-context";
import { Navigate } from "react-router-dom";
import { AuthLoader } from "@/components/auth/protected-route";

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const { isAuthenticated, isLoadingUser } = useAuth();

  const openAuthModal = (view: "login" | "register") => {
    setAuthView(view);
    setAuthModalOpen(true);
  };

  if (isLoadingUser) {
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header onAuthClick={openAuthModal} />
      <main>
        <Hero onGetStarted={() => openAuthModal("register")} />
        <Features />
        <HowItWorks />
        <Why />
        <Vision />
        <CTA onGetStarted={() => openAuthModal("register")} />
      </main>
      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultView={authView}
      />
    </div>
  );
};

export default LandingPage;
