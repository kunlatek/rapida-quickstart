import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AppleLoginDto } from './dto/apple-login.dto';
import { UserRole } from 'src/enums/user-role.enum';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleLoginWithToken(dto: GoogleLoginDto): Promise<{
        access_token: string;
    }>;
    appleLoginWithToken(dto: AppleLoginDto): Promise<{
        access_token: string;
    }>;
    login(req: any): Promise<{
        access_token: string;
    }>;
    switchRole(req: any, role: UserRole): Promise<{
        access_token: string;
    }>;
}
