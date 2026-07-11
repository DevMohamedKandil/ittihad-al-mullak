using System.ComponentModel.DataAnnotations;
using IttihadAlMullak.Domain;

namespace IttihadAlMullak.Application.Dtos;

public record LoginRequest([Required] string Phone, [Required] string Password);

public record RefreshRequest([Required] string RefreshToken);

public record ChangePasswordRequest([Required] string CurrentPassword, [Required, MinLength(6)] string NewPassword);

public record RegisterDeviceRequest([Required] string Token, [Required] string Platform);

public record UserDto(
    int Id,
    string Name,
    string Phone,
    string? Email,
    UserRole Role,
    bool IsActive,
    int? BuildingId,
    DateTime CreatedAt);

public record AuthResponse(string AccessToken, string RefreshToken, UserDto User);

public record BuildingSummaryDto(int Id, string Code, string Name);

public record SwitchBuildingRequest([Required] int BuildingId);

public record RequestOtpRequest([Required] string Phone, OtpChannel Channel = OtpChannel.Sms);

public record VerifyOtpRequest([Required] string Phone, [Required, MinLength(4)] string Code);
