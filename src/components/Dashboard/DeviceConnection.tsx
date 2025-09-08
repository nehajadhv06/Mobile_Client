import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';
import { useMqtt } from '../../hooks/MqttProvider';

const DeviceConnection = () => {
  const { setDeviceId } = useMqtt();
  const [inputDeviceId, setInputDeviceId] = useState<string>('');

  const handleConnect = () => {
    if (!inputDeviceId) {
      alert('Please enter a valid device ID (e.g., MPU24001)');
      return;
    }
    // Prepend 'PR:' for MQTT topics
    const mqttDeviceId = `PR:${inputDeviceId}`;
    setDeviceId(mqttDeviceId);
    console.log('Set device ID:', mqttDeviceId);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        label="Device ID"
        value={inputDeviceId}
        onChange={(e) => setInputDeviceId(e.target.value.replace(/^PR:/, ''))} // Prevent user from entering PR:
        placeholder="e.g., MPU24001"
        sx={{ mr: 2 }}
      />
      <Button variant="contained" onClick={handleConnect}>
        Connect
      </Button>
    </Box>
  );
};

export default DeviceConnection;