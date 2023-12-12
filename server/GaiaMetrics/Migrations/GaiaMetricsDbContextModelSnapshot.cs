﻿// <auto-generated />
using System;
using GaiaMetrics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GaiaMetrics.Migrations
{
    [DbContext(typeof(GaiaMetricsDbContext))]
    partial class GaiaMetricsDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.25")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

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

                    b.ToTable("Contributors", (string)null);
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.SubscriptionPlan", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<double>("Price")
                        .HasColumnType("float");

                    b.Property<TimeSpan>("SubscriptionDuration")
                        .HasColumnType("time");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("SubscriptionPlans", (string)null);
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

                    b.Property<DateTime?>("SubscriptionExpiryTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("SubscriptionPlanId")
                        .HasColumnType("int");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("SubscriptionPlanId");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.Contributor", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.User", "User")
                        .WithOne("Contributor")
                        .HasForeignKey("GaiaMetrics.Models.DB.Contributor", "UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("GaiaMetrics.Models.DB.User", b =>
                {
                    b.HasOne("GaiaMetrics.Models.DB.SubscriptionPlan", "SubscriptionPlan")
                        .WithMany("Users")
                        .HasForeignKey("SubscriptionPlanId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("SubscriptionPlan");
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
