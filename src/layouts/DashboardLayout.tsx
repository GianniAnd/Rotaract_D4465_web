import { useMemo, useState, type ReactElement } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// RoleBadge ya no se usa aquí, se podría quitar si no se usa en el dropdown
// import { RoleBadge } from "../components/shared/RoleBadge";
import { roleRouteMap, type UserRole } from "../types/auth";
import clsx from "clsx";

// ---
// 1. COMPONENTES DE ICONOS (con el nuevo IconUser)
// ---
const commonIconProps = {
  className: "w-5 h-5 transition duration-75 group-hover:text-fg-brand",
  "aria-hidden": "true",
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  fill: "none",
  viewBox: "0 0 24 24",
};

// ... (IconDashboard, IconKanban, IconInbox, IconUsers sin cambios)
const IconDashboard = () => (
  <svg {...commonIconProps}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"/>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"/>
  </svg>
);
const IconKanban = () => (
  <svg {...commonIconProps}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/>
  </svg>
);
const IconInbox = () => (
  <svg {...commonIconProps}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 13h3.439a.991.991 0 0 1 .908.6 3.978 3.978 0 0 0 7.306 0 .99.99 0 0 1 .908-.6H20M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M4 13l2-9h12l2 9M9 7h6m-7 3h8"/>
  </svg>
);
const IconUsers = () => (
  <svg {...commonIconProps}>
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
  </svg>
);
// ¡NUEVO! Icono de usuario para el dropdown
const IconUser = () => (
  <svg
    className="w-8 h-8 rounded-full text-gray-500 bg-gray-100" // Clases para un look "por defecto"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
      clipRule="evenodd"
    />
  </svg>
);

// ---
// 2. INTERFAZ NavItem (sin cambios)
// ---
interface NavItem {
  label: string;
  path: string;
  icon: ReactElement;
  badge?: string | number;
  badgeType?: "pro" | "notification";
}

// ---
// 3. NAVEGACIÓN (sin cambios)
// ---
const navigation: Record<UserRole, NavItem[]> = {
  INTERESADO: [
    {
      label: "Convocatorias",
      path: roleRouteMap.INTERESADO,
      icon: <IconInbox />,
      badge: 2,
      badgeType: "notification",
    },
  ],
  SOCIO: [
    {
      label: "Proyectos",
      path: roleRouteMap.SOCIO,
      icon: <IconKanban />,
      badge: "Pro",
      badgeType: "pro",
    },
  ],
  "PRESIDENTE DEL CLUB": [
    {
      label: "Convocatorias",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#convocatorias`,
      icon: <IconInbox />,
      badge: 5,
      badgeType: "notification",
    },
    {
      label: "Proyectos",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#proyectos`,
      icon: <IconKanban />,
    },
    {
      label: "Miembros",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#miembros`,
      icon: <IconUsers />,
    },
    {
      label: "Mi Club",
      path: `${roleRouteMap["PRESIDENTE DEL CLUB"]}#mi-club`,
      icon: <IconDashboard />,
    },
  ],
  "REPRESENTANTE DISTRITAL": [
    {
      label: "Clubes",
      path: roleRouteMap["REPRESENTANTE DISTRITAL"],
      icon: <IconUsers />,
    },
  ],
};

// ---
// 4. COMPONENTE DE LAYOUT ACTUALIZADO
// ---
export const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false); // Estado para el sidebar
  const [userMenuOpen, setUserMenuOpen] = useState(false); // ¡NUEVO! Estado para el dropdown de usuario

  const navItems = useMemo(
    () => (role && navigation[role] ? navigation[role] : []),
    [role]
  );

  return (
    <div>
      {/* === BARRA DE NAVEGACIÓN SUPERIOR (NUEVO) === */}
      <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              
              {/* Botón de Hamburguesa (controla el sidebar) */}
              <button
                type="button"
                onClick={() => setOpen(!open)} // Controlado por React
                aria-controls="top-bar-sidebar"
                className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
                </svg>
              </button>

              {/* Título (Rol del usuario en lugar de Logo) */}
              <div className="flex ms-2 md:me-24">
                <span className="self-center text-lg font-semibold whitespace-nowrap text-heading">
                  {role}
                </span>
              </div>
            </div>

            {/* Menú de Usuario (Derecha) */}
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                
                {/* Botón de Avatar (controla el dropdown) */}
                <div>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)} // Controlado por React
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                    aria-expanded={userMenuOpen}
                  >
                    <span className="sr-only">Open user menu</span>
                    <IconUser /> {/* Icono por defecto como pediste */}
                  </button>
                </div>

                {/* Contenido del Dropdown */}
                <div
                  className={clsx(
                    "z-50 absolute top-8 right-0 my-4 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-56",
                    !userMenuOpen && "hidden" // Controlado por React
                  )}
                  id="dropdown-user"
                >
                  <div className="px-4 py-3 border-b border-default-medium" role="none">
                    <p className="text-sm font-medium text-heading" role="none">
                      {user?.nombre ?? user?.correo}
                    </p>
                    <p className="text-sm text-body truncate" role="none">
                      {user?.correo}
                    </p>
                    {/* {role && (
                      <div className="mt-2">
                        <RoleBadge role={role} />
                      </div>
                    )} */}
                  </div>
                  <ul className="p-2 text-sm text-body font-medium" role="none">
                    {/* Puedes añadir más links aquí si quieres */}
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                        role="menuitem"
                      >
                        Sign out (Cerrar sesión)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* === SIDEBAR (Actualizado) === */}
      <aside
        id="top-bar-sidebar" // ID coincide con el botón de hamburguesa
        className={clsx(
          "fixed top-0 left-0 z-40 w-64 h-full transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0"
          // "bg-neutral-primary-soft border-e border-default" // -> Ya no es necesario el h-screen, h-full es mejor
        )}
        aria-label="Sidebar"
      >
        {/* El div interior ahora necesita padding-top para empezar DEBAJO del nav */}
        <div className="h-full px-3 py-4 pt-20 overflow-y-auto bg-neutral-primary-soft border-e border-default">
          
          {/* ¡Eliminado! La tarjeta de usuario ya no va aquí */}

          {/* === MENÚ (sin cambios en el .map) === */}
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group",
                      isActive && "bg-neutral-tertiary text-fg-brand"
                    )
                  }
                  onClick={() => setOpen(false)} // Cierra el sidebar en móvil
                >
                  {item.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    {item.label}
                  </span>
                  {item.badge && item.badgeType === "pro" && (
                    <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && item.badgeType === "notification" && (
                    <span className="inline-flex items-center justify-center w-4.5 h-4.5 ms-2 text-xs font-medium text-fg-danger-strong bg-danger-soft border border-danger-subtle rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* === CONTENIDO PRINCIPAL (Actualizado) === */}
      <div className="p-4 sm:ml-64 mt-14"> {/* ¡NUEVO! mt-14 para dejar espacio al nav */}
        <div className="p-4 border border-default border-dashed rounded-base">
          <Outlet />
        </div>
      </div>
    </div>
  );
};