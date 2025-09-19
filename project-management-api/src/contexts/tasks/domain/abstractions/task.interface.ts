export interface ITask {
  id: string;
  projectId: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  assigneeEmployeeId: string;
  supervisorId: string;
}
