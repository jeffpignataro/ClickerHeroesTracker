﻿namespace Clans {
    "use strict";

    $.ajax({
        url: "/api/clans/leaderboard",
    }).done((response: Array<ILeaderboardClan>) => {
        $("#leaderboard-table").prepend("<tr><th>Rank</th><th>Name</th> <th>Current Raid Level</th></tr>");
        for (let index = 0; index < response.length; ++index)
        {
            const clan = response[index];

            $("#leaderboard-table-body").append("<tr><td>" + (index + 1) + "</td><td>" + clan.name + "</td><td>" + clan.currentRaidLevel + "</td></tr>");
        }
    });

    $.ajax({
        url: "/api/clans",
    }).done((response: IClanData) =>
    {
        $("#clan-name").html(response.clanName);
        $("#clan-members-table").prepend("<tr><th>Name</th> <th>Highest Zone</th></tr>");

        for (let index = 0; index < Object.keys(response.guildMembers).length; ++index)
        {
            $("#clan-members-table-body").append("<tr><td>" + response.guildMembers[index].nickname + "</td><td>" + response.guildMembers[index].highestZone + "</td></tr>");
        }

        for (let index = 0; index < response.messages.length; ++index)
        {
            const message = response.messages[index];
            const minuteInMilliSeconds = 1000 * 60;
            const hourInMilliSeconds = minuteInMilliSeconds * 60;
            const dayInMilliSeconds = hourInMilliSeconds * 24;

            let date1 = new Date(message.date);
            let date2 = new Date();
            let timeDiff = Math.abs(date2.getTime() - date1.getTime());
            let diffDays = Math.ceil(timeDiff / dayInMilliSeconds);

            if (timeDiff > dayInMilliSeconds)
            {
                $("#clan-messages").append("<div class='col-xs-12 clan-message'>(" + diffDays + " days ago) " + message.username + "<br>" + message.content + "</div>");
            }
            else if (timeDiff > hourInMilliSeconds)
            {
                $("#clan-messages").append("<div class='col-xs-12 clan-message'>(" + Math.ceil(timeDiff / hourInMilliSeconds) + " hours ago) " + message.username + "<br>" + message.content + "</div>");
            }
            else if (timeDiff > minuteInMilliSeconds)
            {
                $("#clan-messages").append("<div class='col-xs-12 clan-message'>(" + Math.ceil(timeDiff / minuteInMilliSeconds) + " minutes ago) " + message.username + "<br>" + message.content + "</div>");
            }
            else
            {
                $("#clan-messages").append("<div class='col-xs-12 clan-message'>(" + Math.ceil(timeDiff / 1000) + " seconds ago) " + message.username + "<br>" + message.content + "</div>");
            }
        }

        $("form").append("<input type='hidden' name='clanName' value='" + response.clanName + "' />");
    });

    $("#sendMessage").submit(function (event: JQueryEventObject): boolean
    {
        function handleSuccess(result: string): void
        {
            Helpers.showMessage("Message successfully sent to clan", "success");
        }

        function handleError(xhr: JQueryXHR): void
        {
            Helpers.showMessage("Could not send message to clan", "error");
        }

        const form = event.target as HTMLFormElement;
        console.log($(form).serialize());
        if ($(form).valid())
        {
            $.ajax({
                data: $(form).serialize(),
                error: handleError,
                success: handleSuccess,
                type: form.method,
                url: form.action,
            });
        }

        return false;
    });
}