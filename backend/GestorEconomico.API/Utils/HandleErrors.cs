using System.Net;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Core.Types;

namespace GestorEconomico.API.Utils
{
  public static class HandleErrors
  {
    public static ObjectResult ErrorAPI(string title, List<(string, string)> errors, int status = 400, string? detail = null)
    {
      ProblemDetails problemDetails = new ()
      {
        Title = title,
        Detail = detail,
        Status = status,
      };

      if (errors.Any()) {
        problemDetails.Extensions
          .Add("errors", errors.ToDictionary(error => error.Item1, error => error.Item2));
      }

      return new ObjectResult(problemDetails);
    }

    public static ProblemDetails SetContext(string title, string? detail = null)
    {

      var problemDetails = new ProblemDetails { Title = title };

      if (detail != null)
      {
        problemDetails.Detail = detail;
      }

      return problemDetails;
    }
  }

  public static class LikeModelError
  {
    public static SerializableError SetError(string modelName, string message)
    {
      return new SerializableError { { modelName, message } };
    }
  }
}