import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountUserService } from './account-user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from './dto/account-user.dto';

@ApiTags('Account-user')
@Controller('account-user')
export class AccountUserController {
  constructor(private readonly accountUserService: AccountUserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  registerUser(@Body() user: CreateUserDto) {
    return this.accountUserService.handleRegister(user);
  }

  @ApiOperation({ summary: 'Login to your Account' })
  @Post('login')
  loginuser(@Body() reqBody:LoginUserDto) {
    return this.accountUserService.handleLogin(reqBody);
  }
  
}
