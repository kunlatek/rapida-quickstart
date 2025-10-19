using MailKit.Net.Smtp;
using MimeKit;

namespace RapidaQuickstart.DotNet.Common.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
        Task SendRegistrationEmailAsync(string email, string token);
        Task SendPasswordResetEmailAsync(string email, string token);
        Task SendInvitationEmailAsync(string email, string token);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            _smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["Email:SmtpUsername"] ?? "";
            _smtpPassword = _configuration["Email:SmtpPassword"] ?? "";
            _fromEmail = _configuration["Email:FromEmail"] ?? "noreply@rapidaquickstart.com";
            _fromName = _configuration["Email:FromName"] ?? "Rapida Quickstart";
        }

        public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(_fromName, _fromEmail));
            message.To.Add(new MailboxAddress("", to));
            message.Subject = subject;

            if (isHtml)
            {
                message.Body = new TextPart("html") { Text = body };
            }
            else
            {
                message.Body = new TextPart("plain") { Text = body };
            }

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtpHost, _smtpPort, false);
            await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        public async Task SendRegistrationEmailAsync(string email, string token)
        {
            var subject = "Complete your registration";
            var body = $@"
                <h2>Welcome to Rapida Quickstart!</h2>
                <p>Please click the link below to complete your registration:</p>
                <a href='{_configuration["App:BaseUrl"]}/auth/signup?token={token}'>Complete Registration</a>
                <p>This link will expire in 24 hours.</p>
            ";
            
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string email, string token)
        {
            var subject = "Reset your password";
            var body = $@"
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href='{_configuration["App:BaseUrl"]}/auth/reset-password?token={token}'>Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            ";
            
            await SendEmailAsync(email, subject, body);
        }

        public async Task SendInvitationEmailAsync(string email, string token)
        {
            var subject = "You're invited to join Rapida Quickstart";
            var body = $@"
                <h2>You're invited!</h2>
                <p>You've been invited to join Rapida Quickstart. Click the link below to accept:</p>
                <a href='{_configuration["App:BaseUrl"]}/auth/signup?invitation={token}'>Accept Invitation</a>
                <p>This invitation will expire in 7 days.</p>
            ";
            
            await SendEmailAsync(email, subject, body);
        }
    }
}
