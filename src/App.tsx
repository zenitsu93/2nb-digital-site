import { RouterProvider } from "react-router";
import { ThemeModeScript, ThemeProvider } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { AuthProvider } from './contexts/AuthContext';


function App() {

  return (
    <>
      <ThemeModeScript />
      <ThemeProvider theme={customTheme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

