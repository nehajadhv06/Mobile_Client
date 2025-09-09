import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Bolt } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useMqtt } from '../../hooks/MqttProvider';

const LiveParameters = () => {
  const { deviceId, parameters } = useMqtt();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) {
      setError('No device ID provided. Please enter a valid device ID.');
    } else {
      setError(null);
    }
  }, [deviceId]);

  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Bolt fontSize="small" sx={{ mr: 1 }} />
            Live Parameters
          </Typography>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Bolt fontSize="small" sx={{ mr: 1 }} />
          Live Parameters (Device: {deviceId || 'None'})
        </Typography>
        <Grid container spacing={2}>
          {['C_VOLT', 'C_CURR', 'C_PUMP', 'C_AM_MODE', 'C_CYC_TIMER_MODE', 'C_ON_TIME', 'C_OFF_TIME'].map((key) => (
            <Grid item xs={6} key={key}>
              <Typography>
                {key.replace('C_', '')}: {parameters[key] || 'N/A'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LiveParameters;