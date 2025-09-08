import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Bolt } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import { useMqtt } from '../../hooks/MqttProvider';


const LiveParameters = () => {
  const { deviceId } = useMqtt();
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchParameters = async () => {
    if (!deviceId) {
      setError('No device ID provided. Please enter a valid device ID.');
      return;
    }
    try {
      console.log(`Fetching parameters for device: ${deviceId}`);
      const response = await api.get<Record<string, string>>(`/parameters/${deviceId}`);
      console.log('Parameters fetched successfully:', response.data);
      setParameters(response.data);
      setError(null);
    } catch (error: any) {
      const errorMessage = error.response?.status === 404
        ? `No parameters found for device ${deviceId}. Please ensure the device is sending data.`
        : `Failed to fetch parameters for device ${deviceId}: ${error.message}`;
      console.error('Error fetching parameters:', errorMessage, error);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchParameters();
      const interval = setInterval(fetchParameters, 5000);
      return () => clearInterval(interval);
    } else {
      setError('No device ID provided. Please enter a valid device ID.');
    }
  }, [deviceId]);

  const handleRetry = () => {
    setError(null);
    fetchParameters();
  };

  if (error) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Bolt fontSize="small" sx={{ mr: 1 }} />
            Live Parameters
          </Typography>
          <Typography color="error">{error}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
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