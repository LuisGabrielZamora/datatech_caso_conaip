import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RequestPaginatorDto {
  @ApiPropertyOptional({
    description: 'Number of items to return per page',
    default: 10,
    minimum: 1,
    type: Number,
    example: 10,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Page number (0-based)',
    default: 0,
    minimum: 0,
    type: Number,
    example: 0,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsNumber()
  @Min(0)
  page: number = 0;

  @ApiPropertyOptional({
    description: 'Search term to filter results',
    type: String,
    example: '',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
