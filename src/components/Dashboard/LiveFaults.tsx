import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useMqtt } from '../../hooks/MqttProvider';

const LiveFaults = () => {
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
          <Typography variant="h6" gutterBottom>
            <Warning fontSize="small" sx={{ mr: 1 }} />
            Live Faults
          </Typography>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Warning fontSize="small" sx={{ mr: 1 }} />
          Live Faults
        </Typography>
        <Grid container spacing={2}>
          {['F_UV', 'F_OV', 'F_SPP_RP', 'F_OL', 'F_UL'].map((key) => (
            <Grid item xs={6} key={key}>
              <Typography color={parameters[key] === '1' ? 'error' : 'inherit'}>
                {key.replace('F_', '')}: {parameters[key] === '1' ? 'Active' : 'Inactive'}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LiveFaults;