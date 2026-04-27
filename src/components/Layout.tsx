import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "@/lib/audio";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Experiments", path: "/projects" },
  { label: "About", path: "/about" },
];

interface LayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function Layout({ children, maxWidth = "max-w-2xl" }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('a, button, [role="button"], input[type="checkbox"], input[type="radio"]');
    const isKeyboardTrigger = e.detail === 0;
    if (isInteractive && audioEngine.isEnabled() && !isKeyboardTrigger) {
      audioEngine.playSound("click");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [handleClick]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <span className="text-sm font-medium text-foreground">sai</span>

          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="pt-20 px-6 space-y-1"
              onClick={(e) => e.stopPropagation()}
            >
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block text-lg py-3 px-4 rounded-xl transition-colors",
                        isActive
                          ? "text-foreground bg-secondary/50 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="pt-8 px-4"
              >
                <p className="text-xs text-muted-foreground">build 1.01</p>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-48 border-r border-border flex-col">
        {/* Search */}
        <div className="p-6 pb-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 flex-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "block text-sm py-1.5 px-2 rounded-md transition-colors",
                  isActive
                    ? "text-foreground bg-secondary/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">build 1.01</p>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-48">
        <div className={cn(maxWidth, "mx-auto px-5 sm:px-8 py-8 pt-20 lg:pt-16 lg:py-16")}>
          {children}
        </div>
      </main>
    </div>
  );
}
