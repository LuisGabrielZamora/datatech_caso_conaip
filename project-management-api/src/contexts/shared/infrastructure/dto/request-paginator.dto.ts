import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class RequestPaginatorDto {
  @IsInt()
  @IsNumber()
  @IsPositive()
  @Min(1)
  limit: number;

  @IsInt()
  @IsNumber()
  @Min(0)
  page: number;

  @IsOptional()
  @IsString()
  search: string;
}
