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
      <div className="flex items-center gap-2.5">
        <span className="w-3 h-3 bg-[#FF7A7A] rounded-[3px] flex-shrink-0" />
        <span
          style={{
            fontSize: "22px",
            fontWeight: 900,
            color: "#141414",
            letterSpacing: "-0.3px",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Reading Dashboard
        </span>
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
