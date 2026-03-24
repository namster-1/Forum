namespace forum_api.Models;

public class ForumThread
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsSolved { get; set; } = false;
    public int Views { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public ICollection<Reply> Replies { get; set; } = new List<Reply>();
    public ICollection<ThreadTag> ThreadTags { get; set; } = new List<ThreadTag>();
}