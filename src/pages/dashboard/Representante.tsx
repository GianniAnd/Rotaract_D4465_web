import { Stack } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";

export const Representante = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Representante";

  return (
    <Stack spacing={3}>
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Representante distrital"
        description="En esta vista centralizarás la gestión de clubes, reportes y peticiones del distrito."
        hint="Pronto habilitaremos herramientas para registrar nuevos clubes y monitorear su actividad."
      />
    </Stack>
  );
};
