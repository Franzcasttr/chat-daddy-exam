import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type DropAnimation,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Typography, ThemeProvider, GlobalStyles, Box } from '@mui/material';
import KanbanBoard from './components/KanbanBoard';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import type { BoardData, ColumnId, ColumnType, Subtask, Task } from './types';
import { COLUMN_IDS, INITIAL_COLUMNS } from './constant';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import { theme } from './theme';

const KANBAN_STORAGE_KEY = 'kanbanBoardData';

const App: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(() => {
    const savedData = localStorage.getItem(KANBAN_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as BoardData;
        let isValid = true;
        COLUMN_IDS.forEach((id) => {
          if (!parsedData[id] || !parsedData[id].tasks) isValid = false;
        });
        return isValid ? parsedData : INITIAL_COLUMNS;
      } catch (error) {
        console.error('Failed to parse saved KANBAN data:', error);
        return INITIAL_COLUMNS;
      }
    }
    return INITIAL_COLUMNS;
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [defaultColumnForNewTask, setDefaultColumnForNewTask] =
    useState<ColumnId>('notStarted');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem(KANBAN_STORAGE_KEY, JSON.stringify(boardData));
  }, [boardData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnContainingTask = (taskId: string): ColumnType | undefined => {
    return Object.values(boardData).find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const column = findColumnContainingTask(active.id as string);
    if (column) {
      const task = column.tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnContainingTask(activeId);

    const overColumn =
      boardData[overId as ColumnId] || findColumnContainingTask(overId);

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      setBoardData((prev) => {
        const newBoardData = { ...prev };
        const taskToMove = activeColumn.tasks.find((t) => t.id === activeId);
        if (!taskToMove) return prev;

        newBoardData[activeColumn.id] = {
          ...newBoardData[activeColumn.id],
          tasks: newBoardData[activeColumn.id].tasks.filter(
            (t) => t.id !== activeId
          ),
        };

        const overTaskIndex = overColumn.tasks.findIndex(
          (t) => t.id === overId
        );
        const newTasksInOverColumn = [...overColumn.tasks];
        if (overTaskIndex !== -1) {
          newTasksInOverColumn.splice(overTaskIndex, 0, {
            ...taskToMove,
            columnId: overColumn.id,
          });
        } else {
          newTasksInOverColumn.push({ ...taskToMove, columnId: overColumn.id });
        }

        newBoardData[overColumn.id] = {
          ...newBoardData[overColumn.id],
          tasks: newTasksInOverColumn,
        };
        return newBoardData;
      });
    } else {
      if (activeId !== overId) {
        setBoardData((prev) => {
          const column = prev[activeColumn.id];
          const oldIndex = column.tasks.findIndex((t) => t.id === activeId);

          let newIndex = column.tasks.findIndex((t) => t.id === overId);

          if (newIndex === -1 && overId === column.id) {
            newIndex = column.tasks.length - 1;
          } else if (newIndex === -1) {
            return prev;
          }

          const reorderedTasks = arrayMove(column.tasks, oldIndex, newIndex);
          return {
            ...prev,
            [activeColumn.id]: {
              ...column,
              tasks: reorderedTasks,
            },
          };
        });
      }
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const handleOpenTaskForm = (columnId?: ColumnId, task?: Task) => {
    setTaskToEdit(task || null);
    if (columnId && !task) setDefaultColumnForNewTask(columnId);
    else if (task) setDefaultColumnForNewTask(task.columnId);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = (task: Task) => {
    setBoardData((prev) => {
      const newBoardData = JSON.parse(JSON.stringify(prev));
      const targetColumnId = task.columnId;

      COLUMN_IDS.forEach((colId) => {
        newBoardData[colId].tasks = newBoardData[colId].tasks.filter(
          (t: Task) => t.id !== task.id
        );
      });

      const taskExistsInTargetColumn = newBoardData[targetColumnId].tasks.some(
        (t: Task) => t.id === task.id
      );
      if (taskExistsInTargetColumn) {
        newBoardData[targetColumnId].tasks = newBoardData[
          targetColumnId
        ].tasks.map((t: Task) => (t.id === task.id ? task : t));
      } else {
        newBoardData[targetColumnId].tasks.push(task);
      }
      return newBoardData;
    });
    setIsTaskFormOpen(false);
  };

  const requestDeleteTask = (taskId: string) => {
    const column = findColumnContainingTask(taskId);
    if (column) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) {
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    setBoardData((prev) => {
      const newBoardData = { ...prev };
      for (const columnId in newBoardData) {
        newBoardData[columnId as ColumnId] = {
          ...newBoardData[columnId as ColumnId],
          tasks: newBoardData[columnId as ColumnId].tasks.filter(
            (t) => t.id !== taskToDelete.id
          ),
        };
      }
      return newBoardData;
    });
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setBoardData((prev) => {
      const newBoardData = JSON.parse(JSON.stringify(prev));
      for (const columnId of COLUMN_IDS) {
        const taskIndex = newBoardData[columnId].tasks.findIndex(
          (t: Task) => t.id === taskId
        );
        if (taskIndex !== -1) {
          const subtaskIndex = newBoardData[columnId].tasks[
            taskIndex
          ].subtasks?.findIndex((st: Subtask) => st.id === subtaskId);
          if (
            newBoardData[columnId].tasks[taskIndex].subtasks &&
            subtaskIndex !== -1 &&
            subtaskIndex !== undefined
          ) {
            newBoardData[columnId].tasks[taskIndex].subtasks[
              subtaskIndex
            ].completed =
              !newBoardData[columnId].tasks[taskIndex].subtasks[subtaskIndex]
                .completed;
          }
          break;
        }
      }
      return newBoardData;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          body: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            margin: 0,
            padding: 0,
          },
          height: '100vh',
        }}
      />

      <Box sx={{ textAlign: 'center', paddingY: '1rem' }}>
        <Typography
          variant='h4'
          fontWeight={700}
          sx={{
            color: 'white',
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 1.25,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
          Personal
        </Typography>
        <Typography
          component='div'
          sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
          A board to keep track of your personal task.
        </Typography>
      </Box>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <KanbanBoard
          boardData={boardData}
          onAddTask={(columnId) => handleOpenTaskForm(columnId)}
          onEditTask={(task) => handleOpenTaskForm(undefined, task)}
          onDeleteTask={requestDeleteTask}
          onToggleSubtask={handleToggleSubtask}
        />
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskForm
        open={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        defaultColumnId={defaultColumnForNewTask}
      />
      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={taskToDelete?.title}
      />
    </ThemeProvider>
  );
};

export default App;
