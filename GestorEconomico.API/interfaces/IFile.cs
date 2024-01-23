namespace GestorEconomico.Intefaces
{
    public interface IFile
    {
        byte[]? File { get; set; }

        string? FileType { get; set; }
        string? Filename { get; set; }
    }
}