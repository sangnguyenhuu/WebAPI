using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace LoginRegistration.Models
{
    public partial class DBNhanVienContext : DbContext
    {
        public DBNhanVienContext()
            : base("name=DBNhanVienConnectionString")
        {
        }

        public virtual DbSet<ChucVu> ChucVus { get; set; }
        public virtual DbSet<NhanVien> NhanViens { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChucVu>()
                .HasMany(e => e.NhanViens)
                .WithOptional(e => e.ChucVu)
                .HasForeignKey(e => e.IdChucVu);
        }
    }
}
