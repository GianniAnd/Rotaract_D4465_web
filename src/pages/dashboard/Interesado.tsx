import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PlaceIcon from "@mui/icons-material/Place";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";
import {
  fetchPublicConvocatorias,
  type Convocatoria,
} from "../../api/convocatorias";

export const Interesado = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Interesado";
  const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConvocatorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPublicConvocatorias({
        page: page - 1,
        size: pageSize,
      });
      setConvocatorias(response.items);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total);
      const responsePage = response.page + 1;
      if (responsePage > 0 && responsePage !== page) {
        setPage(responsePage);
      }
    } catch (err) {
      console.error("Error obteniendo convocatorias públicas", err);
      setError("No se pudieron cargar las convocatorias. Intenta nuevamente.");
      setConvocatorias([]);
      setTotalPages(1);
      setTotalItems(0);
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
    <Stack spacing={3}>
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Interesado"
        description="Muy pronto verás aquí las convocatorias activas disponibles para participar en tu distrito."
        hint="Conecta tus intereses y postula directamente desde este panel en cuanto esté listo."
      />
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <div>
            <Typography variant="h6" fontWeight={600}>
              Convocatorias disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explora iniciativas compartidas por clubes Rotaract y postula en
              cuestión de minutos.
            </Typography>
          </div>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Por página
            </Typography>
            <Select
              size="small"
              value={String(pageSize)}
              onChange={handlePageSizeChange}
            >
              {[6, 9, 12].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 200, py: 6 }}
            spacing={2}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Cargando convocatorias...
            </Typography>
          </Stack>
        ) : convocatorias.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: 200, py: 6 }}
            spacing={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              No encontramos convocatorias activas.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vuelve más tarde para descubrir nuevas oportunidades.
            </Typography>
          </Stack>
        ) : (
          <>
            <Grid container spacing={3}>
              {convocatorias.map((convocatoria) => (
                <Grid item xs={12} md={6} lg={4} key={convocatoria.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                        sx={{ mb: 1 }}
                      >
                        <Chip
                          size="small"
                          label={convocatoria.estado}
                          color={
                            convocatoria.estado?.toLowerCase() === "activa"
                              ? "success"
                              : "default"
                          }
                        />
                        <Tooltip title="Guardar para revisar más tarde">
                          <IconButton size="small">
                            <BookmarkBorderIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                      <Typography variant="h6" gutterBottom>
                        {convocatoria.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {convocatoria.descripcion}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <PlaceIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          {convocatoria.clubNombre}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EventAvailableIcon fontSize="small" color="primary" />
                        <Typography variant="body2" color="text.secondary">
                          Cierra {formatDate(convocatoria.fechaCierre)}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Box flex={1} />
                      <Typography variant="caption" color="text.secondary">
                        Cupo máximo: {convocatoria.cupoMaximo}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              sx={{ mt: 4 }}
            >
              <Typography variant="body2" color="text.secondary">
                {paginationLabel}
              </Typography>
              <Pagination
                color="primary"
                shape="rounded"
                count={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            </Stack>
          </>
        )}
      </Paper>
    </Stack>
  );
};
