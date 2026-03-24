namespace forum_api.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ForumThread> Threads { get; set; } = new List<ForumThread>();
    public ICollection<Reply> Replies { get; set; } = new List<Reply>();
}