using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using forum_api.Data;
using forum_api.DTOs;

namespace forum_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TagsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tags = await _context.Tags
            .Select(t => new TagDto
            {
                Id = t.Id,
                Name = t.Name,
                ThreadCount = t.ThreadTags.Count
            })
            .OrderByDescending(t => t.ThreadCount)
            .ToListAsync();

        return Ok(tags);
    }
}