import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import App from './App';
import LandingPage from './LandingPage';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) { throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY'); }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <App />
      </SignedIn>
    </ClerkProvider>
  </StrictMode>,
);
