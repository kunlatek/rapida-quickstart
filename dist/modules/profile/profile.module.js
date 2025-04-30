"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const common_module_1 = require("../../common/common.module");
const user_module_1 = require("../user/user.module");
const auth_module_1 = require("../auth/auth.module");
const profile_schema_1 = require("./schemas/profile.schema");
const company_profile_controller_1 = require("./company-profile.controller");
const company_profile_service_1 = require("./company-profile.service");
const company_profile_schema_1 = require("./schemas/company-profile.schema");
const person_profile_controller_1 = require("./person-profile.controller");
const person_profile_service_1 = require("./person-profile.service");
const person_profile_schema_1 = require("./schemas/person-profile.schema");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: profile_schema_1.Profile.name, schema: profile_schema_1.ProfileSchema },
                { name: 'PersonProfile', schema: person_profile_schema_1.PersonProfileSchema },
                { name: 'CompanyProfile', schema: company_profile_schema_1.CompanyProfileSchema },
            ]),
            common_module_1.CommonModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
        ],
        controllers: [company_profile_controller_1.CompanyProfileController, person_profile_controller_1.PersonProfileController],
        providers: [company_profile_service_1.CompanyProfileService, person_profile_service_1.PersonProfileService],
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map