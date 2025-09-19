import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({
        description: 'Employee first name',
        example: 'John',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'Employee last name',
        example: 'Doe',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'Employee job title',
        example: 'Software Developer',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    jobTitle: string;

    @ApiProperty({
        description: 'Employee department',
        example: 'Engineering',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    department: string;
}