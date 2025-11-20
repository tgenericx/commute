import { Routes, Route, Navigate } from "react-router-dom";
import { SocialPage } from "./pages/home";
import { EventsPage } from "./pages/EventsPage/EventsPage";
import { MarketplacePage } from "./pages/MarketplacePage/MarketplacePage";
import { DiscoverPage } from "./pages/DiscoverPage/DiscoverPage";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/landing";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import ThemeSettingsPage from "./pages/SettingsPage/ThemeSettingsPage";
import { AccountPage } from "./pages/SettingsPage/AccountPage";
import { PrivacyPage } from "./pages/SettingsPage/PrivacyPage";
import { NotificationsPage } from "./pages/SettingsPage/NotificationsPage";
import { Toaster } from "./components/ui/sonner";
import SocialMediaApp from "./components/media/app";
import SettingsLayout from "./components/settings/layout";
import { TabsLayout } from "./components/tabs";
import { ProtectedRoute } from "./components/auth/protected-route";

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/posts" element={<SocialMediaApp />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <TabsLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<SocialPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="appearance" element={<ThemeSettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
