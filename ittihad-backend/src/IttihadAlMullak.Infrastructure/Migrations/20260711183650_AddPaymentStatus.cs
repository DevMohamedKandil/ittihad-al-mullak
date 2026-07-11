using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IttihadAlMullak.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // defaultValue = 2 (PaymentStatus.Completed) — كل الدفعات القديمة كانت دايمًا مؤكدة فورًا
            // قبل إضافة الحالة دي؛ الافتراضي 0 مش قيمة صالحة في الـ enum (بيبدأ من 1) وكان هيخلي
            // كل الفواتير القديمة تظهر "غير مدفوعة" غلط.
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Payments");
        }
    }
}
