namespace forum_api.Models;

public class ThreadTag
{
    public int ThreadId { get; set; }
    public ForumThread Thread { get; set; } = null!;

    public int TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}