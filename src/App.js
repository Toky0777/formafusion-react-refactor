
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import router from "./routes/router";
import { LanguageProvider } from "./contexts/translation/LanguageContext";
import { TranslationProvider } from "./contexts/translation/TranslationContext";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <TranslationProvider>
          <RouterProvider router={router} />
        </TranslationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
