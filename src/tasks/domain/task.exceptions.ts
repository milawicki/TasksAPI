export class TaskAlreadyCompletedException extends Error {
  constructor() {
    super('Task already completed');
    this.name = 'TaskAlreadyCompletedException';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
