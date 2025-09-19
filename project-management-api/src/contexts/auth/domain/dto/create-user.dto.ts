import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'User full name',
    example: 'John Doe'
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com'
  })
  @IsString()
  @MinLength(3)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters, must contain uppercase, lowercase and number)',
    example: 'Password123'
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
    enum: [Roles.admin, Roles.user]
  })
  @IsIn([Roles.admin, Roles.user])
  @IsString()
  role: string;
}
