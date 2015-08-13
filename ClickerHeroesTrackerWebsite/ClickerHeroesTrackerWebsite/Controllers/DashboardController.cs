﻿namespace ClickerHeroesTrackerWebsite.Controllers
{
    using Models.Dashboard;
    using System.Web.Mvc;

    [Authorize]
    public class DashboardController : Controller
    {
        public ActionResult Index()
        {
            var model = new DashboardViewModel(this.User);
            if (!model.IsValid)
            {
                this.ViewBag.ErrorMessage = "You have no uploaded data!";
                return View("Error");
            }

            return View(model);
        }

        public ActionResult Progress()
        {
            var model = new ProgressViewModel(this.User);
            if (!model.IsValid)
            {
                this.ViewBag.ErrorMessage = "You have no uploaded data!";
                return View("Error");
            }

            return View(model);
        }
    }
}