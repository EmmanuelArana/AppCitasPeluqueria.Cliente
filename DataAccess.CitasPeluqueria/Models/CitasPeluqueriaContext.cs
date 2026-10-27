using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Entities.CitasPeluqueria;

namespace Entities.CitasPeluqueria;

public partial class CitasPeluqueriaContext : DbContext
{
    public CitasPeluqueriaContext()
    {
    }

    public CitasPeluqueriaContext(DbContextOptions<CitasPeluqueriaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Citum> Cita { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Especialidad> Especialidad { get; set; }

    public virtual DbSet<Estilistum> Estilista { get; set; }

    public virtual DbSet<VwCitasDetalle> VwCitasDetalles { get; set; }

    // OnConfiguring removed to allow configuration via DI in Program.cs

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Citum>(entity =>
        {
            entity.HasKey(e => e.CitaId);

            entity.HasIndex(e => e.ClienteId, "IX_Cita_ClienteId");

            entity.HasIndex(e => e.EstilistaId, "IX_Cita_EstilistaId");

            entity.HasIndex(e => e.FechaCita, "IX_Cita_FechaCita");

            entity.Property(e => e.Estado).HasDefaultValue((byte)1, "DF_Cita_Estado");
            entity.Property(e => e.FechaCreacion)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_Cita_Fecha");
            entity.Property(e => e.HoraCita).HasPrecision(0);
            entity.Property(e => e.Notas).HasMaxLength(500);

            entity.HasOne(d => d.Cliente).WithMany(p => p.Cita)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cita_Cliente");

            entity.HasOne(d => d.Estilista).WithMany(p => p.Cita)
                .HasForeignKey(d => d.EstilistaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cita_Estilista");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Cliente");

            entity.Property(e => e.Activo).HasDefaultValue(true, "DF_Cliente_Activo");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FechaCreacion)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_Cliente_Fecha");
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.Telefono).HasMaxLength(30);
        });

        modelBuilder.Entity<Especialidad>(entity =>
        {
            entity.ToTable("Especialidad");

            entity.HasIndex(e => e.Nombre, "UQ_Especialidad").IsUnique();

            entity.Property(e => e.Activo).HasDefaultValue(true, "DF_Especialidad_Activo");
            entity.Property(e => e.FechaCreacion)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_Especialidad_Fecha");
            entity.Property(e => e.Nombre).HasMaxLength(100);
        });

        modelBuilder.Entity<Estilistum>(entity =>
        {
            entity.HasKey(e => e.EstilistaId);

            entity.HasIndex(e => e.EspecialidadId, "IX_Estilista_EspecialidadId");

            entity.Property(e => e.Activo).HasDefaultValue(true, "DF_Estilista_Activo");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.FechaCreacion)
                .HasPrecision(0)
                .HasDefaultValueSql("(sysutcdatetime())", "DF_Estilista_Fecha");
            entity.Property(e => e.Nombre).HasMaxLength(150);
            entity.Property(e => e.Telefono).HasMaxLength(30);

            entity.HasOne(d => d.Especialidad).WithMany(p => p.Estilista)
                .HasForeignKey(d => d.EspecialidadId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Estilista_Especialidad");
        });

        modelBuilder.Entity<VwCitasDetalle>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_CitasDetalle");

            entity.Property(e => e.Cliente).HasMaxLength(150);
            entity.Property(e => e.Especialidad).HasMaxLength(100);
            entity.Property(e => e.Estilista).HasMaxLength(150);
            entity.Property(e => e.HoraCita).HasPrecision(0);
            entity.Property(e => e.Notas).HasMaxLength(500);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
