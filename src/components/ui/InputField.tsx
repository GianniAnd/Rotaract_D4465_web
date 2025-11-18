import { forwardRef } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

interface InputFieldProps
  extends Omit<TextFieldProps, "error" | "helperText" | "variant" | "fullWidth"> {
  error?: string;
  helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ error, helperText, InputLabelProps, type, sx, ...props }, ref) => (
    <TextField
      {...props}
      type={type}
      inputRef={ref}
      variant="outlined"
      size="small"
      fullWidth
      error={Boolean(error)}
      helperText={error ?? helperText}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: type === "date" ? true : InputLabelProps?.shrink,
        sx: {
          fontWeight: 500,
          color: (theme) => theme.palette.text.secondary,
          ...InputLabelProps?.sx,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 20,
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.background.paper
              : theme.palette.background.default,
          transition: "border-color 0.2s, box-shadow 0.2s",
          "& fieldset": {
            borderColor: (theme) => theme.palette.divider,
          },
          "&:hover fieldset": {
            borderColor: (theme) => theme.palette.primary.main,
          },
          "&.Mui-focused fieldset": {
            borderColor: (theme) => theme.palette.primary.main,
            borderWidth: 1.5,
          },
        },
        "& .MuiInputBase-input": {
          padding: type === "date" ? "14px 16px" : "16px 18px",
          fontSize: "0.95rem",
        },
        ...sx,
      }}
    />
  ),
);
InputField.displayName = "InputField";
