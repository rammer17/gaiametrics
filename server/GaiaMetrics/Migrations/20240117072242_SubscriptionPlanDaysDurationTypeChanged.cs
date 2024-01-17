using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaiaMetrics.Migrations
{
    public partial class SubscriptionPlanDaysDurationTypeChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubscriptionDuration",
                table: "SubscriptionPlans");

            migrationBuilder.AddColumn<int>(
                name: "DaysDuration",
                table: "SubscriptionPlans",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaysDuration",
                table: "SubscriptionPlans");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "SubscriptionDuration",
                table: "SubscriptionPlans",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
