using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Controllers;

[ApiController]
[Route("api/v1/conversations")]
[Authorize]
public class ConversationsController(IMessageService messages) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<ConversationDto>> Mine(CancellationToken ct)
        => messages.MyConversationsAsync(ct);

    /// <summary>بدء محادثة مباشرة — ParticipantUserId = null يعني مع الإدارة.</summary>
    [HttpPost]
    public Task<ConversationDto> Start(StartConversationRequest request, CancellationToken ct)
        => messages.StartAsync(request, ct);

    [HttpGet("{id:int}/messages")]
    public Task<IReadOnlyList<MessageDto>> Messages(int id, CancellationToken ct)
        => messages.GetMessagesAsync(id, ct);

    [HttpPost("{id:int}/messages")]
    public Task<MessageDto> Send(int id, SendMessageRequest request, CancellationToken ct)
        => messages.SendAsync(id, request, ct);
}
