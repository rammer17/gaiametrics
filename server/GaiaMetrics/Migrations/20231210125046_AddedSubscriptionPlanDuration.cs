﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GaiaMetrics.Migrations
{
    public partial class AddedSubscriptionPlanDuration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "SubscriptionPlans",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "SubscriptionPlans");
        }
    }
}
