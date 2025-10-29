import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { RequireAuth } from "./components/RequireAuth";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/theme-provider";
import { AuthSheet } from "./components/auth";
import MediaLightbox from "./components/media/lightbox";
import { UserPreviewSheet } from "./components/user/preview";
import UserProfilePage from "./pages/profile/[id]";
import { SheetManagerProvider } from "./contexts/sheet-manager";
import { CreatePostSheet } from "./components/post/create-form";

const AppRoutes = () => {
  const { isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-muted-foreground">
          Checking authentication...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/user/:username" element={<UserProfilePage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Index />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <AuthProvider>
        <SheetManagerProvider>
          <AuthSheet />
          <CreatePostSheet />
          <MediaLightbox />
          <UserPreviewSheet />
          <AppRoutes />
        </SheetManagerProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
