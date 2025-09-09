import { TextField, Button, Box, Alert, Chip } from '@mui/material';
import { useState,useEffect } from 'react';
import { useMqtt } from '../../hooks/MqttProvider';

const DeviceConnection = () => {
  const { setDeviceId, isConnected, connectionStatus, connectionMode } = useMqtt();
  const [inputDeviceId, setInputDeviceId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConnect = () => {
    if (!inputDeviceId.trim()) {
      setError('Please enter a valid device ID (e.g., MPU25001)');
      return;
    }
    
    // Prepend 'PR:' for MQTT topics if not already present
const mqttDeviceId = inputDeviceId.startsWith('PR:') 
  ? inputDeviceId 
  : `PR:${inputDeviceId}`;
setDeviceId(mqttDeviceId);
    console.log('Set device ID:', mqttDeviceId);
  };

  // Load device ID from localStorage on component mount
  useEffect(() => {
    const savedDeviceId = localStorage.getItem('deviceId');
    if (savedDeviceId) {
      setInputDeviceId(savedDeviceId.replace(/^PR:/, '')); // Update input field
      setDeviceId(savedDeviceId); // Update MQTT context
    }
  }, [setDeviceId]); // Dependency array includes setDeviceId

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Device ID"
          value={inputDeviceId}
          onChange={(e) => {
            setInputDeviceId(e.target.value.replace(/^PR:/, '')); // Prevent user from entering PR:
            setError('');
          }}
          placeholder="e.g., MPU25001"
          sx={{ mr: 2, width: '250px' }}
          error={!!error}
          helperText={error}
        />
        <Button 
          variant="contained" 
          onClick={handleConnect}
          disabled={!inputDeviceId.trim()}
          sx={{ mr: 1 }}
        >
          Connect
        </Button>
        <Chip 
          label={connectionMode.toUpperCase()} 
          color={connectionMode === 'mqtt' ? 'success' : 'warning'}
          variant="outlined"
        />
      </Box>
      
      <Alert 
        severity={isConnected ? "success" : connectionMode === 'http' ? "warning" : "error"} 
        sx={{ mt: 1 }}
      >
        {connectionStatus}
      </Alert>
      
      {connectionMode === 'http' && (
        <Alert severity="info" sx={{ mt: 1 }}>
          Using HTTP API as fallback. Setpoints will be sent via backend API.
        </Alert>
      )}
    </Box>
  );
};

export default DeviceConnection;