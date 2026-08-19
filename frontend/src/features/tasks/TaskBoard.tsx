import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { TASK_STATUSES } from '../../types';
import { useAppSelector } from '../../app/hooks';
import { useGetTasksQuery } from '../../app/api';
import TaskColumn from './TaskColumn';

export default function TaskBoard() {
  const { status, assigneeId } = useAppSelector((state) => state.filters);

  const { data: tasks, isLoading, error } = useGetTasksQuery({
    status: status === 'all' ? undefined : status,
    assigneeId: assigneeId === 'all' ? undefined : assigneeId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Couldn't load tasks. Is the backend running at the configured API URL?
      </Alert>
    );
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
      {TASK_STATUSES.map((s) => (
        <TaskColumn key={s} status={s} tasks={(tasks ?? []).filter((t) => t.status === s)} />
      ))}
    </Stack>
  );
}
