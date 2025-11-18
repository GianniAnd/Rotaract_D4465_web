import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";
import { RoleBadge } from "../components/shared/RoleBadge";
import { Button } from "../components/ui/Button";
import { roleRouteMap, type UserRole } from "../types/auth";

interface NavItem {
  label: string;
  path: string;
  description: string;
}

const navigation: Record<UserRole, NavItem[]> = {
  INTERESADO: [
    {
      label: "Convocatorias",
      path: roleRouteMap.INTERESADO,
      description: "Convocatorias disponibles para interesados",
    },
  ],
  SOCIO: [
    {
      label: "Proyectos",
      path: roleRouteMap.SOCIO,
      description: "Proyectos del distrito",
    },
  ],
  "PRESIDENTE DEL CLUB": [
    {
      label: "Convocatorias",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#convocatorias`,
      description: "Convocatorias de mi club",
    },
    {
      label: "Proyectos",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#proyectos`,
      description: "Proyectos del club",
    },
    {
      label: "Miembros",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#miembros`,
      description: "Gestión de miembros",
    },
    {
      label: "Mi Club",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#mi-club`,
      description: "Información del club",
    },
  ],
  "REPRESENTANTE DISTRITAL": [
    {
      label: "Clubes",
      path: roleRouteMap["REPRESENTANTE DISTRITAL"],
      description: "Gestión de clubes del distrito",
    },
  ],
};

export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const items =
    role && navigation[role]
      ? navigation[role]
      : [
          {
            label: "Panel",
            path: "/dashboard",
            description: "Resumen general",
          },
        ];

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-bg-soft via-bg-soft to-bg-surface">
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobileNav}
        />
      )}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">Panel</p>
            <p className="text-lg font-semibold text-text-primary">
              {role ? role.replace("DEL ", "del ") : "Dashboard"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-white/80 px-4 py-2 text-sm font-medium text-text-primary shadow-sm backdrop-blur transition hover:border-primary hover:text-primary"
          >
            <MenuIcon fontSize="small" />
            Menú
          </button>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <aside
            className={clsx(
              "w-full lg:max-w-sm",
              "transition-all duration-300",
              mobileNavOpen
                ? "fixed inset-x-4 top-6 z-40 max-h-[90vh] overflow-y-auto rounded-3xl bg-bg-surface shadow-2xl lg:static lg:max-h-none lg:bg-transparent lg:shadow-none"
                : "hidden lg:block",
            )}
          >
            {mobileNavOpen && (
              <button
                type="button"
                onClick={closeMobileNav}
                className="absolute right-4 top-4 text-text-secondary transition hover:text-primary lg:hidden"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
            <div className="material-card relative flex flex-col gap-6 rounded-3xl p-6">
              <div className="space-y-2">
                <p className="text-sm text-text-secondary">Sesión iniciada</p>
                <p className="text-2xl font-semibold text-text-primary break-words leading-8">
                  {user?.nombre ?? user?.correo ?? "Miembro Rotaract"}
                </p>
              </div>
              {role && <RoleBadge role={role} />}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 shadow-inner">
                <p className="text-sm text-text-secondary">
                  Mantente al día con los indicadores clave de Rotaract D4465.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  closeMobileNav();
                }}
              >
                Cerrar sesión
              </Button>
            </div>
            <nav className="mt-6 space-y-3">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileNav}
                  className={({ isActive }) =>
                    [
                      "block w-full rounded-2xl border px-4 py-3 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-soft"
                        : "border-transparent bg-bg-surface text-text-primary hover:border-border-subtle hover:bg-bg-soft",
                    ].join(" ")
                  }
                >
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.description}</p>
                </NavLink>
              ))}
            </nav>
          </aside>
          <main className="flex-1 min-w-0 space-y-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
