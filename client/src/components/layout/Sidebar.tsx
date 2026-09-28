import { NavLink, useLocation } from "react-router-dom";
import { useStats } from "../../features/dashboard/hooks/useStats";
import { HeadlineTotals } from "../../features/dashboard/HeadlineTotals";

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === "true";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/books", label: "Library", end: false },
  ...(IS_STATIC ? [] : [{ to: "/admin", label: "Admin", end: false }]),
];

function SidebarTotals() {
  const { data: stats } = useStats();
  if (!stats || stats.totalBooks === 0) return null;
  return (
    <section aria-label="Headline totals" className="hidden border-t border-border-subtle pt-8 md:block">
      <HeadlineTotals stats={stats} layout="stack" />
    </section>
  );
}

/**
 * 240px sidebar from 800px up; below that it collapses into a top bar with the
 * nav, and the Dashboard shows the totals in its own header instead.
 */
export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg md:h-screen md:border-r md:border-b-0">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 md:h-full md:flex-col md:items-stretch md:justify-start md:gap-8 md:overflow-y-auto md:px-6 md:py-7">
        <div>
          <p className="font-serif text-metric font-semibold text-text">Booked</p>
          <p className="text-meta text-text-muted max-md:hidden">Reading dashboard</p>
        </div>

        <nav aria-label="Main">
          <ul className="flex gap-1 md:flex-col">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2.5 text-body font-medium transition-colors duration-150 ease-out ${
                      isActive ? "bg-surface-2 text-text" : "text-text-muted hover:bg-surface-2 hover:text-text"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {pathname === "/" && <SidebarTotals />}
      </div>
    </header>
  );
}
