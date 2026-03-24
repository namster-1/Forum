namespace forum_api.DTOs;

public class CreateReplyDto
{
    public string Content { get; set; } = string.Empty;
    public int ThreadId { get; set; }
}

public class ReplyDto
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string AuthorUsername { get; set; } = string.Empty;
    public int Votes { get; set; }
    public bool IsAccepted { get; set; }
    public DateTime CreatedAt { get; set; }
}