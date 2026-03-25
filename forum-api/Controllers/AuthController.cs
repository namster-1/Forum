using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using forum_api.Data;
using forum_api.DTOs;
using forum_api.Models;
using forum_api.Services;

namespace forum_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
public async Task<IActionResult> Register(RegisterDto dto)
{
    if (string.IsNullOrWhiteSpace(dto.Username) || dto.Username.Length < 3 || dto.Username.Length > 30)
        return BadRequest("Username must be between 3 and 30 characters.");

    if (string.IsNullOrWhiteSpace(dto.Email) || !dto.Email.Contains('@'))
        return BadRequest("Invalid email address.");

    if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
        return BadRequest("Password must be at least 8 characters.");

    if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        return BadRequest("Email is already taken.");

    if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        return BadRequest("Username is already taken.");

    var user = new User
    {
        Username = dto.Username,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
    };

        _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var token = _tokenService.GenerateToken(user);

    return Ok(new AuthResponseDto
    {
        Token = token,
        Username = user.Username,
        Email = user.Email
    });
}

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        var token = _tokenService.GenerateToken(user);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email
        });
    }
}