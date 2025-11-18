import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import {
  fetchClubConvocatorias,
  createConvocatoria,
  type Convocatoria,
  type CreateConvocatoriaPayload,
} from "../../api/convocatorias";
import { InputField } from "../../components/ui/InputField";

const createDefaultConvocatoriaValues = (): CreateConvocatoriaPayload => {
  const today = new Date();
  const iso = today.toISOString().substring(0, 10);
  return {
    titulo: "",
    descripcion: "",
    requisitos: "",
    cupoMaximo: 10,
    fechaPublicacion: iso,
    fechaInicioPostulacion: iso,
    fechaFinPostulacion: iso,
    fechaCierre: iso,
  };
};

export const Presidente = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Presidente";

  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConvocatoriaPayload>({
    defaultValues: createDefaultConvocatoriaValues(),
  });

  const loadConvocatorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchClubConvocatorias({
        page: page - 1,
        size: pageSize,
      });
      setConvocatorias(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total);
      const responsePage = response.page + 1;
      if (responsePage !== page && responsePage > 0) {
        setPage(responsePage);
      }
    } catch (err) {
      console.error("No se pudieron obtener las convocatorias", err);
      setError("Ocurrió un error al cargar tus convocatorias.");
      setConvocatorias([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadConvocatorias();
  }, [loadConvocatorias]);

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    const value = Number(event.target.value);
    setPageSize(value);
    setPage(1);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFormError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    reset(createDefaultConvocatoriaValues());
    setFormError(null);
  };

  const onSubmit = async (values: CreateConvocatoriaPayload) => {
    try {
      setFormError(null);
      await createConvocatoria({
        ...values,
        cupoMaximo: Number(values.cupoMaximo),
      });
      handleCloseDialog();
      setPage(1);
      loadConvocatorias();
    } catch (err) {
      console.error("Error creando convocatoria", err);
      setFormError("No pudimos crear la convocatoria. Intenta nuevamente.");
    }
  };

  const paginationLabel = useMemo(() => {
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);
    return `Mostrando ${start}-${end} de ${totalItems}`;
  }, [page, pageSize, totalItems]);

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <Stack spacing={4}>
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Presidente del club"
        description="Administra tus convocatorias desde un solo lugar, revisa su estado e inicia nuevas oportunidades."
        hint="Pronto podrás crear convocatorias directamente desde este panel."
      />

      <Paper
        id="convocatorias"
        variant="outlined"
        sx={{ p: 3, borderRadius: 3 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ mb: 3 }}
        >
          <div>
            <Typography variant="h6" fontWeight={600}>
              Convocatorias del club
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Consulta tus convocatorias vigentes y planifica las próximas.
            </Typography>
          </div>
          <Stack direction="row" spacing={1} alignItems="center">
            <Select
              size="small"
              value={String(pageSize)}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 15].map((option) => (
                <MenuItem key={option} value={option}>
                  {option} / pág
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Recargar">
              <IconButton onClick={loadConvocatorias}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ whiteSpace: "nowrap" }}
            >
              Crear convocatoria
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack alignItems="center" sx={{ py: 6 }} spacing={2}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando convocatorias...
            </Typography>
          </Stack>
        ) : convocatorias.length === 0 ? (
          <Stack alignItems="center" sx={{ py: 6 }} spacing={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              No tienes convocatorias registradas.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea una nueva convocatoria para invitar a interesados desde tu
              club.
            </Typography>
          </Stack>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Convocatoria</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Inicio postul.</TableCell>
                    <TableCell align="center">Cierre</TableCell>
                    <TableCell align="right">Cupo máx.</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {convocatorias.map((convocatoria) => (
                    <TableRow key={convocatoria.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {convocatoria.titulo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {convocatoria.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          label={convocatoria.estado}
                          color={
                            convocatoria.estado?.toLowerCase() === "activa"
                              ? "success"
                              : convocatoria.estado?.toLowerCase() === "cerrada"
                                ? "default"
                                : "info"
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(convocatoria.fechaInicioPostulacion)}
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(convocatoria.fechaCierre)}
                      </TableCell>
                      <TableCell align="right">
                        {convocatoria.cupoMaximo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              sx={{ mt: 3 }}
            >
              <Typography variant="body2" color="text.secondary">
                {paginationLabel}
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Stack>
          </>
        )}
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(249,250,251,0.97))",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}>
          Nueva convocatoria
        </DialogTitle>
        <DialogContent dividers sx={{ borderTop: "1px solid rgba(148,163,184,0.2)" }}>
          <form id="create-convocatoria" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <InputField
                    label="Título"
                    error={errors.titulo?.message}
                    {...registerField("titulo", {
                      required: "El título es obligatorio",
                      minLength: {
                        value: 4,
                        message: "Incluye al menos 4 caracteres",
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputField
                    label="Cupo máximo"
                    type="number"
                    inputProps={{ min: 1 }}
                    error={errors.cupoMaximo?.message}
                    {...registerField("cupoMaximo", {
                      valueAsNumber: true,
                      required: "Ingresa el cupo máximo",
                      min: { value: 1, message: "Debe ser mayor a 0" },
                    })}
                  />
                </Grid>
              </Grid>
              <InputField
                label="Descripción"
                multiline
                minRows={3}
                error={errors.descripcion?.message}
                {...registerField("descripcion", {
                  required: "La descripción es obligatoria",
                  minLength: {
                    value: 10,
                    message: "Detalla al menos 10 caracteres",
                  },
                })}
              />
              <InputField
                label="Requisitos"
                multiline
                minRows={3}
                error={errors.requisitos?.message}
                {...registerField("requisitos", {
                  required: "Describe los requisitos",
                })}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Fecha de publicación"
                    type="date"
                    error={errors.fechaPublicacion?.message}
                    {...registerField("fechaPublicacion", {
                      required: "Selecciona una fecha",
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Fecha de cierre"
                    type="date"
                    error={errors.fechaCierre?.message}
                    {...registerField("fechaCierre", {
                      required: "Selecciona una fecha",
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Inicio de postulación"
                    type="date"
                    error={errors.fechaInicioPostulacion?.message}
                    {...registerField("fechaInicioPostulacion", {
                      required: "Selecciona una fecha",
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Fin de postulación"
                    type="date"
                    error={errors.fechaFinPostulacion?.message}
                    {...registerField("fechaFinPostulacion", {
                      required: "Selecciona una fecha",
                    })}
                  />
                </Grid>
              </Grid>
              {formError && (
                <Alert severity="error" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-convocatoria"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
