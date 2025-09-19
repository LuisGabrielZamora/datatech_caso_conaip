import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client first name',
    example: 'John',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Client last name',
    example: 'Doe',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'john.doe@example.com',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
    minLength: 7,
  })
  @IsString()
  @MinLength(7)
  phone: string;

  @ApiProperty({
    description: 'Client address',
    example: '123 Main St, City, State',
    required: false,
  })
  @IsString()
  @Optional()
  address: string;
}
