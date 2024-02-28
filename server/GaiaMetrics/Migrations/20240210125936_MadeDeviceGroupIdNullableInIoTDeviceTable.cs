using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaiaMetrics.Migrations
{
    public partial class MadeDeviceGroupIdNullableInIoTDeviceTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IoTDevices_DeviceGroups_DeviceGroupId",
                table: "IoTDevices");

            migrationBuilder.AlterColumn<double>(
                name: "Longtitude",
                table: "IoTDevices",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "IoTDevices",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DeviceGroupId",
                table: "IoTDevices",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_IoTDevices_DeviceGroups_DeviceGroupId",
                table: "IoTDevices",
                column: "DeviceGroupId",
                principalTable: "DeviceGroups",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IoTDevices_DeviceGroups_DeviceGroupId",
                table: "IoTDevices");

            migrationBuilder.AlterColumn<int>(
                name: "Longtitude",
                table: "IoTDevices",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "Latitude",
                table: "IoTDevices",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<int>(
                name: "DeviceGroupId",
                table: "IoTDevices",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_IoTDevices_DeviceGroups_DeviceGroupId",
                table: "IoTDevices",
                column: "DeviceGroupId",
                principalTable: "DeviceGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
