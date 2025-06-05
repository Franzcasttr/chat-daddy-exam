export type ColumnId = 'notStarted' | 'inProgress' | 'blocked' | 'done';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  subtasks?: Subtask[];
  columnId: ColumnId;
}

export interface ColumnType {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export type BoardData = Record<ColumnId, ColumnType>;
