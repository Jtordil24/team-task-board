import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import type { Task, TaskStatus } from '../../types';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '../../types';
import { useDeleteTaskMutation, useUpdateTaskStatusMutation } from '../../app/api';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [updateStatus] = useUpdateTaskStatusMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleStatusChange = (event: SelectChangeEvent) => {
    updateStatus({ id: task.id, status: event.target.value as TaskStatus });
  };

  return (
    <Card variant="outlined" sx={{ opacity: isDeleting ? 0.5 : 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
          <Typography variant="subtitle2" sx={{ wordBreak: 'break-word' }}>
            {task.title}
          </Typography>
          <IconButton
            size="small"
            aria-label={`Delete "${task.title}"`}
            onClick={() => deleteTask(task.id)}
            disabled={isDeleting}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
            {task.description}
          </Typography>
        )}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
          {task.assignee ? (
            <Chip
              size="small"
              icon={<PersonOutlineIcon />}
              label={task.assignee.name}
              variant="outlined"
            />
          ) : (
            <Chip size="small" label="Unassigned" variant="outlined" sx={{ opacity: 0.6 }} />
          )}

          <Select
            size="small"
            value={task.status}
            onChange={handleStatusChange}
            aria-label={`Change status of "${task.title}"`}
            sx={{ minWidth: 128, fontSize: 13 }}
          >
            {TASK_STATUSES.map((status) => (
              <MenuItem key={status} value={status} sx={{ fontSize: 13 }}>
                {TASK_STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </CardContent>
    </Card>
  );
}
