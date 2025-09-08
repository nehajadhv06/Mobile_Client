import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Warning } from '@mui/icons-material';
import axios from 'axios';
import { useMqtt } from '../../hooks/MqttProvider';

const LiveFaults = () => {
  const { deviceId } = useMqtt();
  const [parameters, setParameters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (deviceId) {
      const fetchParameters = async () => {
        try {
          const response = await axios.get<Record<string, string>>(
            `http://localhost:8080/api/parameters/${deviceId}`
          );
          setParameters(response.data);
        } catch (error) {
          console.error('Error fetching faults:', error);
        }
      };
      fetchParameters();
      const interval = setInterval(fetchParameters, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [deviceId]);

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
