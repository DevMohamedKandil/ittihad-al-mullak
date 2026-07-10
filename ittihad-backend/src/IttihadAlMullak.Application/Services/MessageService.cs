using IttihadAlMullak.Application.Common;
using IttihadAlMullak.Application.Dtos;
using IttihadAlMullak.Application.Interfaces;
using IttihadAlMullak.Domain;
using IttihadAlMullak.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IttihadAlMullak.Application.Services;

public class MessageService(IApplicationDbContext db, ICurrentUser currentUser) : IMessageService
{
    public async Task<IReadOnlyList<ConversationDto>> MyConversationsAsync(CancellationToken ct = default)
    {
        var conversations = await db.Conversations
            .Include(c => c.Participants).ThenInclude(p => p.User)
            .Include(c => c.Messages)
            .Where(c => c.BuildingId == currentUser.BuildingId
                && (c.IsGroup || c.Participants.Any(p => p.UserId == currentUser.UserId)))
            .ToListAsync(ct);

        return conversations
            .Select(ToDto)
            .OrderByDescending(c => c.LastMessageAt ?? DateTime.MinValue)
            .ToList();
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessagesAsync(int conversationId, CancellationToken ct = default)
    {
        var conversation = await FindAsync(conversationId, ct);

        // تعليم رسائل الطرف الآخر كمقروءة
        var unread = conversation.Messages
            .Where(m => m.SenderId != currentUser.UserId && m.ReadAt is null)
            .ToList();
        foreach (var message in unread) message.ReadAt = DateTime.UtcNow;
        if (unread.Count > 0) await db.SaveChangesAsync(ct);

        return conversation.Messages
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageDto(m.Id, m.SenderId, m.Sender?.Name ?? string.Empty, m.Content, m.SentAt, m.SenderId == currentUser.UserId))
            .ToList();
    }

    public async Task<MessageDto> SendAsync(int conversationId, SendMessageRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new BusinessRuleException(Msg.Get("EmptyMessage"));

        var conversation = await FindAsync(conversationId, ct);
        var message = new Message
        {
            ConversationId = conversation.Id,
            SenderId = currentUser.UserId,
            Content = request.Content.Trim(),
        };
        db.Messages.Add(message);
        await db.SaveChangesAsync(ct);

        var sender = await db.Users.FirstAsync(u => u.Id == currentUser.UserId, ct);
        return new MessageDto(message.Id, message.SenderId, sender.Name, message.Content, message.SentAt, true);
    }

    public async Task<ConversationDto> StartAsync(StartConversationRequest request, CancellationToken ct = default)
    {
        // الافتراضي: محادثة مباشرة مع أول أدمن في العمارة
        var otherUserId = request.ParticipantUserId
            ?? await db.Users
                .Where(u => u.BuildingId == currentUser.BuildingId && u.Role == UserRole.Admin && u.IsActive)
                .Select(u => u.Id)
                .FirstOrDefaultAsync(ct);

        if (otherUserId == 0 || otherUserId == currentUser.UserId)
            throw new BusinessRuleException(Msg.Get("NoCounterpart"));

        var existing = await db.Conversations
            .Include(c => c.Participants).ThenInclude(p => p.User)
            .Include(c => c.Messages)
            .FirstOrDefaultAsync(c => !c.IsGroup
                && c.BuildingId == currentUser.BuildingId
                && c.Participants.Any(p => p.UserId == currentUser.UserId)
                && c.Participants.Any(p => p.UserId == otherUserId), ct);
        if (existing is not null) return ToDto(existing);

        var conversation = new Conversation
        {
            BuildingId = currentUser.BuildingId,
            IsGroup = false,
            Participants =
            [
                new ConversationParticipant { UserId = currentUser.UserId },
                new ConversationParticipant { UserId = otherUserId },
            ],
        };
        db.Conversations.Add(conversation);
        await db.SaveChangesAsync(ct);

        var created = await FindAsync(conversation.Id, ct);
        return ToDto(created);
    }

    private async Task<Conversation> FindAsync(int id, CancellationToken ct)
    {
        var conversation = await db.Conversations
            .Include(c => c.Participants).ThenInclude(p => p.User)
            .Include(c => c.Messages).ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(c => c.Id == id && c.BuildingId == currentUser.BuildingId, ct)
            ?? throw new NotFoundException(Msg.Get("ConversationNotFound"));

        if (!conversation.IsGroup && conversation.Participants.All(p => p.UserId != currentUser.UserId))
            throw new ForbiddenException(Msg.Get("NotYourConversation"));

        return conversation;
    }

    private ConversationDto ToDto(Conversation c)
    {
        var last = c.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
        var name = c.IsGroup
            ? c.Name ?? "مجموعة العمارة"
            : c.Participants.FirstOrDefault(p => p.UserId != currentUser.UserId)?.User?.Name ?? "محادثة";
        var unread = c.Messages.Count(m => m.SenderId != currentUser.UserId && m.ReadAt is null);
        return new ConversationDto(c.Id, name, c.IsGroup, last?.Content, last?.SentAt, unread);
    }
}
