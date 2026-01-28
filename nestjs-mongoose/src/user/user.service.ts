import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserBodyDto } from './dtos/request/create-user.dto';
import { UpdateUserBodyDto } from './dtos/request/update-user.dto';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserBodyDto: CreateUserBodyDto): Promise<User> {
    if (await this.userNameExists(createUserBodyDto.name)) {
      throw new ConflictException();
    }

    return this.userModel.create(createUserBodyDto);
  }

  async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserBodyDto,
  ): Promise<User> {
    const { name } = updateUserDto;
    if (name && (await this.userNameExistsExcluding(name, id))) {
      throw new ConflictException('This name is already taken');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );

    if (updatedUser === null) {
      throw new NotFoundException();
    }

    return updatedUser;
  }

  async delete(id: Types.ObjectId): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (deletedUser === null) {
      throw new NotFoundException();
    }

    return deletedUser;
  }

  private async userNameExists(name: string): Promise<boolean> {
    const found = await this.userModel.findOne({ name });
    return found !== null;
  }

  private async userNameExistsExcluding(
    name: string,
    excludeId: Types.ObjectId,
  ): Promise<boolean> {
    const found = await this.userModel.findOne({
      name,
      _id: { $ne: excludeId },
    });
    return found !== null;
  }
}
