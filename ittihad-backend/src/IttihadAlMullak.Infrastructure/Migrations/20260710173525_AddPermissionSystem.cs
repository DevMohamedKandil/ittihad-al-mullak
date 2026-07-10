using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IttihadAlMullak.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPermissionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PermissionActions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    NameAr = table.Column<string>(type: "TEXT", nullable: false),
                    NameEn = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermissionActions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Screens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    NameAr = table.Column<string>(type: "TEXT", nullable: false),
                    NameEn = table.Column<string>(type: "TEXT", nullable: false),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Screens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Role = table.Column<int>(type: "INTEGER", nullable: false),
                    ScreenId = table.Column<int>(type: "INTEGER", nullable: false),
                    ActionId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RolePermissions_PermissionActions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "PermissionActions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Screens_ScreenId",
                        column: x => x.ScreenId,
                        principalTable: "Screens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PermissionActions_Key",
                table: "PermissionActions",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_ActionId",
                table: "RolePermissions",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_Role_ScreenId_ActionId",
                table: "RolePermissions",
                columns: new[] { "Role", "ScreenId", "ActionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_ScreenId",
                table: "RolePermissions",
                column: "ScreenId");

            migrationBuilder.CreateIndex(
                name: "IX_Screens_Key",
                table: "Screens",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "PermissionActions");

            migrationBuilder.DropTable(
                name: "Screens");
        }
    }
}
