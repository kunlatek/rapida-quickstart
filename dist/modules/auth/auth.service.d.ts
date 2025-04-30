import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import { ErrorService } from '../../common/services/error.service';
import { UserRole } from 'src/enums/user-role.enum';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly errorService;
    constructor(userService: UserService, jwtService: JwtService, errorService: ErrorService);
    validateUser(email: string, password: string): Promise<UserDocument>;
    login(user: UserDocument): Promise<{
        access_token: string;
    }>;
    issueTokenWithRole(userId: string, newRole: UserRole): Promise<{
        access_token: string;
    }>;
    switchActiveRole(user: any, newRole: UserRole): Promise<{
        access_token: string;
    }>;
    googleLogin(idToken: string): Promise<{
        access_token: string;
    }>;
    appleLogin(idToken: string): Promise<{
        access_token: string;
    }>;
}
