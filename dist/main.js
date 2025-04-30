"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
const auth_debug_middleware_1 = require("./common/middleware/auth-debug.middleware");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const logging_interceptor_1 = require("./interceptors/logging.interceptor");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.use(new auth_debug_middleware_1.AuthDebugMiddleware().use);
    app.use((req, res, next) => {
        console.log('🔹 Received Token:', req.headers.authorization);
        next();
    });
    app.useGlobalInterceptors(app.get(logging_interceptor_1.LoggingInterceptor));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Traampo API')
        .setDescription('API documentation for Traampo services')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
    }, 'jwt')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map