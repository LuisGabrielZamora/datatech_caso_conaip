// Constants for this resource
export const TaskResources = {
  ENTITY_RELATIONS: ['project', 'assignee', 'supervisor'],
  UNIQUE_CONSTANTS: {
    uniqueField: 'description',
    isActive: false,
  },
  FILTER_OR_FIELDS: ['description', 'startDate', 'endDate', 'projectId', 'assigneeEmployeeId', 'supervisorId'],
};