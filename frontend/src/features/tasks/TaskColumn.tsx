import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Task, TaskStatus } from '../../types';
import { TASK_STATUS_LABELS } from '../../types';
import { STATUS_ACCENT } from '../../theme';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export default function TaskColumn({ status, tasks }: TaskColumnProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        minWidth: 280,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        borderTop: `3px solid ${STATUS_ACCENT[status]}`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5 }}>
        <Typography variant="subtitle2">{TASK_STATUS_LABELS[status]}</Typography>
        <Typography variant="caption" color="text.secondary">
          {tasks.length}
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No tasks here.
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
