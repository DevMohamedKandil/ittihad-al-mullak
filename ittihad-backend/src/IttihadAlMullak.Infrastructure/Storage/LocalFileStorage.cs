using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace IttihadAlMullak.Infrastructure.Storage;

/// <summary>
/// تخزين محلي داخل فولدر المشروع (wwwroot/uploads) — معزول تماماً عن السيرفر.
/// لما نيجي ننشر على cloud نستبدله بتنفيذ تاني لنفس الـ interface (S3/Azure Blob).
/// </summary>
public class LocalFileStorage(IConfiguration configuration) : IFileStorage
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxSizeBytes = 5 * 1024 * 1024; // 5MB

    public async Task<string> SaveAsync(Stream content, string originalFileName, CancellationToken ct = default)
    {
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new BusinessRuleException(Msg.Get("UnsupportedFileType"));
        if (content.CanSeek && content.Length > MaxSizeBytes)
            throw new BusinessRuleException(Msg.Get("FileTooLarge"));

        var root = configuration["Storage:Root"] ?? "wwwroot";
        var uploadsDir = Path.Combine(root, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsDir, fileName);
        await using var file = File.Create(fullPath);
        await content.CopyToAsync(file, ct);

        return $"/uploads/{fileName}";
    }
}
