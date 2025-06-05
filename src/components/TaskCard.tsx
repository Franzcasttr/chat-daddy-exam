import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { format, isPast, isToday, differenceInDays, parseISO } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import type { Task, Subtask } from '../types';
import { TASK_MENU_ACTIONS } from '../constant';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const getTaskUrgency = (dueDate?: string): 'overdue' | 'urgent' | 'normal' => {
  if (!dueDate) return 'normal';
  const due = parseISO(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isPast(due) && !isToday(due)) return 'overdue';
  const daysDiff = differenceInDays(due, today);
  if (daysDiff <= 2 && daysDiff >= 0) return 'urgent';
  return 'normal';
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleSubtask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: string) => {
    handleMenuClose();
    if (action === TASK_MENU_ACTIONS.EDIT && onEdit) {
      onEdit(task);
    } else if (action === TASK_MENU_ACTIONS.DELETE && onDelete) {
      onDelete(task.id);
    }
  };

  const urgency = getTaskUrgency(task.dueDate);
  const completedSubtasks =
    task.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,

    borderRadius: '12px',
    boxShadow: isDragging
      ? '0 8px 25px rgba(0,0,0,0.15)'
      : '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    mb: 0,

    ...(isDragging && {
      opacity: 0.7,
      transform: `${CSS.Transform.toString(transform)} rotate(3deg)`,
      zIndex: 1000,
    }),
    '&:active': {
      cursor: 'grabbing',
      transform: 'rotate(1deg) scale(1.03)',
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    },

    ...(urgency === 'overdue' && {
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      borderLeft: '4px solid #ef4444',
    }),
    ...(urgency === 'urgent' && {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderLeft: '4px solid #f59e0b',
    }),
  };

  return (
    <Card
      ref={setNodeRef}
      style={transform ? cardStyle : { ...cardStyle, transform: undefined }}
      {...attributes}
      sx={cardStyle}>
      <CardContent sx={{ p: '16px', '&:last-child': { pb: '16px' } }}>
        {(onEdit || onDelete) && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              size='small'
              onClick={handleMenuClick}
              sx={{
                color: '#94a3b8',
                p: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#f1f5f9',
                  color: '#667eea',
                },
              }}>
              <MoreVertIcon fontSize='small' />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.15))',
                  mt: 0.5,
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  minWidth: 120,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid #e2e8f0',
                    borderLeft: '1px solid #e2e8f0',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
              {onEdit && (
                <MenuItem
                  onClick={() => handleMenuItemClick(TASK_MENU_ACTIONS.EDIT)}
                  sx={{ fontSize: '0.9rem', gap: 1 }}>
                  <EditIcon fontSize='small' /> Edit
                </MenuItem>
              )}
              {onDelete && (
                <MenuItem
                  onClick={() => handleMenuItemClick(TASK_MENU_ACTIONS.DELETE)}
                  sx={{ fontSize: '0.9rem', gap: 1, color: 'error.main' }}>
                  <DeleteIcon fontSize='small' /> Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        )}
        <Box {...listeners} sx={{ cursor: 'grab' }}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='flex-start'
            mb={1}>
            <Typography
              variant='h6'
              component='div'
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1rem',
                lineHeight: 1.4,
                flexGrow: 1,
                mr: 1,
                wordBreak: 'break-word',
                cursor: 'inherit',
              }}>
              {task.title}
            </Typography>
          </Box>

          {task.description && (
            <Typography
              variant='body2'
              sx={{
                color: '#64748b',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                mb: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
              {task.description}
            </Typography>
          )}
          {task.dueDate && (
            <Box
              display='flex'
              alignItems='center'
              gap={0.75 /* 6px */}
              sx={{
                fontSize: '0.8rem',
                color:
                  urgency === 'overdue'
                    ? '#ef4444'
                    : urgency === 'urgent'
                    ? '#f59e0b'
                    : '#64748b',
                fontWeight:
                  urgency === 'overdue' || urgency === 'urgent'
                    ? 500
                    : 'normal',
                mb: 1.5,
              }}>
              <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
              {format(parseISO(task.dueDate), 'MMM dd, yyyy')}
              {urgency === 'overdue' && (
                <Typography
                  component='span'
                  sx={{ fontWeight: 'bold', ml: 0.5 }}>
                  • Overdue
                </Typography>
              )}
              {urgency === 'urgent' && (
                <Typography
                  component='span'
                  sx={{ fontWeight: 'bold', ml: 0.5 }}>
                  • Due Soon
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {totalSubtasks > 0 && (
          <Box mt={1.5}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              mb={1}>
              <Typography
                variant='caption'
                sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                {completedSubtasks}/{totalSubtasks} subtasks
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={progressPercentage}
              sx={{
                height: '6px',
                borderRadius: '3px',
                bgcolor: '#e2e8f0',
                mb: 1,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '3px',
                },
              }}
            />
            {/* .subtask-list */}
            <List dense disablePadding>
              {task.subtasks?.slice(0, 3).map((subtask: Subtask) => (
                <ListItem
                  key={subtask.id}
                  disableGutters
                  disablePadding
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontSize: '0.85rem',
                    color: '#64748b',
                    opacity: subtask.completed ? 0.6 : 1,
                  }}>
                  <ListItemIcon
                    sx={{ minWidth: 'auto', cursor: 'pointer' }}
                    onClick={() =>
                      onToggleSubtask && onToggleSubtask(task.id, subtask.id)
                    }>
                    {subtask.completed ? (
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: '1rem', color: '#667eea' }}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        sx={{ fontSize: '1rem', color: '#d1d5db' }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={subtask.text}
                    primaryTypographyProps={{
                      sx: {
                        textDecoration: subtask.completed
                          ? 'line-through'
                          : 'none',
                        fontSize: '0.85rem',
                      },
                    }}
                  />
                </ListItem>
              ))}
              {totalSubtasks > 3 && (
                <Typography
                  variant='caption'
                  sx={{ fontSize: '0.85rem', color: '#64748b', ml: 4.5 }}>
                  ... and {totalSubtasks - 3} more
                </Typography>
              )}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
