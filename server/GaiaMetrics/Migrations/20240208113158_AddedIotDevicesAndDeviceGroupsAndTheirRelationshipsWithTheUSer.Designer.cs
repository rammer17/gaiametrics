﻿// <auto-generated />
using System;
using GaiaMetrics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GaiaMetrics.Migrations
{
    [DbContext(typeof(GaiaMetricsDbContext))]
    [Migration("20240208113158_AddedIotDevicesAndDeviceGroupsAndTheirRelationshipsWithTheUSer")]
    partial class AddedIotDevicesAndDeviceGroupsAndTheirRelationshipsWithTheUSer
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.25")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("DeviceGroupUser", b =>
                {
                    b.Property<int>("DeviceGroupsId")
                        .HasColumnType("int");

                    b.Property<int>("UsersId")
                        .HasColumnType("int");

                    b.HasKey("DeviceGroupsId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("DeviceGroupUser");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Claim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Claims");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Contributor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<double>("Balance")
                        .HasColumnType("float");

                    b.Property<bool>("IsTrusted")
                        .HasColumnType("bit");

                    b.Property<int?>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique()
                        .HasFilter("[UserId] IS NOT NULL");

                    b.ToTable("Contributors");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.DeviceGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("DeviceGroups");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.IoTDevice", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("DeviceGroupId")
                        .HasColumnType("int");

                    b.Property<int>("Latitude")
                        .HasColumnType("int");

                    b.Property<int>("Longtitude")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("DeviceGroupId");

                    b.ToTable("IoTDevices");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Role", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.RoleClaim", b =>
                {
                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<int>("ClaimId")
                        .HasColumnType("int");

                    b.HasKey("RoleId", "ClaimId");

                    b.HasIndex("ClaimId");

                    b.ToTable("RoleClaims");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.SubscriptionPlan", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("DaysDuration")
                        .HasColumnType("int");

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("SubscriptionPlans");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTime>("DateLockedTo")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LoginAttemptCount")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("SubscriptionExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("SubscriptionPlanId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.HasIndex("SubscriptionPlanId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DeviceGroupUser", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.DeviceGroup", null)
                        .WithMany()
                        .HasForeignKey("DeviceGroupsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GaiaMetrics.Models.DB.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Contributor", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.User", "User")
                        .WithOne("Contributor")
                        .HasForeignKey("GaiaMetrics.Models.DB.Contributor", "UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.IoTDevice", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.DeviceGroup", "DeviceGroup")
                        .WithMany("Devices")
                        .HasForeignKey("DeviceGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeviceGroup");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.RoleClaim", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.Claim", "Claim")
                        .WithMany("RoleClaims")
                        .HasForeignKey("ClaimId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GaiaMetrics.Models.DB.Role", "Role")
                        .WithMany("RoleClaims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Claim");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.User", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GaiaMetrics.Models.DB.SubscriptionPlan", "SubscriptionPlan")
                        .WithMany("Users")
                        .HasForeignKey("SubscriptionPlanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("SubscriptionPlan");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Claim", b =>
                {
                    b.Navigation("RoleClaims");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.DeviceGroup", b =>
                {
                    b.Navigation("Devices");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Role", b =>
                {
                    b.Navigation("RoleClaims");

                    b.Navigation("Users");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.SubscriptionPlan", b =>
                {
                    b.Navigation("Users");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.User", b =>
                {
                    b.Navigation("Contributor");
                });
#pragma warning restore 612, 618
        }
    }
}
