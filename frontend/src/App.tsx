import { useState } from 'react';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useGetUsersQuery } from './app/api';
import TaskBoard from './features/tasks/TaskBoard';
import FilterBar from './features/tasks/FilterBar';
import TaskFormDialog from './features/tasks/TaskFormDialog';

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: users = [] } = useGetUsersQuery();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h5">Team Task Board</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <FilterBar users={users} onAddTask={() => setDialogOpen(true)} />
        <TaskBoard />
      </Container>

      <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} users={users} />
    </Box>
  );
}
