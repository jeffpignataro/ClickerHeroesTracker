﻿// <copyright file="HeroLevelSummaryViewModel.cs" company="Clicker Heroes Tracker">
// Copyright (c) Clicker Heroes Tracker. All rights reserved.
// </copyright>

namespace ClickerHeroesTrackerWebsite.Models.Calculator
{
    using System.Collections.Generic;
    using ClickerHeroesTrackerWebsite.Models.SaveData;
    using Game;
    using Microsoft.ApplicationInsights;

    /// <summary>
    /// The model for the hero level summary view.
    /// </summary>
    public class HeroLevelSummaryViewModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="HeroLevelSummaryViewModel"/> class.
        /// </summary>
        public HeroLevelSummaryViewModel(
            GameData gameData,
            HeroesData heroesData,
            TelemetryClient telemetryClient)
        {
            var heroGilds = new List<KeyValuePair<string, string>>(heroesData.Heroes.Count);
            foreach (var heroData in heroesData.Heroes.Values)
            {
                Hero hero;
                if (!gameData.Heroes.TryGetValue(heroData.Id, out hero))
                {
                    telemetryClient.TrackEvent("Unknown hero", new Dictionary<string, string> { { "HeroId", heroData.Id.ToString() } });
                    continue;
                }

                // No need to show heroes with 0 gilds
                if (heroData.Gilds > 0)
                {
                    heroGilds.Add(new KeyValuePair<string, string>(hero.Name, heroData.Gilds.ToString()));
                }
            }

            this.HeroGilds = heroGilds;
        }

        /// <summary>
        /// Gets a list of heros with their formatted number of gilds.
        /// </summary>
        public IList<KeyValuePair<string, string>> HeroGilds { get; }
    }
}