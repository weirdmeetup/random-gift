var entries = [];
var slotItem = "";

var loadEntries = function (csvText) {
    entries = csvText.split(/\n/);
}

var shuffle = function (arry) {
    var i, j, tmp;

    for (i = 0; i < arry.length; i++) {
        j = Math.floor(Math.random() * i);
        tmp = arry[i];
        arry[i] = arry[j];
        arry[j] = tmp;
    }
}

var loadSlot = function (winnerSlot){
    shuffle(entries);

    for (var i = 0; i < entries.length && i < 33; i++) {
        winnerSlot.append('<div class="entry">' + entries[i] + '</div>');
    }
}

var spinSlot = function (winnerSlot){
    var marginTop
        = parseInt(winnerSlot.css("margin-top"))
        - (17 * 25);

    winnerSlot.animate(
        {
            "margin-top": marginTop + "px"
        },
        {
            "duration": 10000,
            "easing": "easeOutElastic"
        }
    );
}

var addEntry = function () {
    $("#slots").append(slotItem);

    bindSpinButton();
}

// TODO: 여기 냄새남..
var bindSpinButton = function () {
    $(".spin-button").click(function () {
        var slot = $(this).parent().parent();
        var winner = slot.find(".wrapper");

        loadSlot(winner);
        spinSlot(winner);
    });
};

$(document).ready(function () {
    slotItem = $("#slots").html();

    $(".load-button").click(function () {
        loadEntries($("#entries").val());

        $("#prepare-area").hide("fast");
        $("#slots").show("fast");
        $("#add-entry").show("fast");

        addEntry();
    });

    $("#add-entry").click(addEntry);
});
