/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Slide,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import type { TransitionProps } from '@mui/material/transitions';

import { v4 as uuidv4 } from 'uuid';
import type { ColumnId, Subtask, Task } from '../types';

const ModalTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} timeout={300} />;
});

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
  defaultColumnId?: ColumnId;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSave,
  taskToEdit,
  defaultColumnId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (open) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || '');
        setDueDate(
          taskToEdit.dueDate ? taskToEdit.dueDate.substring(0, 10) : ''
        );
        setSubtasks(taskToEdit.subtasks || []);
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
        setSubtasks([]);
      }
      setNewSubtaskText('');
    }
  }, [taskToEdit, open]);

  const handleAddSubtask = () => {
    if (newSubtaskText.trim()) {
      setSubtasks([
        ...subtasks,
        { id: uuidv4(), text: newSubtaskText.trim(), completed: false },
      ]);
      setNewSubtaskText('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const taskData: Task = {
      id: taskToEdit ? taskToEdit.id : uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      subtasks: subtasks.length > 0 ? subtasks : [],
      columnId: taskToEdit
        ? taskToEdit.columnId
        : defaultColumnId || 'notStarted',
    };
    onSave(taskData);
  };

  const formInputStyles = {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      '& fieldset': {
        borderColor: '#e5e7eb',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#d1d5db',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      },
    },
    '& .MuiInputBase-input': {
      padding: '12px 16px',
      fontSize: '1rem',
    },
  };

  const formLabelStyles = {
    fontWeight: 500,
    color: '#374151',
    mb: 0.75,
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={ModalTransition}
      PaperProps={{
        sx: {
          background: 'white',
          borderRadius: '16px',
          padding: '0px',
          width: '90%',
          maxWidth: '500px',

          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          },
        },
      }}>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: 0,
          p: 3,
          paddingBottom: 2,
          borderBottom: '2px solid #f1f5f9',
        }}>
        <Typography
          sx={{
            fontSize: '1.4rem',
            fontWeight: 600,
            color: '#1e293b',
          }}>
          {taskToEdit ? 'Edit Task' : 'New Task'}
        </Typography>
        {/* .close-btn */}
        <IconButton
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            p: '4px',
            '&:hover': { background: '#f1f5f9', color: '#667eea' },
          }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          maxHeight: '60vh',
        }}>
        <Box mb={2.5}>
          <Typography
            sx={formLabelStyles}
            component='label'
            htmlFor='taskTitleModal'>
            Task Title *
          </Typography>
          <TextField
            autoFocus
            id='taskTitleModal'
            type='text'
            fullWidth
            variant='outlined'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={formInputStyles}
            size='small'
          />
        </Box>

        <Box mb={2.5}>
          <Typography
            sx={formLabelStyles}
            component='label'
            htmlFor='taskDescriptionModal'>
            Description
          </Typography>
          <TextField
            id='taskDescriptionModal'
            type='text'
            fullWidth
            multiline
            rows={3}
            variant='outlined'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              ...formInputStyles,
              '& .MuiInputBase-input': {
                ...formInputStyles['& .MuiInputBase-input'],
                resize: 'vertical',
              },
            }}
            size='small'
          />
        </Box>

        <Box mb={2.5}>
          <Typography
            sx={formLabelStyles}
            component='label'
            htmlFor='taskDueDateModal'>
            Due Date
          </Typography>
          <TextField
            id='taskDueDateModal'
            type='date'
            fullWidth
            variant='outlined'
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={formInputStyles}
            size='small'
          />
        </Box>

        <Box mt={3}>
          <Typography sx={formLabelStyles}>Subtasks</Typography>
          <Box display='flex' gap={1} mb={1.5}>
            <TextField
              placeholder='Add a subtask...'
              variant='outlined'
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              sx={{
                ...formInputStyles,
                flex: 1,
                '& .MuiInputBase-input': {
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                },
              }}
              size='small'
            />
            <Button
              onClick={handleAddSubtask}
              variant='contained'
              sx={{
                background: '#667eea',
                color: 'white',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                textTransform: 'none',
                '&:hover': {
                  background: '#5856eb',
                  transform: 'translateY(-1px)',
                },
              }}>
              Add
            </Button>
          </Box>
          <List dense disablePadding>
            {subtasks.map((st) => (
              <ListItem
                key={st.id}
                disableGutters
                sx={{
                  p: '8px 0',
                  borderBottom: '1px solid #f1f5f9',
                  '&:last-child': { borderBottom: 'none' },
                }}
                secondaryAction={
                  <IconButton
                    onClick={() => handleDeleteSubtask(st.id)}
                    sx={{
                      color: '#ef4444',
                      p: '4px',
                      '&:hover': { background: '#fef2f2' },
                    }}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                }>
                <Checkbox
                  edge='start'
                  checked={st.completed}
                  onChange={() => handleToggleSubtask(st.id)}
                  size='small'
                />
                <ListItemText
                  primary={st.text}
                  sx={{
                    fontSize: '0.9rem',
                    textDecoration: st.completed ? 'line-through' : 'none',
                    opacity: st.completed ? 0.7 : 1,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          paddingTop: 2.5,
          borderTop: '2px solid #f1f5f9',
          gap: 1.5,
        }}>
        <Button
          onClick={onClose}
          sx={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: '#f8fafc',
            color: '#64748b',
            textTransform: 'none',
            '&:hover': { background: '#e2e8f0' },
          }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          sx={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '0.95rem',
            background: '#667eea',
            color: 'white',
            textTransform: 'none',
            '&:hover': { background: '#5856eb', transform: 'translateY(-1px)' },
            '&:disabled': {
              opacity: 0.5,
              background: '#a5b4fc',
              cursor: 'not-allowed',
            },
          }}
          disabled={!title.trim()}>
          {taskToEdit ? 'Save Task' : 'Save Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
