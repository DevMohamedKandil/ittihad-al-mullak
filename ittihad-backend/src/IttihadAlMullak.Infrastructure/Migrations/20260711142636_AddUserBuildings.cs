using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IttihadAlMullak.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserBuildings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActiveBuildingId",
                table: "RefreshTokens",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UserBuildings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BuildingId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBuildings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBuildings_Buildings_BuildingId",
                        column: x => x.BuildingId,
                        principalTable: "Buildings",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UserBuildings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserBuildings_BuildingId",
                table: "UserBuildings",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBuildings_UserId_BuildingId",
                table: "UserBuildings",
                columns: new[] { "UserId", "BuildingId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserBuildings");

            migrationBuilder.DropColumn(
                name: "ActiveBuildingId",
                table: "RefreshTokens");
        }
    }
}
