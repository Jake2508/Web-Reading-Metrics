import { NavLink } from "react-router-dom";

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === "true";

export function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-black uppercase tracking-wide border-2 border-black transition-all duration-150 ${
      isActive
        ? "bg-black text-white"
        : "bg-white text-black hover:bg-[#FFEB3B] hover:-translate-y-0.5"
    }`;

  return (
    <header
      className="border-b-3 border-black bg-[#FFEB3B] px-6 py-4 flex items-center justify-between sticky top-0 z-10"
      style={{ borderBottomWidth: "3px", boxShadow: "0 4px 0 #000" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="border-2 border-black bg-black p-2 rounded-md"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-black text-black leading-none">Index</h1>
          <p className="text-xs font-bold text-black/50 leading-none">Reading Dashboard</p>
        </div>
      </div>

      <nav className="flex gap-2">
        <NavLink to="/" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/books" className={linkClass}>
          Library
        </NavLink>
        {!IS_STATIC && (
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        )}
      </nav>
    </header>
  );
}
