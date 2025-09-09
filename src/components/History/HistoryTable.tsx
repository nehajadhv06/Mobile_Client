import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import axios from 'axios';

interface HistoryEntry {
  id: number;
  deviceId: string;
  event: string;
  details: string;
  timestamp: string;
}

// Define the expected response shape from the API
interface PaginatedResponse {
  content: HistoryEntry[];
  // Add other pagination fields if needed (e.g., totalPages, totalElements)
}

const HistoryTable = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Original: const response = await axios.get(`http://localhost:8080/api/history?page=${page}&size=5`);
        // Modified to specify response type
        const response = await axios.get<PaginatedResponse>(
          `http://localhost:8080/api/history?page=${page}&size=5`
        );
        // Original: setHistory(response.data.content);
        // Modified: Explicitly access content, which is typed as HistoryEntry[]
        setHistory(response.data.content);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    fetchHistory();
  }, [page]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
          Operation History
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Device ID</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.deviceId}</TableCell>
                <TableCell>{entry.event}</TableCell>
                <TableCell>{entry.details}</TableCell>
                <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={() => setPage((prev) => prev + 1)} disabled={history.length < 5}>
          Next
        </Button>
        <Button onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>
          Previous
        </Button>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;
