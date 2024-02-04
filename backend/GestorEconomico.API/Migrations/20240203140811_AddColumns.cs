using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestorEconomico.Migrations
{
    public partial class AddColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<bool>(
                name: "Eliminada",
                table: "Cuentas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "18abe416-d7b6-4f2d-8d9c-f964bb52e805", "845774a0-cbe8-448e-8753-74fc515b3554", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "26f01036-4204-459c-b89c-ad1750110b3b", "c1cca31d-f640-4aa0-b6c5-931b674d5723", "Usuario", "USUARIO" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "RefreshToken", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "36edc13d-bbf6-433d-96ae-36f60dd06163", 0, "4a6fd509-d9fc-4963-8f13-6a1dd90f5df4", "admin@gestor_economico.com", false, false, null, "ADMIN@GESTOR_ECONOMICO.COM", "ADMIN@GESTOR_ECONOMICO.COM", "AQAAAAEAACcQAAAAEBklXI04mRwMFa+cj3WTYh+rzzT+FxyFCMvCkqYtsM0Yo7Gsp1SRmEBC96W624+ukw==", null, false, null, "", false, "admin@gestor_economico.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[] { "18abe416-d7b6-4f2d-8d9c-f964bb52e805", "36edc13d-bbf6-433d-96ae-36f60dd06163" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "26f01036-4204-459c-b89c-ad1750110b3b");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "18abe416-d7b6-4f2d-8d9c-f964bb52e805", "36edc13d-bbf6-433d-96ae-36f60dd06163" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "18abe416-d7b6-4f2d-8d9c-f964bb52e805");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "36edc13d-bbf6-433d-96ae-36f60dd06163");

            migrationBuilder.DropColumn(
                name: "Eliminada",
                table: "Cuentas");

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
        }
    }
}
