using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using forum_api.Data;
using forum_api.DTOs;
using forum_api.Models;

namespace forum_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ThreadsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ThreadsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] string? tag)
    {
        var query = _context.Threads
            .Include(t => t.User)
            .Include(t => t.Category)
            .Include(t => t.ThreadTags)
                .ThenInclude(tt => tt.Tag)
            .Include(t => t.Replies)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        if (!string.IsNullOrEmpty(tag))
            query = query.Where(t => t.ThreadTags.Any(tt => tt.Tag.Name == tag));

        var threads = await query
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new ThreadSummaryDto
            {
                Id = t.Id,
                Title = t.Title,
                AuthorUsername = t.User.Username,
                CategoryName = t.Category.Name,
                IsSolved = t.IsSolved,
                Views = t.Views,
                ReplyCount = t.Replies.Count,
                Tags = t.ThreadTags.Select(tt => tt.Tag.Name).ToList(),
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(threads);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var thread = await _context.Threads
            .Include(t => t.User)
            .Include(t => t.Category)
            .Include(t => t.ThreadTags)
                .ThenInclude(tt => tt.Tag)
            .Include(t => t.Replies)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (thread == null) return NotFound();

        thread.Views++;
        await _context.SaveChangesAsync();

        return Ok(new ThreadDetailDto
        {
            Id = thread.Id,
            Title = thread.Title,
            Content = thread.Content,
            AuthorUsername = thread.User.Username,
            CategoryName = thread.Category.Name,
            IsSolved = thread.IsSolved,
            Views = thread.Views,
            Tags = thread.ThreadTags.Select(tt => tt.Tag.Name).ToList(),
            CreatedAt = thread.CreatedAt,
            Replies = thread.Replies.Select(r => new ReplyDto
            {
                Id = r.Id,
                Content = r.Content,
                AuthorUsername = r.User.Username,
                Votes = r.Votes,
                IsAccepted = r.IsAccepted,
                CreatedAt = r.CreatedAt
            }).ToList()
        });
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateThreadDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var thread = new ForumThread
        {
            Title = dto.Title,
            Content = dto.Content,
            UserId = userId,
            CategoryId = dto.CategoryId
        };

        _context.Threads.Add(thread);
        await _context.SaveChangesAsync();

        foreach (var tagName in dto.Tags)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == tagName)
                      ?? new Tag { Name = tagName };

            if (tag.Id == 0)
            {
                _context.Tags.Add(tag);
                await _context.SaveChangesAsync();
            }

            _context.ThreadTags.Add(new ThreadTag
            {
                ThreadId = thread.Id,
                TagId = tag.Id
            });
        }

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = thread.Id }, new { thread.Id });
    }

    [Authorize]
    [HttpPatch("{id}/solve")]
    public async Task<IActionResult> MarkSolved(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var thread = await _context.Threads.FindAsync(id);

        if (thread == null) return NotFound();
        if (thread.UserId != userId) return Forbid();

        thread.IsSolved = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}