import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './permeson/role/role.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import {
  ModulePermission,
  Permission,
} from './permeson/permission/permission.entity';
import { Module as ModuleEntity } from './permeson/module/module.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,

    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = request.cookies.token;
    if (!token) throw new HttpException('Token not found', 401);

    try {
      const { user } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!user) throw new HttpException('Invalid token', 401);

      //   Get role
      const role = await this.roleRepository.findOneBy({
        userId: user,
      });
      if (!role) throw new HttpException('Role not found', 401);

      //   Get permission
      const permission = await this.permissionRepository.findOneBy({
        _id: new ObjectId(role.permissionId),
      });
      if (!permission) throw new HttpException('permission not found', 401);
      if (permission.isAdminPermission) return true;

      //   Get modules in permission
      const moduleIds = permission.modulePermissions.map(
        (modulePermission: ModulePermission) => modulePermission.moduleId,
      );
      // TODO: Use findIn instead of filter
      const modules = (await this.moduleRepository.find()).filter((module) =>
        moduleIds.includes(module._id.toString()),
      );

      // Get specific module with permission actions
      const route = request.url.split('/')[2];
      const module = modules.find((module: ModuleEntity) => {
        const regex = new RegExp(`^/${route.replace(/^\/|\/$/g, '')}$`);
        return regex.test(module.route);
      });
      const permissionActions =
        permission.modulePermissions.find(
          (modulePermission: ModulePermission) =>
            modulePermission.moduleId === module?._id.toString(),
        )?.permissionActions ?? [];

      // Check if the request method is in the permission actions
      const permissionActionFound = permissionActions.find(
        (permissionAction: string) => permissionAction === request.method,
      );

      if (!permissionActionFound)
        throw new HttpException('Permission denied', 401);

      return true;
    } catch (error) {
      throw new HttpException(error.message, 401);
    }
  }
}
