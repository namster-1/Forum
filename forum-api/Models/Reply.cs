namespace forum_api.Models;

public class Reply
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Votes { get; set; } = 0;
    public bool IsAccepted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ThreadId { get; set; }
    public ForumThread Thread { get; set; } = null!;
}