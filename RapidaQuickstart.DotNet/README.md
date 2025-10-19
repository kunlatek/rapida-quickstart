# Rapida Quickstart - .NET Version

This is a .NET 8.0 Web API project that replicates all the functionality from the NestJS version of Rapida Quickstart.

## Features

- **Authentication**: JWT-based authentication with Google/Apple OAuth support
- **User Management**: Complete CRUD operations with role-based access control
- **Profile Management**: Support for both person and company profiles
- **Invitation System**: Email-based invitation system
- **SMS Integration**: Twilio SMS service for verification codes
- **Internationalization**: Multi-language support (EN, PT, ES)
- **MongoDB**: Document database with MongoDB driver
- **Swagger Documentation**: Complete API documentation
- **Email Service**: MailKit-based email service

## Project Structure

```
RapidaQuickstart.DotNet/
├── Controllers/          # API Controllers
├── Models/              # Data Models
├── Services/            # Business Logic Services
├── DTOs/               # Data Transfer Objects
├── Enums/              # Enumerations
├── Interfaces/         # Service Interfaces
├── Common/             # Common Services and Utilities
│   ├── Services/       # Shared Services
│   ├── Middleware/     # Custom Middleware
│   ├── Guards/         # Authorization Guards
│   ├── Filters/        # Exception Filters
│   └── Constants/      # Application Constants
└── Localization/       # Translation Files
    ├── en/
    ├── pt/
    └── es/
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/google/login` - Google OAuth login
- `POST /api/auth/apple/login` - Apple OAuth login
- `POST /api/auth/login` - Local login
- `POST /api/auth/switch-role` - Switch active role
- `POST /api/auth/register-init` - Initialize registration
- `POST /api/auth/signup` - Complete registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users (`/api/users`)
- `POST /api/users` - Create user
- `POST /api/users/invitation` - Create user by invitation
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/me` - Get current user
- `GET /api/users/has-profile` - Check if user has profile
- `GET /api/users/{id}` - Get user by ID (Admin only)
- `PATCH /api/users/restore` - Restore own profile
- `PATCH /api/users/change-password` - Change password
- `PATCH /api/users/{id}` - Update user (Admin only)
- `DELETE /api/users/{id}` - Soft delete user (Admin only)
- `DELETE /api/users` - Soft delete own profile

### Root (`/api`)
- `GET /api` - Hello world with i18n support

## Prerequisites

- .NET 8.0 SDK
- MongoDB (running locally or accessible)
- SMTP server for email functionality
- Twilio account for SMS functionality (optional)

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd RapidaQuickstart.DotNet
   ```

3. Restore packages:
   ```bash
   dotnet restore
   ```

4. Configure the application by copying `config.example` and updating the values:
   ```bash
   cp config.example .env
   # Edit .env with your configuration
   ```

5. Update `appsettings.json` and `appsettings.Development.json` with your configuration

6. Run the application:
   ```bash
   dotnet run
   ```

## Configuration

### Database
Update the MongoDB connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://localhost:27017"
  }
}
```

### JWT
Configure JWT settings:
```json
{
  "Jwt": {
    "SecretKey": "your-super-secret-key-that-is-at-least-32-characters-long",
    "Issuer": "RapidaQuickstart",
    "Audience": "RapidaQuickstart",
    "ExpirationMinutes": 60
  }
}
```

### Email
Configure SMTP settings:
```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@rapidaquickstart.com",
    "FromName": "Rapida Quickstart"
  }
}
```

### Google OAuth
Configure Google authentication:
```json
{
  "Authentication": {
    "Google": {
      "ClientId": "your-google-client-id",
      "ClientSecret": "your-google-client-secret"
    }
  }
}
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

## User Roles

- **ADMIN**: Full access to all resources
- **PERSON**: Access to person profile and own resources
- **COMPANY**: Access to company profile and own resources

## Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your-jwt-token
```

## Internationalization

The API supports multiple languages through query parameters:
- `?lang=en` - English
- `?lang=pt` - Portuguese
- `?lang=es` - Spanish

## Development

### Running in Development Mode
```bash
dotnet run --environment Development
```

### Building for Production
```bash
dotnet build --configuration Release
```

### Running Tests
```bash
dotnet test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
