import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();
  const [me, setMe] = useState(null);

  const navLinkClass = ({ isActive, to }) =>
    isActive || window.location.pathname.startsWith("/")
      ? "text-primary font-semibold"
      : "text-base-content/80 hover:text-primary";

  const handleLogout = () => {
    clearToken();
    setMe(null);
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const loadMe = async () => {
      if (!token) return setMe(null);
      try {
        const res = await getMe();
        setMe(res.data);
      } catch {
        clearToken();
        setMe(null);
      }
    };
    loadMe();
  }, [token]);

  const initials = me?.name
    ? me.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur border-b border-base-300">
      <div className="navbar max-w-6xl mx-auto px-2">
        {/* LEFT: Logo */}
        <div className="navbar-start">
          <Logo />
        </div>

        {/* CENTER: Desktop menu */}
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal gap-1">
            <li>
              <NavLink className={navLinkClass} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={navLinkClass} to="/courses">
                Courses
              </NavLink>
            </li>

            {/* ✅ Dashboard when logged in OR when dev_bypass is active */}
            {token && me ? (
              <li>
                <NavLink
                  className={navLinkClass}
                  to={me.role === "admin" ? "/admin" : "/student"}
                >
                  Dashboard
                </NavLink>
              </li>
            ) : localStorage.getItem("dev_bypass") === "true" ? (
              <>
                <li>
                  <NavLink className={navLinkClass} to="/student">
                    Student Portal
                  </NavLink>
                </li>
                <li>
                  <NavLink className={navLinkClass} to="/admin">
                    Admin Portal
                  </NavLink>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Desktop buttons if NOT logged in */}
          {!token && (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Enroll Now
              </Link>
            </div>
          )}

          {/* Desktop avatar if logged in */}
          {token && me && (
            <div className="hidden md:block dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                  {initials}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-60 border border-base-300 mt-3 z-[1]"
              >
                {/* Profile Header */}
                <li className="menu-title px-3 py-2">
                  <div className="flex flex-col gap-1 p-0">
                    <p className="font-semibold text-sm text-base-content truncate">
                      {me?.name}
                    </p>
                    <p className="text-xs text-base-content/70 truncate">
                      {me?.email}
                    </p>
                    <span className="badge badge-outline badge-sm mt-1 w-fit capitalize">
                      {me?.role}
                    </span>
                  </div>
                </li>

                <div className="divider my-1"></div>

                {/* Navigation Links */}
                <li>
                  <Link to={me?.role === "admin" ? "/admin" : "/student"}>
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile">👤 Profile</Link>
                </li>

                <div className="divider my-1"></div>

                {/* Logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-error hover:bg-error/10 active:bg-error/20"
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile hamburger */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="
                menu menu-sm dropdown-content mt-3 p-3 shadow
                bg-base-100 rounded-box w-56 border border-base-300
                items-center text-center max-h-32 overflow-hidden
              "
            >
              <li>
                <NavLink className={navLinkClass} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink className={navLinkClass} to="/courses">
                  Courses
                </NavLink>
              </li>

              {/* ✅ Dashboard only when logged in */}
              {token && me && (
                <li>
                  <NavLink
                    className={navLinkClass}
                    to={me.role === "admin" ? "/admin" : "/student"}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

              <div className="my-2 w-full border-t border-base-300" />

              {!token ? (
                <>
                  <li className="w-full">
                    <Link to="/login" className="btn btn-ghost btn-sm w-full">
                      Login
                    </Link>
                  </li>
                  <li className="w-full">
                    <Link
                      to="/register"
                      className="btn btn-primary btn-sm w-full"
                    >
                      Enroll Now
                    </Link>
                  </li>
                </>
              ) : (
                <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56 space-y-1">
                  {/* Profile Header */}
                  <li className="menu-title px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="font-semibold text-sm truncate text-base-content">
                          {me?.name}
                        </p>
                        <p className="text-xs text-base-content/70 truncate">
                          {me?.email}
                        </p>
                      </div>
                    </div>
                  </li>

                  <div className="divider my-0"></div>

                  {/* Navigation Links */}
                  <li>
                    <Link to={me?.role === "admin" ? "/admin" : "/student"}>
                      📊 Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link to="/profile">👤 Profile</Link>
                  </li>

                  <div className="divider my-0"></div>

                  {/* Logout Button */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-error hover:bg-error/10 active:bg-error/20 font-medium"
                    >
                      🚪 Logout
                    </button>
                  </li>
                </ul>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
