import { ApiProperty } from '@nestjs/swagger';

export class FormModulePermissionDto {
  @ApiProperty({ required: true })
  moduleId: string;

  @ApiProperty({ required: true, type: [String] })
  permissionActions: string[];
}

export class FormPermissionDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, nullable: true, default: false })
  isAdminPermission: boolean;

  @ApiProperty({ required: false, type: [FormModulePermissionDto] })
  modulePermissions: FormModulePermissionDto[];
}

export class PermissionDto extends FormPermissionDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
