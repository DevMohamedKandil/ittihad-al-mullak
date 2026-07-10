using IttihadAlMullak.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace IttihadAlMullak.Api.Middleware;

/// <summary>تحويل استثناءات البيزنس لأكواد HTTP + رسائل عربية موحدة (ProblemDetails).</summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            var (status, title) = exception switch
            {
                NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
                BusinessRuleException => (StatusCodes.Status400BadRequest, exception.Message),
                ForbiddenException => (StatusCodes.Status403Forbidden, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, Msg.Get("UnexpectedError")),
            };

            if (status == StatusCodes.Status500InternalServerError)
                logger.LogError(exception, "Unhandled exception");

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/problem+json; charset=utf-8";
            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = status,
                Title = title,
            });
        }
    }
}
