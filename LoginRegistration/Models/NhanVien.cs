namespace LoginRegistration.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("NhanVien")]
    public partial class NhanVien
    {
        public long Id { get; set; }

        [Required]
        [StringLength(200)]
        [Display(Name = "Họ và tên")]
        public string HoVaTen { get; set; }
        [Display(Name = "Giới tính")]
        public bool GioiTinh { get; set; }

        [StringLength(200)]
        [Display(Name = "Địa chỉ Email")]
        public string Email { get; set; }

        [StringLength(20)]
        [Display(Name = "Số điện thoại")]
        public string SoDienThoai { get; set; }

        [StringLength(200)]
        [Display(Name = "Số căn cước")]
        public string SoCanCuoc { get; set; }

        [StringLength(200)]
        [Display(Name = "Tên đăng nhập")]
        public string TenDangNhap { get; set; }

        [StringLength(200)]
        [Display(Name = "Mật khẩu")]
        public string MatKhau { get; set; }
        [Display(Name = "Chức vụ")]
        public long? IdChucVu { get; set; }
        [Display(Name = "Là quản trị viên")]
        public bool LaQuanTri { get; set; }
        [Display(Name = "Là chuyên viên")]
        public bool LaChuyenVien { get; set; }
        [Display(Name = "Chức nhân viên")]
        public bool LaNhanVien { get; set; }

        public virtual ChucVu ChucVu { get; set; }
    }
}
