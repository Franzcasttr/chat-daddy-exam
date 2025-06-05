import React from 'react';
import { Box } from '@mui/material';
import Column from './Column';

import { COLUMN_IDS } from '../constant';
import type { BoardData, ColumnId, Task } from '../types';

interface KanbanBoardProps {
  boardData: BoardData;
  onAddTask?: (columnId: ColumnId) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  boardData,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        overflowX: 'auto',
        minHeight: 'calc(100vh - 64px)',
      }}>
      {COLUMN_IDS.map((columnId) => {
        const column = boardData[columnId];
        if (!column) return null;
        return (
          <Column
            key={column.id}
            column={column}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleSubtask={onToggleSubtask}
          />
        );
      })}
    </Box>
  );
};

export default KanbanBoard;
