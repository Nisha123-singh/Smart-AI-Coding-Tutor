import { LayoutDashboard, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { SectionId } from '../types';

interface NavbarProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

const NAV_LINKS: Array<{ id: SectionId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn Coding' },
  { id: 'theory', label: 'Theory' },
  { id: 'tutor', label: 'AI Tutor' },
  { id: 'lab', label: 'Code Lab' },
  { id: 'practice', label: 'Practice' },
  { id: 'coding-practice', label: 'Coding Practice' },
];

export function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const { user, authBusy, signInWithGoogle, signOutUser } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      void signOutUser();
    } else {
      void signInWithGoogle();
    }
  };

  const userFirstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || '';

  return (
    <header className="lg:sticky lg:top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Top Row */}
        <div className="min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-md px-1 -ml-1"
          >
            Smart AI Coding Tutor
          </button>

          {/* Zone 2: All Main Options (Desktop single-row) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600"
          >
            {NAV_LINKS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-sm ${
                    isActive ? 'text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[19px] h-0.5 bg-sky-600"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Dashboard & Sign In / Sign Out */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
                activeSection === 'dashboard'
                  ? 'bg-sky-600 border-sky-600 text-white'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              disabled={authBusy}
              onClick={handleAuthAction}
              aria-label={user ? 'Sign out of Firebase account' : 'Sign in with Google'}
              title={user ? `Signed in as ${user.email || user.displayName}` : 'Sign in with Google'}
              className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
                user
                  ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>{authBusy ? 'Signing out...' : `Sign Out${userFirstName ? ` (${userFirstName})` : ''}`}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{authBusy ? 'Signing in...' : 'Sign In'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Always-Visible Navigation Strip for Narrow/Preview Viewports (< 1024px) */}
        <nav
          aria-label="Section navigation"
          className="lg:hidden border-t border-slate-100 py-2 flex items-center gap-4 overflow-x-auto text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`py-1.5 px-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-sky-600 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
