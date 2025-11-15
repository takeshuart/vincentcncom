import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showRequirements?: boolean;
  showVisibilityToggle?: boolean;
  fullWidth?: boolean;
  margin?: "normal" | "dense";
  size?: "small" | "medium";
}

export const validatePassword = (pwd: string): { valid: boolean; error?: string } => {
  if (!pwd) return { valid: false, error: "密码不能为空" };
  if (pwd.length < 8 || pwd.length > 16) return { valid: false, error: "密码长度必须为 8-16 个字符" };
  if (/\s/.test(pwd)) return { valid: false, error: "密码不能包含空格" };
  if (/^(.)\1+$/.test(pwd)) return { valid: false, error: "密码不能都是相同字符" };

  const chars = pwd.split("");
  const allAlpha = /^[A-Za-z]+$/.test(pwd);
  const allDigit = /^[0-9]+$/.test(pwd);

  if (allAlpha || allDigit) {
    for (let i = 0; i < chars.length - 2; i++) {
      const c1 = chars[i].charCodeAt(0);
      const c2 = chars[i + 1].charCodeAt(0);
      const c3 = chars[i + 2].charCodeAt(0);
      if ((c2 === c1 + 1 && c3 === c2 + 1) || (c2 === c1 - 1 && c3 === c2 - 1)) {
        return { valid: false, error: "密码不能有连续递增或递减的字符或数字 (如 abc 或 123)" };
      }
    }
  }

  return { valid: true };
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  label = "密码",
  value,
  onChange,
  error = "",
  disabled = false,
  showRequirements = false,
  showVisibilityToggle = true,
  fullWidth = true,
  margin = "normal",
  size = "medium",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Box>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        margin={margin}
        fullWidth={fullWidth}
        label={label}
        type={showPassword ? "text" : "password"}
        error={!!error}
        helperText={error}
        disabled={disabled}
        size={size}
        InputProps={{
          endAdornment: showVisibilityToggle ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                disabled={disabled}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
      
      {/* Show format requirements */}
      {showRequirements && !value && (
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}>
            密码要求：
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            • 8-16 个字符，不能有空格<br/>
            • 不能都是相同字符<br/>
            • 不能有连续递增/递减的字符或数字
          </Typography>
        </Box>
      )}

      {/* Show validation status */}
      {showRequirements && value && error && (
        <Typography sx={{ fontSize: 12, color: "error.main", mt: 0.5 }}>
          {error}
        </Typography>
      )}

      {showRequirements && value && !error && (
        <Typography sx={{ fontSize: 12, color: "success.main", mt: 0.5 }}>
          ✓ 密码格式正确
        </Typography>
      )}
    </Box>
  );
};

export default PasswordField;
