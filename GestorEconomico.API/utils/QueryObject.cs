
namespace GestorEconomico.API.Utils
{
    public class QueryObject
    {
        public DateTime? DateInit { get; set; } = null;
        public DateTime? DateEnd { get; set; } = null;
        public string? SortBy { get; set; } = null;
        public bool IsDescending { get; set; } = false;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}