import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Project ID this task belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Implement user authentication system',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Task start date',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Task end date',
    example: '2024-01-30T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @Optional()
  endDate: string;

  @ApiProperty({
    description: 'Employee ID assigned to this task',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  assigneeEmployeeId: string;

  @ApiProperty({
    description: 'Supervisor employee ID for this task',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  supervisorId: string;
}
