import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import type { User } from '../../types';
import { useCreateTaskMutation } from '../../app/api';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  users: User[];
}

export default function TaskFormDialog({ open, onClose, users }: TaskFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [createTask, { isLoading, error }] = useCreateTaskMutation();

  const resetAndClose = () => {
    setTitle('');
    setDescription('');
    setAssigneeId('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      assigneeId: assigneeId || undefined,
    }).unwrap();
    resetAndClose();
  };

  return (
    <Dialog open={open} onClose={resetAndClose} fullWidth maxWidth="sm">
      <DialogTitle>New task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">Could not create the task. Please try again.</Alert>}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />
          <TextField
            select
            label="Assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Unassigned</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetAndClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!title.trim() || isLoading}>
          Create task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
