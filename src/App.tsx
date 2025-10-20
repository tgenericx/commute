import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Events from "./pages/Events";
// import Marketplace from "./pages/Marketplace";
// import Boards from "./pages/Boards";
// import BoardDetail from "./pages/BoardDetail";
// import Profile from "./pages/Profile";
// import VendorProfile from "./pages/VendorProfile";
// import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
// import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RequireAuth } from "./components/RequireAuth";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/theme-provider";



const AppRoutes = () => {
  const { isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="text-muted-foreground">Checking authentication...</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      {/* <Route path="/signup" element={<Signup />} /> */}
      <Route path="/login" element={<Login />} />
      {/* <Route path="/auth/verify-email" element={<VerifyEmail />} /> */}

      Protected routes
      <Route
        path="/"
        element={
          <RequireAuth>
            <Index />
          </RequireAuth>
        }
      />
      {/* <Route */}
      {/*   path="/events" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <Events /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}
      {/* <Route */}
      {/*   path="/marketplace" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <Marketplace /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}
      {/* <Route */}
      {/*   path="/boards" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <Boards /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}
      {/* <Route */}
      {/*   path="/boards/:id" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <BoardDetail /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}
      {/* <Route */}
      {/*   path="/profile/:id" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <Profile /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}
      {/* <Route */}
      {/*   path="/vendor/:id" */}
      {/*   element={ */}
      {/*     <RequireAuth> */}
      {/*       <VendorProfile /> */}
      {/*     </RequireAuth> */}
      {/*   } */}
      {/* /> */}

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </>
);

export default App;
