using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaiaMetrics.Migrations
{
    public partial class test : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Data",
                table: "IoTDevices");

            migrationBuilder.CreateTable(
                name: "IoTDevicesData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    IoTDeviceId = table.Column<int>(type: "int", nullable: false),
                    DataType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataValue = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IoTDevicesData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IoTDevicesData_IoTDevices_IoTDeviceId",
                        column: x => x.IoTDeviceId,
                        principalTable: "IoTDevices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IoTDevicesData_IoTDeviceId",
                table: "IoTDevicesData",
                column: "IoTDeviceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IoTDevicesData");

            migrationBuilder.AddColumn<string>(
                name: "Data",
                table: "IoTDevices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
