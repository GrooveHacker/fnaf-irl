const game = {
    addr: `ws://${window.location.host}/game`,
    socket: null,
    poll: function() {
        this.socket = new WebSocket(this.addr);
        this.connect();
    },
    connect: function() {
        $(this.socket).on("open", function() {
            let data = JSON.stringify(["remote"])
            this.send(data);
        });
        
        $(this.socket).on("message", function(event) {
            let data = JSON.parse(event.originalEvent.data);
        
            switch (data[0]) {
                case "repaired":
                    $(".big_button.repair").removeAttr("data-active");
                    $(".big_button.repair").text("REPAIR");
                    break;
                case "attacked":
                    $(".big_button.attack").removeAttr("data-active");
                    break;
            }
        });

        let poll_timeout = null;
        
        $(this.socket).on("close error", () => {
            clearTimeout(poll_timeout);
            poll_timeout = setTimeout(() => {
                this.poll();
            }, 3000);
        });
    }
}

$(".big_button.repair").on("click", function() {
    if ($(this).is("[data-active]")) return;

    let time = (Math.floor(Math.random() * 3) + 2) * 1000;
    $(this).text("REPAIRING");

    game.socket.send(JSON.stringify(["repairing"]));

    setTimeout(() => {
        game.socket.send(JSON.stringify(["repaired"]));
    }, time);
})

$(".big_button").on("click", function() {
    $(this).attr("data-active", "");
})

$(".big_button.attack").on("click", function() {
    game.socket.send(JSON.stringify(["attack"]));
    $(".attack_success").css("display", "flex");
})

game.poll();