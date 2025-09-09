import { Button, Card, CardContent } from '@mui/material';
import { PlayArrow, Stop, Refresh } from '@mui/icons-material';
import { useMqtt } from '../../hooks/MqttProvider';

const ControlButtons = () => {
  const { deviceId, sendCommand } = useMqtt();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Button
          variant="contained"
          color="success"
          startIcon={<PlayArrow />}
          onClick={() => sendCommand('START')}
          disabled={!deviceId}
          sx={{ mr: 1 }}
        >
          Start
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Stop />}
          onClick={() => sendCommand('STOP')}
          disabled={!deviceId}
          sx={{ mr: 1 }}
        >
          Stop
        </Button>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => sendCommand('REFRESH')}
          disabled={!deviceId}
        >
          Refresh
        </Button>
      </CardContent>
    </Card>
  );
};

export default ControlButtons;