using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using forum_api.Data;
using forum_api.DTOs;

namespace forum_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                Description = c.Description,
                ThreadCount = c.Threads.Count
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Icon = c.Icon,
                Description = c.Description,
                ThreadCount = c.Threads.Count
            })
            .FirstOrDefaultAsync();

        if (category == null) return NotFound();

        return Ok(category);
    }
}