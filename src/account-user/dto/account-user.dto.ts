import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+91-9876543210',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Password for user account (hashed in DB)',
    example: 'MySecurePass@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

   @ApiProperty({
    description: 'description of the user',
    example: 'MBBS',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'Unique email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

    @ApiProperty({
    description: 'Password for user account (hashed in DB)',
    example: 'MySecurePass@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}