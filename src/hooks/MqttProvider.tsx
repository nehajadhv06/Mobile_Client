import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import mqtt, { MqttClient } from 'mqtt';
import axios from 'axios';

interface MqttContextType {
  deviceId: string | null;
  parameters: Record<string, string>;
  setDeviceId: (id: string) => void;
  sendMessage: (message: string) => void;
  sendCommand: (command: string) => void;
  submitSetpoints: (setpoints: Record<string, string>) => void;
  isConnected: boolean;
  connectionStatus: string;
  connectionMode: 'mqtt' | 'http';
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider');
  }
  return context;
};

interface MqttProviderProps {
  children: ReactNode;
}

export const MqttProvider: React.FC<MqttProviderProps> = ({ children }) => {
  const [deviceId, setDeviceIdState] = useState<string | null>(null);
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [connectionMode, setConnectionMode] = useState<'mqtt' | 'http'>('http');
  const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);

  const setDeviceId = (id: string) => {
    setDeviceIdState(id);
    localStorage.setItem('deviceId', id);
    
    if (connectionMode === 'mqtt' && mqttClient && isConnected) {
      // Unsubscribe from previous device
      if (deviceId) {
        mqttClient.unsubscribe(`proton/MPU/${deviceId}/fd`);
      }
      
      // Subscribe to new device
      mqttClient.subscribe(`proton/MPU/${id}/fd`, (err) => {
        if (err) {
          console.error('Failed to subscribe to topic:', err);
          setConnectionStatus('Subscription failed');
        } else {
          console.log(`Subscribed to proton/MPU/${id}/fd`);
          setConnectionStatus(`Connected to ${id}`);
        }
      });
    } else {
      setConnectionStatus('Device ID set - Using HTTP API mode');
    }
  };

  // Send message via MQTT or HTTP API fallback
  const sendMessage = async (message: string) => {
    if (!deviceId) {
      console.error('Device ID not set');
      return;
    }

    if (connectionMode === 'mqtt' && mqttClient && isConnected) {
      // Send via MQTT
      mqttClient.publish(`proton/MPU/${deviceId}/td`, message);
      console.log(`MQTT Sent to ${deviceId}: ${message}`);
    } else {
      // Fallback to HTTP API
      try {
        const response = await axios.post(`http://localhost:8080/api/send/${deviceId}`, message, {
          headers: {
            'Content-Type': 'text/plain'
          }
        });
        console.log(`HTTP Sent to ${deviceId}: ${message}`, response.data);
      } catch (error) {
        console.error('Failed to send message via HTTP:', error);
      }
    }
  };

  const sendCommand = (command: string) => {
    sendMessage(`{${command}}`);
  };

  const submitSetpoints = (setpoints: Record<string, string>) => {
    if (deviceId) {
      // Format setpoints as a string
      const setpointsStr = Object.entries(setpoints)
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
      
    sendMessage(`{${deviceId},${setpointsStr}}`);
    }
  };

  useEffect(() => {
    // Try to connect via MQTT first
    setConnectionStatus('Connecting to MQTT broker...');
    
    const options = {
      clientId: `webclient_${Math.random().toString(16).substr(2, 8)}`,
      username: 'abhijitpawar5',
      password: 'abhijit123',
      reconnectPeriod: 5000,
      connectTimeout: 10000, // 10 second timeout
    };

    try {
      const client = mqtt.connect('ws://13.232.29.255:9001', options);

      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        setMqttClient(client);
        setIsConnected(true);
        setConnectionStatus('Connected to MQTT broker');
        setConnectionMode('mqtt');
        
        // If we have a device ID from localStorage, subscribe to it
        const savedDeviceId = localStorage.getItem('deviceId');
        if (savedDeviceId) {
          setDeviceId(savedDeviceId);
        }
      });

      client.on('message', (topic, message) => {
        const messageStr = message.toString();
        console.log(`Received message on ${topic}: ${messageStr}`);
        
        try {
          const params: Record<string, string> = {};
          const cleanMessage = messageStr.replace(/[{}]/g, '');
          const pairs = cleanMessage.split(',');
          
          pairs.forEach(pair => {
            const [key, value] = pair.split(':');
            if (key && value) {
              params[key.trim()] = value.trim();
            }
          });
          
          setParameters(prev => ({ ...prev, ...params }));
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      });

      client.on('error', (err) => {
        console.error('MQTT error:', err);
        setIsConnected(false);
        setConnectionStatus(`MQTT Error: ${err.message}`);
      });

      client.on('close', () => {
        console.log('MQTT connection closed');
        setIsConnected(false);
        setConnectionStatus('Disconnected from MQTT broker');
      });

      client.on('offline', () => {
        console.log('MQTT offline');
        setIsConnected(false);
        setConnectionStatus('MQTT offline');
      });

      // Set timeout to switch to HTTP mode if MQTT doesn't connect
      const connectionTimeout = setTimeout(() => {
        if (!isConnected) {
          console.log('MQTT connection timeout, switching to HTTP mode');
          setConnectionStatus('Using HTTP API mode (MQTT unavailable)');
          setConnectionMode('http');
          client.end();
          
          // Load device ID if available
          const savedDeviceId = localStorage.getItem('deviceId');
          if (savedDeviceId) {
            setDeviceIdState(savedDeviceId);
          }
        }
      }, 15000); // 15 second timeout

      return () => {
        clearTimeout(connectionTimeout);
        if (mqttClient) {
    if (deviceId) {
      mqttClient.unsubscribe(`proton/MPU/${deviceId}/fd`);
    }
    mqttClient.end();
  }
      };
    } catch (error) {
      console.error('Failed to initialize MQTT client:', error);
      setConnectionStatus('Using HTTP API mode (MQTT failed)');
      setConnectionMode('http');
    }
  }, []);

  return (
    <MqttContext.Provider value={{
      deviceId,
      parameters,
      setDeviceId,
      sendMessage,
      sendCommand,
      submitSetpoints,
      isConnected,
      connectionStatus,
      connectionMode
    }}>
      {children}
    </MqttContext.Provider>
  );
};