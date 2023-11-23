const game = {
    events: 19,
    done: false,
    normal_state: "Starting system",
    addr: `ws://${window.location.host}/game`,
    socket: null,
    poll: function() {
        this.socket = new WebSocket(this.addr);
        this.connect();
    },
    connect: function() {
        $(this.socket).on("open", function() {
            let data = JSON.stringify(["spectator"])
            this.send(data);
        });
        
        $(this.socket).on("message", (event) => {
            if (this.done) return;

            let data = JSON.parse(event.originalEvent.data);

            $(".spectator_text.title").removeAttr("data-good");
            $(".spectator_text.title").removeAttr("data-bad");
        
            switch (data[0]) {
                case "attacked":
                    $(".spectator_text.title").attr("data-good", "");
                    $(".spectator_text.title").text("Caught");
                    this.push_event(`Guard has been caught`);
                    this.done = true;
                    break;
                case "complete":
                    $(".spectator_text.title").attr("data-bad", "");
                    $(".spectator_text.title").text("Successful");
                    this.push_event(`Guard has succeeded`);
                    this.done = true;
                    break;
                case "downloading":
                    $(".spectator_text.title").text("Downloading exploit");
                    this.push_event(`Guard is now downloading exploit`);
                    this.normal_state = "Downloading exploit";
                    break;
                case "running":
                    $(".spectator_text.title").text("Running exploit");
                    this.push_event(`Guard is now running exploit`);
                    this.normal_state = "Running exploit";
                    break;
                case "uploading":
                    $(".spectator_text.title").text("Uploading data");
                    this.push_event(`Guard is now uploading data`);
                    this.normal_state = "Uploading data";
                    break;
                case "needs_repair":
                    $(".spectator_text.title").attr("data-bad", "");
                    $(".spectator_text.title").text("Repairing system");
                    this.push_event(`Guard is now repairing system`);
                    break;
                case "repaired":
                    $(".spectator_text.title").text(this.normal_state);
                    this.push_event(`Guard has repaired system`);
                    break;
                case "attack_success":
                    this.push_event(`Scanned code: <span class="good">SUCCESS</span>`);
                    break;
                case "attack_fail":
                    this.push_event(`Scanned code: <span class="bad">FAIL</span>`);
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
    },
    push_event(event) {
        let date = new Date()
        let time = date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: "numeric", second: "numeric" });
    
        if ($(".spectator_list li").length >= game.events) {
            $(".spectator_list li").first().remove();
        }
    
        $(".spectator_list").append(`
            <li><span>${time}</span> ${event}</li>
        `);
    }
}

game.poll();