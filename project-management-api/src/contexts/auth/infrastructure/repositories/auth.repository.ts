import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import {
  GenericRepository,
  PaginatorUtil,
} from 'src/contexts/shared/application';
import { SecurityService } from '../services/security.service';
import { User } from '../../domain/entities';
import { IUser } from '../../domain/abstractions';
import { CreateUserDto, UpdateUserDto } from '../../domain/dto';
import { ErrorHandlerService } from 'src/contexts/shared/infrastructure/services';
import {
  IPaginator,
  IPaginatorDto,
} from 'src/contexts/shared/domain/abstractions';
import { CUSTOM_MESSAGES } from 'src/contexts/shared/domain/constants';
import { UserResources } from '../../domain/enum/resource.enum';

@Injectable()
export class AuthRepository extends GenericRepository<User> {
  @Inject(SecurityService)
  private readonly securityService: SecurityService;

  @Inject(ErrorHandlerService)
  private readonly errorHandlerService: ErrorHandlerService;

  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {
    super(_repository, UserResources.UNIQUE_CONSTANTS);
  }

  async seed(users: IUser[]) {
    try {
      const httpResponses = users.map((seed) => this.createEntity(seed));
      return await Promise.allSettled(httpResponses);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const findOneOptions = {
      where: { email: userData.email },
    };

    const user = await this.showEntity(findOneOptions);
    if (user) {
      this.errorHandlerService.handleGenericErrors(
        CUSTOM_MESSAGES.unique.description,
      );
    }

    try {
      return await this.createEntity({
        ...userData,
        password: this.securityService.hashPassword(password),
      } as any);
    } catch (error) {
      this.errorHandlerService.handleDatabaseErrors(
        error,
        CUSTOM_MESSAGES.onCreateError.description,
      );
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const record = this._repository.findOne(this.idOptions(id));

    if (!record)
      throw new BadRequestException(CUSTOM_MESSAGES.notFound.description);

    try {
      if (updateUserDto.password) {
        updateUserDto.password = this.securityService.hashPassword(
          updateUserDto.password,
        );
      }
      return this.updateEntity(id, updateUserDto as any);
    } catch (e) {
      throw new InternalServerErrorException(
        CUSTOM_MESSAGES.onUpdateError.description,
      );
    }
  }

  async findAll({
    limit = 25,
    page = 0,
    search = '',
  }: IPaginator): Promise<IPaginatorDto<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { role: Like(`%${search}%`) },
        ],
        relations: UserResources.ENTITY_RELATIONS,
      };
      return await this.getEntities(page, limit, options);
    } catch (error) {
      return PaginatorUtil.mapper([], 0, limit, page);
    }
  }

  findOne(id: string) {
    return this._repository.findOne({
      where: { id },
      relations: UserResources.ENTITY_RELATIONS,
    });
  }

  async remove(id: string): Promise<User> {
    return await this.deleteEntity(id);
  }
}
