using LoginRegistration.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;

namespace LoginRegistration.Controllers
{
    public class RegisterController : Controller
    {
        QuanLyBanGiayEntities1 db = new QuanLyBanGiayEntities1();
        // GET: Register
        //Phương thức "Index" được sử dụng để hiển thị trang đăng ký.
        public ActionResult Index()
        {
            return View();
        }
        //Phương thức "SaveData" được sử dụng để lưu thông tin người dùng vào cơ sở dữ liệu,
        //xây dựng mẫu email và trả về một thông báo JSON xác nhận đăng ký thành công.
        public JsonResult SaveData(SiteUser model)
        {
            model.IsValid = false;  
            db.SiteUsers.Add(model);
            db.SaveChanges();
            BuildEmailTemplate(model.ID);
            return Json("Registration Successfull", JsonRequestBehavior.AllowGet);
        }
        //Phương thức "Confirm" được sử dụng để hiển thị trang xác nhận đăng ký.
        public ActionResult Confirm(int regId)
        {
            ViewBag.regID = regId;
            return View();
        }
        //Phương thức "RegisterConfirm" được sử dụng để xác nhận đăng ký
        //và trả về một thông báo JSON xác nhận email được xác minh thành công.
        public JsonResult RegisterConfirm(int regId)
        {
            SiteUser Data = db.SiteUsers.Where(x=> x.ID == regId).FirstOrDefault();
            Data.IsValid = true;
            db.SaveChanges();
            var msg = "Your Email Is Verified!";
            return Json(msg, JsonRequestBehavior.AllowGet);
        }
        // Hàm BuildEmailTemplate(int regID) đọc nội dung email từ một tệp template và thay thế đường dẫn xác nhận bằng một URL chứa ID đăng ký của người dùng.
        // Sau đó, nó gọi hàm BuildEmailTemplate() để tạo email.
        private void BuildEmailTemplate(int regID)
        {
            string body = System.IO.File.ReadAllText(HostingEnvironment.MapPath("~/EmailTemplate/") + "Text" + ".cshtml"); 
            var regInfo = db.SiteUsers.Where(x => x.ID == regID).FirstOrDefault();
            var url = "https://localhost:44324" + "/Register/Confirm?regId=" + regID;
            body = body.Replace("@ViewBag.confirmationlink", url);
            body = body.ToString();
            BuildEmailTemplate("Your Account Is Successfully Created", body, regInfo.Email);
        }
        // Hàm BuildEmailTemplate(string subjectText, string bodyText, string SendTo) được sử dụng để tạo email từ thông tin được cung cấp.
        // Nó cấu hình email với các thông tin như địa chỉ email người gửi, địa chỉ email người nhận, tiêu đề và nội dung email. Sau đó, nó gọi hàm SendEmail() để gửi email đi.
        private static void BuildEmailTemplate(string subjectText, string bodyText, string SendTo)
        {
            string from, to, bcc, cc, subject, body;
            from = "sangnguyenhuu1804@gmail.com";
            to = SendTo.Trim();
            bcc = "";
            cc = "";
            subject = subjectText;
            StringBuilder sb = new StringBuilder();
            sb.Append(bodyText);
            body = sb.ToString();
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(from);
            mail.To.Add(new MailAddress(to));
            if(!string.IsNullOrEmpty(bcc))
            {
                mail.Bcc.Add(new MailAddress(bcc));
            }
            if (!string.IsNullOrEmpty(cc))
            {
                mail.CC.Add(new MailAddress(cc));
            }
            mail.Subject= subject;
            mail.Body = body;
            mail.IsBodyHtml= true;
            SendEmail(mail);
        }

        private static void SendEmail(MailMessage mail)
        {
            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials= false;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.Credentials = new System.Net.NetworkCredential("sangnguyenhuu1804@gmail.com", "ndcxwcznrarhfpqa");
            try
            {
                client.Send(mail);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        // Phương thức "CheckValidUser" được sử dụng để kiểm tra tính hợp lệ của người dùng
        // và trả về một thông báo JSON để xác định liệu người dùng có hợp lệ hay không.
        public JsonResult CheckValidUser(SiteUser model)
        {
            string result = "Fail";
            var DataItem = db.SiteUsers.Where(x=>x.Email==model.Email && x.Password ==model.Password).SingleOrDefault();
            if(DataItem!= null)
            {
                Session["UserID"] = DataItem.ID.ToString();
                Session["UserName"] = DataItem.Username.ToString();
                result = "Success";
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        // Phương thức "AfterLogin" được sử dụng để hiển thị trang sau khi đăng nhập thành công
        // hoặc điều hướng trở lại trang đăng nhập nếu người dùng chưa đăng nhập.
        [HttpPost]
        public JsonResult CheckEmail(string username)

        {
            bool result = !db.SiteUsers.ToList().Exists(x => x.Email.Equals(username,StringComparison.CurrentCultureIgnoreCase));
            return Json(result);
        }
        public ActionResult AfterLogin()
        {
            if(Session["UserID"] != null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index");
            }
        }

        //Phương thức "Logout" được sử dụng để xóa các phiên và
        //điều hướng người dùng trở lại trang đăng nhập.
        public ActionResult Logout()
        {
            Session.Clear();
            Session.Abandon();
            
            return RedirectToAction("Index");
            
        }
        public ActionResult CheckEmailExists(string email)
        {
            var user =  db.SiteUsers.FirstOrDefault(u => u.Email == email);

            if (user != null)
            {
                // Email already exists
                return Json("Email đã tồn tại trong cơ sở dữ liệu");
            }

            // Email does not exist
            return Json(true);
        }
        public ActionResult Login(SiteUser user)
        {
            var userExist = db.SiteUsers.FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password && u.IsValid == true);
            if (userExist != null)
            {
                return Json(true);

            }
            else
            {

                return Json("Tên đăng nhập hoặc mật khẩu không đúng hoặc tài khoản của bạn chưa được kích hoạt.");


            }
        }
    }
}