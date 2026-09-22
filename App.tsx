import { useEffect, useRef, type ReactNode } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Dashboard from '@/pages/dashboard';
import Finder from '@/pages/finder';
import Counselor from '@/pages/counselor';
import UniversityDetail from '@/pages/university-detail';
import Planner from '@/pages/planner';
import { AppShell } from '@/components/app-shell';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#ef8068',
    colorForeground: '#263246',
    colorMutedForeground: '#697386',
    colorDanger: '#c4473d',
    colorBackground: '#fbfaf6',
    colorInput: '#f4f1e9',
    colorInputForeground: '#263246',
    colorNeutral: '#d8d2c6',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-[#fbfaf6] rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'text-[#263246]',
    headerSubtitle: 'text-[#697386]',
    socialButtonsBlockButtonText: 'text-[#263246]',
    formFieldLabel: 'text-[#263246]',
    footerActionLink: 'text-[#d9634e]',
    footerActionText: 'text-[#697386]',
    dividerText: 'text-[#697386]',
    identityPreviewEditButton: 'text-[#d9634e]',
    formFieldSuccessText: 'text-[#28705f]',
    alertText: 'text-[#c4473d]',
    logoBox: 'rounded-xl overflow-hidden',
    logoImage: 'rounded-xl',
    socialButtonsBlockButton: 'border-[#d8d2c6] bg-[#f4f1e9] hover:bg-[#ece8de]',
    formButtonPrimary: 'bg-[#263246] text-[#fbfaf6] hover:bg-[#34435b]',
    formFieldInput: 'border-[#d8d2c6] bg-[#f4f1e9] text-[#263246]',
    footerAction: 'text-[#697386]',
    dividerLine: 'bg-[#d8d2c6]',
    alert: 'border-[#e3b4ab] bg-[#fff2ee]',
    otpCodeFieldInput: 'border-[#d8d2c6] bg-[#f4f1e9] text-[#263246]',
    formFieldRow: 'text-[#263246]',
    main: 'text-[#263246]',
  },
};

function LoadingScreen() {
  return <div className="grid min-h-[100dvh] place-items-center bg-background text-sm text-muted-foreground">Loading your workspace…</div>;
}

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-10">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function HomeRedirect() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (isSignedIn) return <Redirect to="/dashboard" />;
  return <PublicLanding />;
}

function RequireSignedIn({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <Redirect to="/sign-in" />;
  return <>{children}</>;
}

function Portal({ children }: { children: ReactNode }) {
  return <RequireSignedIn><AppShell>{children}</AppShell></RequireSignedIn>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/" component={HomeRedirect} />
        <Route path="/dashboard" component={() => <Portal><Dashboard /></Portal>} />
        <Route path="/finder/:id" component={() => <Portal><UniversityDetail /></Portal>} />
        <Route path="/finder" component={() => <Portal><Finder /></Portal>} />
        <Route path="/counselor" component={() => <Portal><Counselor /></Portal>} />
        <Route path="/planner" component={() => <Portal><Planner /></Portal>} />
        <Route component={() => <Portal><NotFound /></Portal>} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'Welcome back', subtitle: 'Continue your Europe study plan' } },
        signUp: { start: { title: 'Create your workspace', subtitle: 'Build a clearer path to Europe' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <Router />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;

function PublicLanding() {
  return (
    <main className="min-h-[100dvh] bg-background">
      <header className="flex items-center justify-between border-b border-border/80 px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-3" data-testid="link-public-brand">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">E</span>
          <span><span className="block text-[15px] font-bold">EuroUni</span><span className="block font-mono-ui text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Matrix Engine</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground" data-testid="link-public-sign-in">Sign in</Link>
          <Link href="/sign-up" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground" data-testid="link-public-sign-up">Create account</Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-10 md:py-24">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">European study planning, made legible</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.05em] md:text-7xl">A better route to the right university.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">Match your profile, compare the real trade-offs, and turn admissions research into a plan you can act on.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm" data-testid="button-public-start">Start your matrix</Link>
            <Link href="/sign-in" className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground" data-testid="button-public-login">Sign in to continue</Link>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-border pt-5">
            <PublicStat value="44+" label="European nations" />
            <PublicStat value="4" label="visa phases" />
            <PublicStat value="1" label="working plan" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-xl md:p-8">
          <div className="map-grid absolute inset-0 opacity-50" />
          <div className="relative">
            <div className="flex items-center justify-between text-[10px] text-primary-foreground/55"><span className="font-mono-ui uppercase tracking-[0.18em]">Applicant workspace</span><span className="h-2 w-2 rounded-full bg-accent" /></div>
            <div className="mt-8 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-5 backdrop-blur-sm"><p className="font-mono-ui text-[9px] uppercase tracking-[0.16em] text-primary-foreground/55">Profile strength</p><div className="mt-2 flex items-baseline gap-2"><span className="font-display text-6xl">78</span><span className="text-sm text-primary-foreground/55">/100</span></div><div className="mt-5 h-1.5 rounded-full bg-primary-foreground/15"><div className="h-full w-[78%] rounded-full bg-accent" /></div></div>
            <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-primary-foreground/10 p-4"><p className="text-[10px] text-primary-foreground/55">Shortlist</p><p className="mt-2 font-display text-3xl">12</p><p className="mt-1 text-[10px] text-primary-foreground/60">across 7 countries</p></div><div className="rounded-2xl bg-primary-foreground/10 p-4"><p className="text-[10px] text-primary-foreground/55">Next move</p><p className="mt-2 font-display text-3xl">18d</p><p className="mt-1 text-[10px] text-primary-foreground/60">until KU Leuven</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PublicStat({ value, label }: { value: string; label: string }) {
  return <div><p className="font-display text-2xl">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{label}</p></div>;
}
