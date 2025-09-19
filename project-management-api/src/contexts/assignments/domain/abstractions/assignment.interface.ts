export interface IAssignment {
  id: string;
  projectId: string;
  employeeId: string;
  assignmentDate: string | Date;
  supervisorId: string;
  taskId: string;
}
