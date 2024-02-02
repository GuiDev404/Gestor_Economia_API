using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorEconomico.Migrations
{
    public partial class ModelsUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1c82e64a-4113-483b-ab90-8e29bba9a7e6");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "454761c9-a177-4493-972d-7593a319538e", "042f29ea-536e-4565-b526-d5a0cefb89d2" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "454761c9-a177-4493-972d-7593a319538e");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "042f29ea-536e-4565-b526-d5a0cefb89d2");

            migrationBuilder.AddColumn<int>(
                name: "CuentaId",
                table: "Entradas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Emoji",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TipoEntrada",
                table: "Categorias",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioID",
                table: "Categorias",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Cuentas",
                columns: table => new
                {
                    CuentaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UsuarioID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Emoji = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuentas", x => x.CuentaId);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "58290319-85a6-48b8-864f-b6f073943346", "63be5f96-07ec-4f56-8406-3bf6dbb6cf4a", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "9a49deab-ccca-4d62-8cc7-0da581fc803d", "ca3fa9ab-d21c-4d21-a89e-33a4e01ca379", "Usuario", "USUARIO" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RefreshToken", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "e951ce67-c779-467d-99b9-df1fd04737d0", 0, "c784b069-e8d1-44d7-b1d5-0404699b630c", "admin@gestor_economico.com", false, false, null, "ADMIN@GESTOR_ECONOMICO.COM", "ADMIN@GESTOR_ECONOMICO.COM", "AQAAAAEAACcQAAAAEFi8XtW3e8ZouXPAN6PVkEsrTigLFxQLK0ZEPy68OMXB4f0eQgglDbIR9E/u6nTs/g==", null, false, null, "", false, "admin@gestor_economico.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "58290319-85a6-48b8-864f-b6f073943346", "e951ce67-c779-467d-99b9-df1fd04737d0" });

            migrationBuilder.CreateIndex(
                name: "IX_Entradas_CuentaId",
                table: "Entradas",
                column: "CuentaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Entradas_Cuentas_CuentaId",
                table: "Entradas",
                column: "CuentaId",
                principalTable: "Cuentas",
                principalColumn: "CuentaId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entradas_Cuentas_CuentaId",
                table: "Entradas");

            migrationBuilder.DropTable(
                name: "Cuentas");

            migrationBuilder.DropIndex(
                name: "IX_Entradas_CuentaId",
                table: "Entradas");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9a49deab-ccca-4d62-8cc7-0da581fc803d");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "58290319-85a6-48b8-864f-b6f073943346", "e951ce67-c779-467d-99b9-df1fd04737d0" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "58290319-85a6-48b8-864f-b6f073943346");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "e951ce67-c779-467d-99b9-df1fd04737d0");

            migrationBuilder.DropColumn(
                name: "CuentaId",
                table: "Entradas");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "Emoji",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "TipoEntrada",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Categorias");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "1c82e64a-4113-483b-ab90-8e29bba9a7e6", "e3d60b6b-53d9-467d-8329-5e960e96fcab", "Usuario", "USUARIO" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "454761c9-a177-4493-972d-7593a319538e", "2a11ce3f-f11b-4f36-b1c0-23e3610216a6", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RefreshToken", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "042f29ea-536e-4565-b526-d5a0cefb89d2", 0, "fac930b9-76ea-4bbc-95f2-0caa180b7165", "admin@gestor_economico.com", false, false, null, "ADMIN@GESTOR_ECONOMICO.COM", "ADMIN@GESTOR_ECONOMICO.COM", "AQAAAAEAACcQAAAAEPyVl/5MKuP4hiZLI8qv1/uO5jLoLRM9xlP0n2DO875Py6RLn4R20GeJoWVicaYRYw==", null, false, null, "", false, "admin@gestor_economico.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "454761c9-a177-4493-972d-7593a319538e", "042f29ea-536e-4565-b526-d5a0cefb89d2" });
        }
    }
}
