# 🗄️ Database Schema Documentation

**Project Management API - Database Structure & Relationships**

*Developed by **Luis Gabriel Zamora Acevedo**, Bachelor's degree candidate in Computational Engineering at CONAIP*

## 📋 Overview

This document provides a comprehensive overview of the database schema for the Project Management API. The database is built using PostgreSQL 17 with TypeORM as the Object-Relational Mapping (ORM) tool, following Clean Architecture principles.

### 🔗 API Documentation

- **Production API:** [https://api.thorium-technologies.com](https://api.thorium-technologies.com)
- **Interactive Documentation:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)

## 🏗️ Database Architecture

The database follows a **relational model** designed to support enterprise-level project management operations with the following characteristics:

- **🔧 RDBMS:** PostgreSQL 17
- **🛡️ Security:** SSL/TLS encryption support
- **📊 ORM:** TypeORM with TypeScript
- **🔄 Migrations:** Automatic schema synchronization
- **🎯 Soft Deletes:** All entities support soft deletion
- **⏰ Auditing:** Comprehensive timestamp tracking
- **🔑 Primary Keys:** UUID-based identification

## 📊 Entity Overview

The database consists of **6 main entities** organized around project management workflows:

| Entity | Table Name | Purpose | Primary Relations |
|--------|------------|---------|-------------------|
| **User** | `users` | System authentication & authorization | None (independent) |
| **Client** | `clients` | External clients who request projects | → Projects |
| **Employee** | `employees` | Internal team members | → Tasks, Assignments |
| **Project** | `projects` | Main work units for clients | ← Client, → Tasks |
| **Task** | `tasks` | Individual work items within projects | ← Project, ← Employees |
| **Assignment** | `assignments` | Employee-project-task relationships | ← All entities |

---

## 📋 Table Schemas

### 🛠️ Base Entity (`CustomBaseEntity`)

All entities inherit from a base entity providing common functionality:

```sql
-- Common fields for all tables
id                UUID PRIMARY KEY DEFAULT gen_random_uuid()
createdAt         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updatedAt         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
deletedAt         TIMESTAMP WITH TIME ZONE NULL        -- Soft delete
recordStatus      BOOLEAN DEFAULT true                 -- Active/Inactive flag
```

**Features:**

- **UUID Primary Keys:** Globally unique identifiers
- **Audit Trail:** Creation and modification timestamps
- **Soft Deletion:** Logical deletion with `deletedAt`
- **Status Management:** `recordStatus` for active/inactive records

---

### 👤 Users Table

**Table Name:** `users`
**Purpose:** System authentication and user management
**Entity:** `User`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `name` | VARCHAR | NOT NULL | User's full name |
| `email` | VARCHAR | UNIQUE, NOT NULL | Login email (unique) |
| `password` | VARCHAR | NOT NULL | Hashed password (bcrypt) |
| `role` | VARCHAR | DEFAULT 'USER' | User role (USER/ADMIN) |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Account creation time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Account active status |

**Constraints:**

- **Unique Index:** `email` (prevents duplicate accounts)
- **Check Constraint:** `role IN ('USER', 'ADMIN')`

**Business Rules:**

- Email addresses must be unique across the system
- Passwords are hashed using bcrypt before storage
- Default role is 'USER' for new registrations
- Admin users have elevated permissions

```sql
-- Example User record
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john.doe@company.com', '$2b$10$...', 'ADMIN');
```

---

### 🏢 Clients Table

**Table Name:** `clients`
**Purpose:** External clients who request and own projects
**Entity:** `Client`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique client identifier |
| `name` | VARCHAR(150) | NOT NULL | Client's first name |
| `surname` | VARCHAR(150) | NOT NULL | Client's last name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Contact email |
| `phone` | VARCHAR(20) | NOT NULL | Phone number |
| `address` | TEXT | NULL | Mailing address (optional) |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Client registration time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Client active status |

**Constraints:**

- **Unique Index:** `email` (one account per email)
- **Length Limits:** Name fields limited to 150 chars
- **Phone Format:** 20 character limit for international numbers

**Business Rules:**

- Each client must have a unique email address
- Phone number is required for contact purposes
- Address is optional for digital-only clients
- Clients can have multiple projects

```sql
-- Example Client record
INSERT INTO clients (name, surname, email, phone, address) VALUES
('Jane', 'Smith', 'jane.smith@clientcorp.com', '+1-555-0123', '123 Business St, City, State');
```

---

### 👥 Employees Table

**Table Name:** `employees`
**Purpose:** Internal team members who work on projects and tasks
**Entity:** `Employee`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique employee identifier |
| `firstName` | VARCHAR(150) | NOT NULL | Employee's first name |
| `lastName` | VARCHAR(150) | NOT NULL | Employee's last name |
| `jobTitle` | VARCHAR(100) | NOT NULL | Current job position |
| `department` | VARCHAR(100) | NOT NULL | Department/team assignment |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Employee creation time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Employee active status |

**Constraints:**

- **Required Fields:** All personal and job information required
- **Length Limits:** Names and titles have reasonable limits

**Business Rules:**

- Employees can work on multiple projects simultaneously
- Each employee belongs to one department
- Employees can be both task assignees and supervisors
- Department field enables filtering and reporting

**Common Departments:**

- Engineering, Design, Marketing, Sales, HR, Finance, Operations

```sql
-- Example Employee record
INSERT INTO employees (firstName, lastName, jobTitle, department) VALUES
('Alice', 'Johnson', 'Senior Developer', 'Engineering');
```

---

### 🚀 Projects Table

**Table Name:** `projects`
**Purpose:** Main work units assigned to clients
**Entity:** `Project`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique project identifier |
| `name` | VARCHAR(255) | NOT NULL | Project name/title |
| `description` | TEXT | NULL | Detailed project description |
| `startDate` | DATE | NOT NULL | Project start date |
| `endDate` | DATE | NULL | Project completion date |
| `clientId` | UUID | NOT NULL, FK | Reference to client |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Project creation time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Project active status |

**Foreign Key Relationships:**

- `clientId` → `clients.id` (Many-to-One)

**Constraints:**

- **Foreign Key:** `clientId` references `clients(id)`
- **Business Logic:** `endDate` can be NULL for ongoing projects
- **Date Validation:** `endDate >= startDate` (when both present)

**Business Rules:**

- Every project must be assigned to a client
- Projects can have multiple tasks
- End date is optional for ongoing projects
- Project status tracked through `recordStatus`

```sql
-- Example Project record
INSERT INTO projects (name, description, startDate, clientId) VALUES
('E-commerce Website', 'Build a modern online store with payment integration', '2024-01-15', 'client-uuid-here');
```

---

### 📋 Tasks Table

**Table Name:** `tasks`
**Purpose:** Individual work items within projects
**Entity:** `Task`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique task identifier |
| `projectId` | UUID | NOT NULL, FK | Reference to parent project |
| `description` | TEXT | NOT NULL | Task description/requirements |
| `startDate` | DATE | NOT NULL | Task start date |
| `endDate` | DATE | NULL | Task completion date |
| `assigneeEmployeeId` | UUID | NOT NULL, FK | Assigned employee |
| `supervisorId` | UUID | NOT NULL, FK | Supervising employee |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Task creation time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Task active status |

**Foreign Key Relationships:**

- `projectId` → `projects.id` (Many-to-One)
- `assigneeEmployeeId` → `employees.id` (Many-to-One)
- `supervisorId` → `employees.id` (Many-to-One)

**Constraints:**

- **Foreign Keys:** All reference valid records
- **Business Logic:** Assignee and supervisor can be different employees
- **Date Validation:** `endDate >= startDate` (when both present)

**Business Rules:**

- Every task belongs to exactly one project
- Each task has one assignee and one supervisor
- Supervisor and assignee can be the same person
- Tasks can be ongoing (endDate = NULL)

```sql
-- Example Task record
INSERT INTO tasks (projectId, description, startDate, assigneeEmployeeId, supervisorId) VALUES
('project-uuid', 'Design user authentication flow', '2024-01-20', 'employee1-uuid', 'employee2-uuid');
```

---

### 📌 Assignments Table

**Table Name:** `assignments`
**Purpose:** Many-to-many relationships between employees, projects, and tasks
**Entity:** `Assignment`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique assignment identifier |
| `projectId` | UUID | NOT NULL, FK | Reference to project |
| `employeeId` | UUID | NOT NULL, FK | Reference to employee |
| `assignmentDate` | DATE | NOT NULL | Date of assignment |
| `supervisorId` | UUID | NOT NULL, FK | Supervising employee |
| `taskId` | UUID | NOT NULL, FK | Reference to specific task |
| `createdAt` | TIMESTAMP | DEFAULT NOW() | Assignment creation time |
| `updatedAt` | TIMESTAMP | DEFAULT NOW() | Last modification time |
| `deletedAt` | TIMESTAMP | NULL | Soft delete timestamp |
| `recordStatus` | BOOLEAN | DEFAULT true | Assignment active status |

**Foreign Key Relationships:**

- `projectId` → `projects.id` (Many-to-One)
- `employeeId` → `employees.id` (Many-to-One)
- `supervisorId` → `employees.id` (Many-to-One)
- `taskId` → `tasks.id` (Many-to-One)

**Constraints:**

- **Composite Uniqueness:** Combination of `(projectId, employeeId, taskId)` should be unique
- **Foreign Keys:** All references must be valid
- **Business Logic:** Assignment date should be realistic

**Business Rules:**

- Links employees to specific tasks within projects
- Tracks assignment history and supervision
- Enables complex project management reporting
- Supports multiple employees per project/task

```sql
-- Example Assignment record
INSERT INTO assignments (projectId, employeeId, assignmentDate, supervisorId, taskId) VALUES
('project-uuid', 'employee-uuid', '2024-01-20', 'supervisor-uuid', 'task-uuid');
```

---

## 🔗 Entity Relationship Diagram

``` bash
                    ┌─────────────────────┐
                    │       USERS         │
                    │ (Authentication)    │
                    └─────────────────────┘
                              │ (Independent)
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    │                         │                         │
┌───▼────┐                   │                   ┌─────▼──┐
│CLIENTS │                   │                   │EMPLOYEES│
│        │                   │                   │        │
└───┬────┘                   │                   └─────┬──┘
    │                        │                         │
    │ (1:N)                  │                         │ (N:M via Tasks)
    │                        │                         │
┌───▼────┐                   │                   ┌─────▼──┐
│PROJECTS│◄──────────────────┘                   │ TASKS  │
│        │                                       │        │
└───┬────┘                                       └─────┬──┘
    │                                                  │
    │ (1:N)                                           │
    │               ┌─────────────────────────────────┘
    │               │
┌───▼─────────────▼─┐
│   ASSIGNMENTS     │
│ (Junction Table)  │
└───────────────────┘
```

## 📊 Detailed Relationship Matrix

| From Entity | To Entity | Relationship Type | Foreign Key | Cardinality | Description |
|-------------|-----------|-------------------|-------------|-------------|-------------|
| **Client** | **Project** | One-to-Many | `projects.clientId` | 1:N | Each client can have multiple projects |
| **Project** | **Task** | One-to-Many | `tasks.projectId` | 1:N | Each project contains multiple tasks |
| **Employee** | **Task** (Assignee) | One-to-Many | `tasks.assigneeEmployeeId` | 1:N | Employee can be assigned to multiple tasks |
| **Employee** | **Task** (Supervisor) | One-to-Many | `tasks.supervisorId` | 1:N | Employee can supervise multiple tasks |
| **Project** | **Assignment** | One-to-Many | `assignments.projectId` | 1:N | Project can have multiple assignments |
| **Employee** | **Assignment** | One-to-Many | `assignments.employeeId` | 1:N | Employee can have multiple assignments |
| **Employee** | **Assignment** (Supervisor) | One-to-Many | `assignments.supervisorId` | 1:N | Employee can supervise multiple assignments |
| **Task** | **Assignment** | One-to-Many | `assignments.taskId` | 1:N | Task can have multiple assignments |

## 🔍 Business Logic Relationships

### Primary Workflows

1. **Client-Project Flow:**

   ``` bash
   Client → Project → Task → Assignment
   ```

2. **Employee-Task Flow:**

   ``` bash
   Employee ←→ Task (as Assignee or Supervisor)
   Employee ←→ Assignment (as Worker or Supervisor)
   ```

3. **Project Management Flow:**

   ``` bash
   Project → Multiple Tasks → Multiple Assignments → Multiple Employees
   ```

## 📈 Key Relationships Explained

### 🏢 **Client → Projects (1:N)**

- **Business Rule:** One client can request multiple projects
- **Use Case:** Corporate clients with ongoing projects
- **SQL Example:**

  ```sql
  SELECT c.name, p.name as project_name, p.startDate
  FROM clients c
  JOIN projects p ON c.id = p.clientId
  WHERE c.email = 'client@company.com';
  ```

### 🚀 **Project → Tasks (1:N)**

- **Business Rule:** Each project is broken down into multiple tasks
- **Use Case:** Project management and progress tracking
- **SQL Example:**

  ```sql
  SELECT p.name as project, t.description, t.startDate, t.endDate
  FROM projects p
  JOIN tasks t ON p.id = t.projectId
  WHERE p.name = 'E-commerce Website';
  ```

### 👥 **Employee → Tasks (1:N as Assignee)**

- **Business Rule:** Each employee can be assigned to multiple tasks
- **Use Case:** Workload distribution and tracking
- **SQL Example:**

  ```sql
  SELECT e.firstName, e.lastName, t.description, p.name as project
  FROM employees e
  JOIN tasks t ON e.id = t.assigneeEmployeeId
  JOIN projects p ON t.projectId = p.id
  WHERE e.department = 'Engineering';
  ```

### 👥 **Employee → Tasks (1:N as Supervisor)**

- **Business Rule:** Each employee can supervise multiple tasks
- **Use Case:** Management hierarchy and oversight
- **SQL Example:**

  ```sql
  SELECT supervisor.firstName as supervisor_name,
         assignee.firstName as assignee_name,
         t.description
  FROM tasks t
  JOIN employees supervisor ON t.supervisorId = supervisor.id
  JOIN employees assignee ON t.assigneeEmployeeId = assignee.id;
  ```

### 📌 **Assignments Junction Table**

- **Business Rule:** Complex many-to-many relationships
- **Use Case:** Detailed project-employee-task tracking
- **SQL Example:**

  ```sql
  SELECT p.name as project,
         e.firstName as employee,
         t.description as task,
         a.assignmentDate
  FROM assignments a
  JOIN projects p ON a.projectId = p.id
  JOIN employees e ON a.employeeId = e.id
  JOIN tasks t ON a.taskId = t.id
  ORDER BY a.assignmentDate DESC;
  ```

## 🎯 Advanced Queries

### Project Dashboard Query

```sql
-- Complete project overview with all relationships
SELECT
    c.name as client_name,
    p.name as project_name,
    p.startDate,
    p.endDate,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT a.employeeId) as assigned_employees,
    STRING_AGG(DISTINCT e.firstName || ' ' || e.lastName, ', ') as team_members
FROM projects p
JOIN clients c ON p.clientId = c.id
LEFT JOIN tasks t ON p.id = t.projectId
LEFT JOIN assignments a ON p.id = a.projectId
LEFT JOIN employees e ON a.employeeId = e.id
WHERE p.recordStatus = true
GROUP BY c.name, p.name, p.startDate, p.endDate
ORDER BY p.startDate DESC;
```

### Employee Workload Query

```sql
-- Employee workload across all projects
SELECT
    e.firstName || ' ' || e.lastName as employee_name,
    e.department,
    COUNT(DISTINCT t.id) as assigned_tasks,
    COUNT(DISTINCT t.projectId) as active_projects,
    COUNT(DISTINCT supervisor_tasks.id) as supervised_tasks
FROM employees e
LEFT JOIN tasks t ON e.id = t.assigneeEmployeeId AND t.endDate IS NULL
LEFT JOIN tasks supervisor_tasks ON e.id = supervisor_tasks.supervisorId AND supervisor_tasks.endDate IS NULL
WHERE e.recordStatus = true
GROUP BY e.id, e.firstName, e.lastName, e.department
ORDER BY assigned_tasks DESC;
```

## 🛡️ Security & Constraints

### Database-Level Security

- **SSL/TLS Encryption:** All connections encrypted
- **Role-Based Access:** Database user permissions
- **Soft Deletes:** Data preservation with logical deletion
- **Audit Trail:** Complete timestamp tracking

### Data Integrity Constraints

- **Primary Keys:** UUID for global uniqueness
- **Foreign Keys:** Referential integrity enforced
- **Unique Constraints:** Email uniqueness across users and clients
- **Check Constraints:** Role validation, date logic
- **NOT NULL:** Critical fields protected

### Application-Level Security

- **JWT Authentication:** Stateless token-based auth
- **Role-Based Authorization:** Admin/User permissions
- **Input Validation:** TypeScript DTOs with validation
- **SQL Injection Protection:** TypeORM parameterized queries

## 📊 Performance Considerations

### Indexing Strategy

```sql
-- Recommended indexes for optimal performance
CREATE INDEX idx_projects_client_id ON projects(clientId);
CREATE INDEX idx_tasks_project_id ON tasks(projectId);
CREATE INDEX idx_tasks_assignee_id ON tasks(assigneeEmployeeId);
CREATE INDEX idx_tasks_supervisor_id ON tasks(supervisorId);
CREATE INDEX idx_assignments_project_id ON assignments(projectId);
CREATE INDEX idx_assignments_employee_id ON assignments(employeeId);
CREATE INDEX idx_assignments_task_id ON assignments(taskId);

-- Composite indexes for common queries
CREATE INDEX idx_assignments_project_employee ON assignments(projectId, employeeId);
CREATE INDEX idx_tasks_project_dates ON tasks(projectId, startDate, endDate);
```

### Query Optimization

- **Eager Loading:** TypeORM relations for efficient JOINs
- **Pagination:** All endpoints support limit/offset
- **Filtering:** Indexed columns for WHERE clauses
- **Soft Delete Awareness:** Queries exclude deleted records

## 🔄 Migration Strategy

### TypeORM Synchronization

```typescript
// Database configuration with auto-sync for development
{
  type: 'postgres',
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: process.env.NODE_ENV === 'production',
  entities: [User, Client, Employee, Project, Task, Assignment],
}
```

### Production Migrations

- **Versioned Migrations:** Sequential database updates
- **Rollback Support:** Safe schema changes
- **Data Preservation:** Soft deletes prevent data loss
- **Zero-Downtime:** Backward-compatible changes

## 🧪 Sample Data

### Development Seed Data

```sql
-- Sample data for development and testing
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@company.com', '$2b$10$hashed_password', 'ADMIN'),
('Regular User', 'user@company.com', '$2b$10$hashed_password', 'USER');

INSERT INTO clients (name, surname, email, phone, address) VALUES
('John', 'Smith', 'john.smith@client1.com', '+1-555-0101', '123 Client St'),
('Jane', 'Doe', 'jane.doe@client2.com', '+1-555-0102', '456 Business Ave');

INSERT INTO employees (firstName, lastName, jobTitle, department) VALUES
('Alice', 'Johnson', 'Senior Developer', 'Engineering'),
('Bob', 'Wilson', 'Project Manager', 'Management'),
('Carol', 'Brown', 'UI/UX Designer', 'Design');
```

## 📚 API Integration

### REST Endpoints

All database entities are exposed through RESTful endpoints:

- **Authentication:** `/api/auth` - User management
- **Clients:** `/api/clients` - Client operations
- **Employees:** `/api/employees` - Employee management
- **Projects:** `/api/projects` - Project operations
- **Tasks:** `/api/tasks` - Task management
- **Assignments:** `/api/assignments` - Assignment tracking

### Pagination Support

All GET endpoints support standardized pagination:

- `limit` (default: 10) - Records per page
- `page` (default: 0) - Page number (0-based)
- `search` (optional) - Search term filtering

### Interactive Documentation

- **Swagger UI:** [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)
- **Live Testing:** Direct API interaction
- **Schema Validation:** Request/response examples

---

## 📄 Conclusion

This database schema provides a robust foundation for enterprise project management operations. The relational design ensures data integrity while supporting complex business workflows and reporting requirements.

### Key Strengths

- **🔧 Flexibility:** Supports various project management scenarios
- **📊 Scalability:** Efficient indexing and query optimization
- **🛡️ Security:** Comprehensive data protection measures
- **🔍 Traceability:** Complete audit trail and soft deletes
- **🎯 Integration:** RESTful API with comprehensive documentation

**For more information, visit the live API documentation at [https://api.thorium-technologies.com/api/docs](https://api.thorium-technologies.com/api/docs)**

---

*Database Schema Documentation - Project Management API*
*© 2024 Luis Gabriel Zamora Acevedo - CONAIP*
