import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import type { User } from '../../types';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { assigneeFilterChanged, statusFilterChanged } from './filtersSlice';

interface FilterBarProps {
  users: User[];
  onAddTask: () => void;
}

export default function FilterBar({ users, onAddTask }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const { status, assigneeId } = useAppSelector((state) => state.filters);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3 }}>
      <TextField
        select
        size="small"
        label="Status"
        value={status}
        onChange={(e) => dispatch(statusFilterChanged(e.target.value as typeof status))}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="all">All statuses</MenuItem>
        {TASK_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {TASK_STATUS_LABELS[s]}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Assignee"
        value={assigneeId}
        onChange={(e) => dispatch(assigneeFilterChanged(e.target.value))}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="all">Everyone</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddTask} sx={{ ml: { sm: 'auto' } }}>
        Add task
      </Button>
    </Stack>
  );
}
