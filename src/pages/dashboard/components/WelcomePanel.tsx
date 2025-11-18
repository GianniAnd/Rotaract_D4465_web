import { Paper, Stack, Typography } from "@mui/material";

interface WelcomePanelProps {
  greeting: string;
  roleLabel: string;
  description: string;
  hint?: string;
}

export const WelcomePanel = ({
  greeting,
  roleLabel,
  description,
  hint,
}: WelcomePanelProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: { xs: 3, md: 4 },
      borderRadius: 4,
      background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    }}
  >
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={600}>
        {greeting}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Rol actual: {roleLabel}
      </Typography>
      <Typography variant="body1" color="text.primary">
        {description}
      </Typography>
      {hint ? (
        <Typography variant="body2" color="text.secondary">
          {hint}
        </Typography>
      ) : null}
    </Stack>
  </Paper>
);
