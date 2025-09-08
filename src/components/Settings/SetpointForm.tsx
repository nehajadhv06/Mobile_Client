import { Card, CardContent, Typography, TextField, Button } from "@mui/material";
import { Grid } from '@mui/material';
import { Settings as SettingsIcon, Save } from "@mui/icons-material";
import { useMqtt } from "../../hooks/MqttProvider";
import { useState } from "react";

// 1. Define allowed keys
type SetpointKey =
  | "S_UV"
  | "S_OV"
  | "S_UL"
  | "S_OL"
  | "S_TIMER_EN"
  | "S_HOUR"
  | "S_MIN"
  | "S_CYC_TIMER"
  | "S_ON_TIME"
  | "S_OFF_TIME"
  | "S_DRY_RUN_RST_TIME"
  | "S_SPP_BYPASS"
  | "S_POWER_ON_DLY"
  | "S_IOT_TIMER";

// 2. Type for setpoints object
type Setpoints = Record<SetpointKey, string>;

const SetpointForm = () => {
  const { parameters, submitSetpoints } = useMqtt();

  const [setpoints, setSetpoints] = useState<Setpoints>({
    S_UV: parameters.S_UV || "240",
    S_OV: parameters.S_OV || "470",
    S_UL: parameters.S_UL || "2",
    S_OL: parameters.S_OL || "20",
    S_TIMER_EN: parameters.S_TIMER_EN || "0",
    S_HOUR: parameters.S_HOUR || "1",
    S_MIN: parameters.S_MIN || "0",
    S_CYC_TIMER: parameters.S_CYC_TIMER || "0",
    S_ON_TIME: parameters.S_ON_TIME || "020",
    S_OFF_TIME: parameters.S_OFF_TIME || "060",
    S_DRY_RUN_RST_TIME: parameters.S_DRY_RUN_RST_TIME || "0",
    S_SPP_BYPASS: parameters.S_SPP_BYPASS || "0",
    S_POWER_ON_DLY: parameters.S_POWER_ON_DLY || "10",
    S_IOT_TIMER: parameters.S_IOT_TIMER || "2",
  });

  const setpointFields: { id: SetpointKey; label: string; min: number; max: number }[] = [
    { id: "S_UV", label: "UNDER VOLT", min: 0, max: 380 },
    { id: "S_OV", label: "OVER VOLT", min: 0, max: 550 },
    { id: "S_UL", label: "DRY RUN", min: 0, max: 100 },
    { id: "S_OL", label: "OVER LOAD", min: 2, max: 100 },
    { id: "S_TIMER_EN", label: "GSM OFF TIMER", min: 0, max: 1 },
    { id: "S_HOUR", label: "HOUR", min: 0, max: 23 },
    { id: "S_MIN", label: "MIN", min: 0, max: 59 },
    { id: "S_CYC_TIMER", label: "CYCLIC TIMER", min: 0, max: 1 },
    { id: "S_ON_TIME", label: "ON TIME", min: 1, max: 999 },
    { id: "S_OFF_TIME", label: "OFF TIME", min: 1, max: 999 },
    { id: "S_DRY_RUN_RST_TIME", label: "DRY RUN RESET", min: 0, max: 999 },
    { id: "S_SPP_BYPASS", label: "RP BYPASS", min: 0, max: 1 },
    { id: "S_POWER_ON_DLY", label: "POWER ON DELAY", min: 5, max: 300 },
    { id: "S_IOT_TIMER", label: "IOT TIME", min: 1, max: 999 },
  ];

  const handleChange = (id: SetpointKey, value: string) => {
    const numValue = parseInt(value);
    const field = setpointFields.find((f) => f.id === id);
    if (!field || isNaN(numValue) || numValue < field.min || numValue > field.max) {
      return;
    }
    setSetpoints((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" className="mb-6 flex items-center">
          <SettingsIcon className="mr-2 text-blue-500" /> SETPOINT CONFIGURATION
        </Typography>

        <Grid container spacing={3}>
          {setpointFields.map((field) => (
            <Grid item xs={12} md={6} lg={4} key={field.id}>
              <TextField
                fullWidth
                label={field.label}
                type="number"
                value={setpoints[field.id] ?? ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                InputProps={{
                  inputProps: { min: field.min, max: field.max },
                }}
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>

        <div className="mt-8 flex justify-center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Save />}
            onClick={() => submitSetpoints(setpoints)}
          >
            SAVE SETTINGS
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SetpointForm;
