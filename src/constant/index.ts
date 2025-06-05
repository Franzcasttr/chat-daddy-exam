import { v4 as uuidv4 } from 'uuid';
import type { BoardData, ColumnId, Task } from '../types';

export const COLUMN_IDS: ColumnId[] = [
  'notStarted',
  'inProgress',
  'blocked',
  'done',
];

export const INITIAL_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: 'Grocery Shopping',
    description: 'Buy milk, eggs, bread, and cheese.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'notStarted',
    subtasks: [
      { id: uuidv4(), text: 'Buy Milk', completed: false },
      { id: uuidv4(), text: 'Buy Eggs', completed: true },
    ],
  },
  {
    id: uuidv4(),
    title: 'Book Doctor Appointment',
    description: 'Annual check-up.',
    columnId: 'notStarted',
  },
  {
    id: uuidv4(),
    title: 'Develop Kanban Feature',
    description: 'Implement drag and drop functionality.',
    dueDate: new Date().toISOString(),
    columnId: 'inProgress',
  },
  {
    id: uuidv4(),
    title: 'Taxes',
    description: 'File annual tax returns.',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    columnId: 'blocked',
    subtasks: [
      { id: uuidv4(), text: 'Collect W2 forms', completed: true },
      { id: uuidv4(), text: 'Find accountant', completed: false },
      { id: uuidv4(), text: 'Submit forms', completed: false },
    ],
  },
  {
    id: uuidv4(),
    title: 'Deploy Project v1.0',
    description: 'Push to production server.',
    columnId: 'done',
  },
];

export const INITIAL_COLUMNS: BoardData = {
  notStarted: {
    id: 'notStarted',
    title: 'Not Started',
    tasks: INITIAL_TASKS.filter((task) => task.columnId === 'notStarted'),
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: INITIAL_TASKS.filter((task) => task.columnId === 'inProgress'),
  },
  blocked: {
    id: 'blocked',
    title: 'Blocked',
    tasks: INITIAL_TASKS.filter((task) => task.columnId === 'blocked'),
  },
  done: {
    id: 'done',
    title: 'Done',
    tasks: INITIAL_TASKS.filter((task) => task.columnId === 'done'),
  },
};

export const columnColors: Record<ColumnId, string> = {
  notStarted: '#64748b',
  inProgress: '#3b82f6',
  blocked: '#ef4444',
  done: '#10b981',
};

export const TASK_MENU_ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
};
