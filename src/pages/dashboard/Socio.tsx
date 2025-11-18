import { Stack } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";

export const Socio = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Socio";

  return (
    <Stack spacing={3}>
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Socio"
        description="Estamos preparando tu panel para que consultes los proyectos del distrito y sigas su avance en tiempo real."
        hint="En breve podrás explorar iniciativas, actualizaciones y recursos compartidos por otros clubes."
      />
    </Stack>
  );
};
