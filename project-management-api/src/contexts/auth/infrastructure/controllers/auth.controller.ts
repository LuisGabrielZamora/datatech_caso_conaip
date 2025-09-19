import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../../domain/entities';
import { AuthRepository } from '../repositories';
import {
  MasterController,
  RequestPaginatorDto,
} from 'src/contexts/shared/infrastructure';
import { Auth } from '../decorators';
import { UserResources, Roles } from '../../domain/enum';
import {
  CreateUserDto,
  LoginDto,
  TokenDto,
  UpdateUserDto,
} from '../../domain/dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController extends MasterController<User> {
  @Inject(AuthService)
  private readonly authService: AuthService;

  private _repository: AuthRepository;
  constructor(_repository: AuthRepository) {
    super(
      _repository,
      UserResources.FILTER_OR_FIELDS,
      UserResources.ENTITY_RELATIONS,
    );
    this._repository = _repository;
  }

  @Post('register')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createAuthDto: CreateUserDto) {
    return this._repository.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  validateToken(@Body() { xToken }: TokenDto) {
    return this.authService.validateToken(xToken);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed initial data' })
  @ApiResponse({ status: 200, description: 'Data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.authService.seed();
  }

  @Get()
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationDto: RequestPaginatorDto) {
    return this._repository.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this._repository.findOne(id);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateUserDto) {
    return this._repository.update(id, updateAuthDto);
  }

  @Delete(':id')
  @Auth(Roles.admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removeEntity(@Param('id') id: string) {
    return this._repository.remove(id);
  }
}
