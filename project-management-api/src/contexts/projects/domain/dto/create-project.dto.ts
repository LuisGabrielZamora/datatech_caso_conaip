import { Optional } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'E-commerce Website',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Development of a modern e-commerce platform',
    required: false,
  })
  @IsString()
  @Optional()
  description: string;

  @ApiProperty({
    description: 'Project start date',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'Project end date',
    example: '2024-06-15T00:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @Optional()
  endDate: string;

  @ApiProperty({
    description: 'Client ID associated with this project',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  clientId: string;
}
