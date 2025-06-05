import React from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import AddIcon from '@mui/icons-material/Add';
import NotesIcon from '@mui/icons-material/Notes';

import TaskCard from './TaskCard';

import type { ColumnType, Task } from '../types';
import { columnColors } from '../constant';

interface ColumnProps {
  column: ColumnType;
  onAddTask?: (columnId: ColumnType['id']) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 300,
        maxWidth: 360,
        display: 'flex',
        flexDirection: 'column',

        bgcolor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        p: 2.5,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        minHeight: 'calc(100vh - 180px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },

        ...(isOver && {
          bgcolor: 'rgba(255,255,255,0.95)',
          borderColor: 'primary.main',
          borderStyle: 'dashed',
          borderWidth: '2px',
        }),
        height: 'calc(90vh - 120px)',
      }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={'20px'}
        pb={'16px'}
        borderBottom='2px solid rgb(247, 247, 247)'>
        <Box display='flex' alignItems='center' gap={1.5}>
          <Box
            className='column-indicator'
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: columnColors[column.id] || 'grey.500',
              animation: 'pulse 2s infinite',
            }}
          />
          <Typography
            variant='h5'
            component='h2'
            sx={{
              fontWeight: 600,
              color: '#1e293b',
            }}>
            {column.title}
          </Typography>
          <Chip
            label={column.tasks.length}
            size='small'
            sx={{
              background: '#e2e8f0',
              color: '#64748b',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 500,
              minWidth: '24px',
              textAlign: 'center',
              height: 'auto',
              '.MuiChip-label': {
                padding: 0,
              },
            }}
          />
        </Box>
        {onAddTask && (
          <IconButton
            onClick={() => onAddTask(column.id)}
            size='small'
            title='Add Task'
            sx={{
              color: '#64748b',
              padding: '8px',
              fontSize: '1.2rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgb(228, 238, 252)',
                color: '#667eea',
                transform: 'scale(1.1)',
              },
            }}>
            <AddIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          pr: column.tasks.length > 3 ? 0.5 : 0,
          mr: column.tasks.length > 3 ? -0.5 : 0,
        }}>
        <SortableContext
          items={column.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}>
          {column.tasks.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
              }}>
              <NotesIcon
                sx={{
                  fontSize: '3rem',
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                No tasks yet.
                <br />
                Click + to add your first task!
              </Typography>
            </Box>
          ) : (
            column.tasks.map((task, index) => (
              <Box
                key={task.id}
                className='task-slide-in'
                sx={{ animationDelay: `${index * 0.05}s` }}>
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleSubtask={onToggleSubtask}
                />
              </Box>
            ))
          )}
        </SortableContext>
      </Box>
    </Box>
  );
};

export default Column;
