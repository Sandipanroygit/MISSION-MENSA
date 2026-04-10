import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "@/routes";
import { AuthProvider } from "@/context/AuthContext";
import SiteAccessGate from "@/components/common/SiteAccessGate";
import "./App.css";

function App() {
  return (
    <Router>
      <SiteAccessGate>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </SiteAccessGate>
    </Router>
  );
}

export default App;
