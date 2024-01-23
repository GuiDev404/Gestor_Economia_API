using GestorEconomico.Intefaces;

namespace PromiedosAPI.Helpers;

public static class ConvertFormFile
{
  public static (byte[]? File, string FileType, string Filename) FormFileToBinary(IFormFile? file, string[]? whiteListMimeTypes)
  {
    bool validType = true;
    if(file != null && whiteListMimeTypes != null){
      validType = whiteListMimeTypes.Any(mime=> file.ContentType.Contains(mime));
    }

    byte[]? archivoBinario = null;
    string fileType = "";
    string filename = "";

    if (file != null && file.Length > 0 && validType)
    {
      using (var fs1 = file.OpenReadStream())
      using (var ms1 = new MemoryStream())
      {
        fs1.CopyTo(ms1);
        archivoBinario = ms1.ToArray();
      }

      fileType = file.ContentType;
      filename = file.FileName;
    }

    return (archivoBinario, fileType, filename);
  }
}