import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FilePlus, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { useAuth } from "../hooks/useAuth";

export const AppLayout = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links =
    user?.role === "manager"
      ? [
          { to: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard }
        ]
      : [
          { to: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/employee/requests/new", label: "Create Request", icon: FilePlus },
          { to: "/employee/requests", label: "My Requests", icon: Inbox }
        ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
        <div className="border-b border-slate-200 p-5">
          <h1 className="text-lg font-bold text-royal-900">Royal Group</h1>
          <p className="text-sm text-slate-500">Request Approvals</p>
        </div>
        <nav className="flex gap-2 p-3 lg:block">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-royal-100 text-royal-900" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="font-semibold text-royal-900">{user?.name}</p>
            <p className="text-sm capitalize text-slate-500">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
