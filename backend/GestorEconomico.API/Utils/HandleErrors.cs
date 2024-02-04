using Microsoft.AspNetCore.Mvc;

namespace GestorEconomico.API.Utils {
  public static class HandleErrors {
    public static ProblemDetails SetContext (string title, string? detail = null){
      var problemDetails = new ProblemDetails { Title = title };

      if(detail != null){
        problemDetails.Detail = detail;
      }
      
      return problemDetails;
    }
  }
}