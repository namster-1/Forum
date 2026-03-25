namespace forum_api.DTOs;

public class CreateThreadDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class ThreadSummaryDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string AuthorUsername { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public bool IsSolved { get; set; }
    public int Views { get; set; }
    public int ReplyCount { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class ThreadDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string AuthorUsername { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public bool IsSolved { get; set; }
    public int Views { get; set; }
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public List<ReplyDto> Replies { get; set; } = new();
}

public class PagedThreadsDto
{
    public List<ThreadSummaryDto> Threads { get; set; } = new();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}