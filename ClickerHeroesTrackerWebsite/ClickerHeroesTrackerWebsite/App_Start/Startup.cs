﻿// <copyright file="Startup.cs" company="Clicker Heroes Tracker">
// Copyright (c) Clicker Heroes Tracker. All rights reserved.
// </copyright>

namespace ClickerHeroesTrackerWebsite
{
    using System.Web.Http;
    using ClickerHeroesTrackerWebsite.Instrumentation;
    using ClickerHeroesTrackerWebsite.Unity;
    using Microsoft.Practices.Unity;
    using Models.Settings;
    using Owin;

    /// <summary>
    /// Startup class used by Owin.
    /// </summary>
    public partial class Startup
    {
        /// <summary>
        /// Startup configuration. Called by Owin.
        /// </summary>
        /// <param name="app">The Owin app builder</param>
        public void Configuration(IAppBuilder app)
        {
            var container = ConfigureContainer();

            // Needs to run first (and last) as it will end up disposing all objects using OwinContextLifetimeManager
            app.Use<UnityPerOwinContextOwinMiddleware>();

            // We want to start measuring latency as soon as possible during a request.
            app.Use<UnityOwinMiddleware<MeasureLatencyMiddleware>>(container);

            // Auth middleware. Needs to be added before any middleware that uses the user.
            ConfigureAuth(app);

            // Instrument the user as soon as they're auth'd.
            app.Use<UnityOwinMiddleware<UserInstrumentationMiddleware>>(container);

            // Flush any changes to user settings
            app.Use<UnityOwinMiddleware<UserSettingsFlushingMiddleware>>(container);

            // Routing middleware
            ConfigureWebApi(app, container.Resolve<HttpConfiguration>());
        }
    }
}
