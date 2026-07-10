using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IttihadAlMullak.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMaintenancePhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Photos",
                table: "MaintenanceRequests",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photos",
                table: "MaintenanceRequests");
        }
    }
}
