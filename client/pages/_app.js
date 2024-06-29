import "@/styles/globals.css";
import { RegistrationProvider } from "./registration-toggle-context";
export default function App({ Component, pageProps }) {
  return (
    <RegistrationProvider>
      <Component {...pageProps} />
    </RegistrationProvider>
  );
}
