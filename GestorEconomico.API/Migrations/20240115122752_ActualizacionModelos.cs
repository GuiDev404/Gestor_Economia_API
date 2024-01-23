using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorEconomico.Migrations
{
    public partial class ActualizacionModelos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NombreArchivo",
                table: "Entradas",
                newName: "Filename");

            migrationBuilder.RenameColumn(
                name: "MimeTypeComprobante",
                table: "Entradas",
                newName: "FileType");

            migrationBuilder.RenameColumn(
                name: "Comprobante",
                table: "Entradas",
                newName: "File");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioID",
                table: "Entradas",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Entradas");

            migrationBuilder.RenameColumn(
                name: "Filename",
                table: "Entradas",
                newName: "NombreArchivo");

            migrationBuilder.RenameColumn(
                name: "FileType",
                table: "Entradas",
                newName: "MimeTypeComprobante");

            migrationBuilder.RenameColumn(
                name: "File",
                table: "Entradas",
                newName: "Comprobante");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
