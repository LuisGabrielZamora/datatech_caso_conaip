import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MasterController } from 'src/contexts/shared/infrastructure';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../repositories/client.repository';
import { ClientsService } from '../services/clients.service';
import { ClientResources } from '../../domain/enum';
import { Auth } from 'src/contexts/auth/infrastructure/decorators';
import { Roles } from 'src/contexts/auth/domain/enum';
import { CreateClientDto } from '../../domain/dto/create-client.dto';
import { UpdateClientDto } from '../../domain/dto/update-client.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController extends MasterController<Client> {
  private _repository: ClientRepository;
  constructor(
    _repository: ClientRepository,
    private readonly service: ClientsService,
  ) {
    super(
      _repository,
      ClientResources.FILTER_OR_FIELDS,
      ClientResources.ENTITY_RELATIONS,
    );
    this._repository = _repository;
  }

  @Post()
  @Auth(Roles.admin)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createClientDto: CreateClientDto) {
    return this._repository.createEntity(createClientDto);
  }

  @Patch(':id')
  @Auth(Roles.admin)
  @ApiOperation({ summary: 'Update client by ID' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this._repository.updateEntity(id, updateClientDto);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed client data' })
  @ApiResponse({ status: 200, description: 'Client data seeded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  seed() {
    return this.service.seed();
  }
}
