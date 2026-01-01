import { RouterProvider } from "react-router";
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { AuthProvider } from './contexts/AuthContext';
import ClickSpark from './components/shared/ClickSpark';


function App() {

  return (
    <>
      <ThemeModeScript />
      <ThemeProvider theme={customTheme}>
        <AuthProvider>
          <ClickSpark
            sparkColor="#D4AF37"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <RouterProvider router={router} />
          </ClickSpark>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

