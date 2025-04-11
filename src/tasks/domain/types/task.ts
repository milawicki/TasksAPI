export const TaskStatusValues = ['new', 'completed'] as const;
export type TaskStatus = (typeof TaskStatusValues)[number];
