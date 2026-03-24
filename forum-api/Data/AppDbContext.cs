using Microsoft.EntityFrameworkCore;
using forum_api.Models;

namespace forum_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<ForumThread> Threads { get; set; }
    public DbSet<Reply> Replies { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<ThreadTag> ThreadTags { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ThreadTag>()
            .HasKey(tt => new { tt.ThreadId, tt.TagId });

        modelBuilder.Entity<ForumThread>()
            .HasOne(t => t.User)
            .WithMany(u => u.Threads)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ForumThread>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Threads)
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reply>()
            .HasOne(r => r.User)
            .WithMany(u => u.Replies)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Reply>()
            .HasOne(r => r.Thread)
            .WithMany(t => t.Replies)
            .HasForeignKey(r => r.ThreadId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ThreadTag>()
            .HasOne(tt => tt.Thread)
            .WithMany(t => t.ThreadTags)
            .HasForeignKey(tt => tt.ThreadId);

        modelBuilder.Entity<ThreadTag>()
            .HasOne(tt => tt.Tag)
            .WithMany(t => t.ThreadTags)
            .HasForeignKey(tt => tt.TagId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<Tag>()
            .HasIndex(t => t.Name)
            .IsUnique();
    }
}