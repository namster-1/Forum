using forum_api.Models;
using Microsoft.EntityFrameworkCore;

namespace forum_api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Categories — update icons and descriptions even if they exist
        var categoryData = new List<(string Name, string Icon, string Description)>
        {
            ("Backend", "🖥", "APIs, servers, databases, architecture and everything behind the scenes."),
            ("Frontend", "🎨", "React, Vue, CSS, UI/UX and everything the user sees."),
            ("DevOps", "☁️", "CI/CD, Docker, Kubernetes, cloud infrastructure and deployments."),
            ("Security", "🔒", "Auth, encryption, vulnerabilities, best practices and pen testing."),
            ("Databases", "🗄", "PostgreSQL, MySQL, MongoDB, Redis, query optimization and design."),
            ("Mobile", "📱", "iOS, Android, React Native, Flutter and cross-platform development."),
            ("AI / ML", "🤖", "Machine learning, LLMs, data science, model training and inference."),
            ("Testing", "🧪", "Unit tests, integration tests, E2E, TDD and QA practices."),
        };

        foreach (var (name, icon, description) in categoryData)
        {
            var existing = await context.Categories.FirstOrDefaultAsync(c => c.Name == name);
            if (existing == null)
            {
                context.Categories.Add(new Category { Name = name, Icon = icon, Description = description });
            }
            else
            {
                existing.Icon = icon;
                existing.Description = description;
            }
        }
        await context.SaveChangesAsync();

        // Tags
        var tagNames = new[]
        {
            ".NET", "React", "PostgreSQL", "Docker", "Auth", "CI/CD",
            "Performance", "Security", "IIS", "API Design",
            "TypeScript", "Redis", "Testing", "Discussion"
        };

        foreach (var tagName in tagNames)
        {
            if (!await context.Tags.AnyAsync(t => t.Name == tagName))
                context.Tags.Add(new Tag { Name = tagName });
        }
        await context.SaveChangesAsync();

        // Demo user — check by email specifically
        if (!await context.Users.AnyAsync(u => u.Email == "admin@devforum.com"))
        {
            var user = new User
            {
                Username = "admin",
                Email = "admin@devforum.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin1234!"),
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var backend = await context.Categories.FirstAsync(c => c.Name == "Backend");
            var frontend = await context.Categories.FirstAsync(c => c.Name == "Frontend");
            var databases = await context.Categories.FirstAsync(c => c.Name == "Databases");

            var tagDotNet = await context.Tags.FirstAsync(t => t.Name == ".NET");
            var tagAuth = await context.Tags.FirstAsync(t => t.Name == "Auth");
            var tagReact = await context.Tags.FirstAsync(t => t.Name == "React");
            var tagTs = await context.Tags.FirstAsync(t => t.Name == "TypeScript");
            var tagPostgres = await context.Tags.FirstAsync(t => t.Name == "PostgreSQL");
            var tagPerf = await context.Tags.FirstAsync(t => t.Name == "Performance");

            var thread1 = new ForumThread
            {
                Title = "Best practices for JWT refresh token rotation in .NET 10?",
                Content = "I'm building a REST API with .NET 10 and I'm trying to figure out the best approach for handling JWT refresh token rotation.\n\nCurrently I'm issuing a short-lived access token (15 min) and a longer refresh token (7 days), but I'm not sure how to handle the rotation safely.\n\nAny advice from people who have done this in production would be really appreciated.",
                UserId = user.Id,
                CategoryId = backend.Id,
                IsSolved = true,
                Views = 342,
                CreatedAt = DateTime.UtcNow.AddHours(-2),
                ThreadTags = new List<ThreadTag>
                {
                    new() { Tag = tagDotNet },
                    new() { Tag = tagAuth }
                }
            };

            var thread2 = new ForumThread
            {
                Title = "PostgreSQL JSONB vs separate table — when does it actually make sense?",
                Content = "I keep going back and forth on this. When should I store data as JSONB in PostgreSQL versus creating a proper relational table?\n\nI have a use case where users can have dynamic attributes that differ per user type. JSONB seems convenient but I'm worried about query performance and data integrity.\n\nWhat's your experience with this in production?",
                UserId = user.Id,
                CategoryId = databases.Id,
                IsSolved = false,
                Views = 891,
                CreatedAt = DateTime.UtcNow.AddHours(-5),
                ThreadTags = new List<ThreadTag>
                {
                    new() { Tag = tagPostgres },
                    new() { Tag = tagPerf }
                }
            };

            var thread3 = new ForumThread
            {
                Title = "React 19 — is the new compiler worth upgrading for in production?",
                Content = "We're running a fairly large React 18 app and considering upgrading to React 19 for the new compiler optimizations.\n\nHas anyone done this migration in production? What were the breaking changes you hit? Was the performance improvement noticeable?\n\nWould love to hear real world experiences before we commit to this.",
                UserId = user.Id,
                CategoryId = frontend.Id,
                IsSolved = false,
                Views = 1400,
                CreatedAt = DateTime.UtcNow.AddHours(-8),
                ThreadTags = new List<ThreadTag>
                {
                    new() { Tag = tagReact },
                    new() { Tag = tagTs }
                }
            };

            context.Threads.AddRange(thread1, thread2, thread3);
            await context.SaveChangesAsync();

            // Replies for first thread
            var replies = new List<Reply>
            {
                new()
                {
                    Content = "Great question. Here's what works well in production:\n\nYes, invalidate the old refresh token immediately after use — this is called refresh token rotation and it's the recommended approach.\n\nFor theft detection, keep a family ID on each token. If a refresh token that was already used gets submitted again, invalidate the entire family.\n\nFor storage, I'd recommend the database for most cases. PostgreSQL can handle the load for most forum-scale apps easily.",
                    UserId = user.Id,
                    ThreadId = thread1.Id,
                    Votes = 12,
                    IsAccepted = true,
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new()
                {
                    Content = "Also worth looking at the ASP.NET Core Data Protection API if you want a .NET-native approach. It handles a lot of the token lifecycle stuff for you and integrates cleanly with minimal APIs.",
                    UserId = user.Id,
                    ThreadId = thread1.Id,
                    Votes = 5,
                    IsAccepted = false,
                    CreatedAt = DateTime.UtcNow.AddMinutes(-45)
                },
            };

            context.Replies.AddRange(replies);
            await context.SaveChangesAsync();
        }
    }
}