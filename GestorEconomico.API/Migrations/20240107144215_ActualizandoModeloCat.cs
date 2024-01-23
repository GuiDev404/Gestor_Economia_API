using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorEconomico.Migrations
{
    public partial class ActualizandoModeloCat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Descripcion",
                table: "Categorias");

            migrationBuilder.RenameColumn(
                name: "Cancelada",
                table: "Entradas",
                newName: "Eliminada");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminada",
                table: "Categorias",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Nombre",
                table: "Categorias",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminada",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Nombre",
                table: "Categorias");

            migrationBuilder.RenameColumn(
                name: "Eliminada",
                table: "Entradas",
                newName: "Cancelada");

            migrationBuilder.AddColumn<string>(
                name: "Descripcion",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
