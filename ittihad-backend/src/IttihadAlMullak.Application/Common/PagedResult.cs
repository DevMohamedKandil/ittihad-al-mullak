namespace IttihadAlMullak.Application.Common;

public record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);

public class NotFoundException(string message) : Exception(message);

public class BusinessRuleException(string message) : Exception(message);

public class ForbiddenException(string message) : Exception(message);
