import { Strategy } from 'passport-jwt';
import { UserRole } from 'src/enums/user-role.enum';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: any): Promise<{
        userId: any;
        email: any;
        activeRole: UserRole;
        availableRoles: UserRole[];
    }>;
}
export {};
