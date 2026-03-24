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
public class RepliesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RepliesController(AppDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateReplyDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var thread = await _context.Threads.FindAsync(dto.ThreadId);
        if (thread == null) return NotFound("Thread not found.");

        var reply = new Reply
        {
            Content = dto.Content,
            ThreadId = dto.ThreadId,
            UserId = userId
        };

        _context.Replies.Add(reply);
        await _context.SaveChangesAsync();

        return Ok(new ReplyDto
        {
            Id = reply.Id,
            Content = reply.Content,
            AuthorUsername = (await _context.Users.FindAsync(userId))!.Username,
            Votes = reply.Votes,
            IsAccepted = reply.IsAccepted,
            CreatedAt = reply.CreatedAt
        });
    }

    [Authorize]
    [HttpPost("{id}/vote")]
    public async Task<IActionResult> Vote(int id, [FromQuery] string direction)
    {
        var reply = await _context.Replies.FindAsync(id);
        if (reply == null) return NotFound();

        if (direction == "up") reply.Votes++;
        else if (direction == "down") reply.Votes--;
        else return BadRequest("Direction must be 'up' or 'down'.");

        await _context.SaveChangesAsync();

        return Ok(new { reply.Votes });
    }

    [Authorize]
    [HttpPatch("{id}/accept")]
    public async Task<IActionResult> Accept(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var reply = await _context.Replies
            .Include(r => r.Thread)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reply == null) return NotFound();
        if (reply.Thread.UserId != userId) return Forbid();

        reply.IsAccepted = !reply.IsAccepted;
        await _context.SaveChangesAsync();

        return Ok(new { reply.IsAccepted });
    }
}