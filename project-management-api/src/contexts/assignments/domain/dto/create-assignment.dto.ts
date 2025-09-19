import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({
    description: 'Project ID for this assignment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Employee ID being assigned',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    description: 'Date when the assignment was made',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  assignmentDate: string;

  @ApiProperty({
    description: 'Supervisor employee ID for this assignment',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;

  @ApiProperty({
    description: 'Task ID being assigned',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  @IsUUID()
  @IsNotEmpty()
  taskId: string;
}
