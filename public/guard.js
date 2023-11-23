const game = {
    socket: new WebSocket(`ws://${window.location.host}/game`),
    state: 0,
    incoming: -1,
    receiving: -1,
    selected: -1,
    progress: 0,
    download_interval: null,
    incoming_timeout: null,
    incoming_wait: null,
    incoming_repeat: null,
    repair_interval: null,
    select_count: 0,
    select_goal: 300,
    sounds: {
        error: (() => {
            let sound = new Audio("/error.wav");
            sound.volume = 0.3;
            return sound;
        })(),
        bg: (() => {
            let sound = new Audio("/bg.wav");
            sound.volume = 0.03;
            sound.loop = true;
            return sound;
        })(),
        coming: (() => {
            let sound = new Audio("/coming.wav");
            sound.volume = 0.07;
            return sound;
        })(),
        repairing: (() => {
            let sound = new Audio("/repairing.wav");
            sound.volume = 0.3;
            return sound;
        })(),
        repaired: (() => {
            let sound = new Audio("/repaired.wav");
            sound.volume = 0.3;
            return sound;
        })()
    },
    ready_incoming: function() {
        if (this.state != 1) return;
        let new_incoming = Math.floor(Math.random() * 4);
        if (new_incoming == this.incoming || new_incoming == this.selected) {
            this.ready_incoming();
            return;
        }
        this.incoming = new_incoming;

        $(`.node[data-source="${this.incoming}"]`).attr("data-incoming", "");
        this.incoming_timeout = setTimeout(() => {
            if (this.state != 1) return;
            $(".node[data-source]").removeAttr("data-incoming");
            this.switch_incoming(this.incoming);
            this.receiving = this.incoming;
        }, 2000);
    },
    switch_incoming: function(node) {
        $(".node").removeAttr("data-receiving");
        $(".node[data-hub]").removeAttr("data-active");
        $(`.node[data-source="${node}"]`).attr("data-receiving", "");
        $(".transfer_line").removeAttr("data-active");
        if ($(`.node[data-source="${node}"]`).is("[data-selected]")) {
            this.node_selected($(`.node[data-source="${node}"]`).attr("data-source"));
        }
    },
    node_selected: function(node) {
        $(`.transfer_line[data-source="${node}"]`).attr("data-active", "");
        $(".node[data-hub]").attr("data-active", "");
    },
    set_state: function(state) {
        this.state = state;
        this.incoming = -1;
        this.receiving = -1;
        this.selected = -1;
        this.progress = 0;
        this.select_count = 0;

        clearInterval(this.download_interval);
        clearTimeout(this.incoming_repeat);
        clearTimeout(this.incoming_timeout);
        clearTimeout(this.incoming_wait);

        this.download_interval = null;
        this.incoming_repeat = null;
        this.incoming_timeout = null;
        this.incoming_wait = null;

        $(".node").removeAttr("data-incoming");
        $(".node").removeAttr("data-receiving");
        $(".node").removeAttr("data-selected");
        $(".node").removeAttr("data-active");
        $("#command").removeAttr("data-wrong");
        $("#command").val("");
        $("#command_list li").removeAttr("data-selected");
        $("#command_list li").first().attr("data-selected", "");

        switch (this.state) {
            case 0:
                clearInterval(this.repair_interval);
                this.repair_interval = null;
                $("#next_stage").css("display", "");
                $("#download").css("display", "");
                $("#objective_screen .caption").css("display", "");
                $("#progress").css("display", "");
                $("#command_caption").css("display", "");
                $("#command_list").css("display", "");
                $("#command").css("display", "");
                $("#upload").css("display", "");
                $("#select_progress").css("display", "");
                break;
            case 1:
                this.socket.send(JSON.stringify(["downloading"]));
                this.repair_queue();
                $("#next_stage").css("display", "none");
                $("#download").css("display", "block");
                $("#objective_screen .caption").css("display", "");
                $("#download_caption").css("display", "block");
                $("#progress").css("display", "block");
                $(".node").removeAttr("data-selected");
                $(".node").removeAttr("data-receiving");
                $(".node[data-hub]").removeAttr("data-active");
                $(".transfer_line").removeAttr("data-active");
                $("#progress .bar").css("width", "");
                $("#command_caption").css("display", "");
                $("#command_list").css("display", "");
                $("#command").css("display", "");
                $("#upload").css("display", "");
                $("#select_progress").css("display", "");
                this.download()
                break;
            case 2:
                this.socket.send(JSON.stringify(["running"]));
                $("#next_stage").css("display", "none");
                $("#download").css("display", "");
                $("#objective_screen .caption").css("display", "");
                $("#progress").css("display", "");
                $("#command_caption").css("display", "block");
                $("#command_list").css("display", "block");
                $("#command").css("display", "block");
                $("#upload").css("display", "");
                $("#select_progress").css("display", "");
                this.commands();
                break;
            case 3:
                this.socket.send(JSON.stringify(["uploading"]));
                $("#next_stage").css("display", "none");
                $("#download").css("display", "");
                $("#objective_screen .caption").css("display", "");
                $("#progress").css("display", "");
                $("#command_caption").css("display", "");
                $("#command_list").css("display", "");
                $("#command").css("display", "");
                $(".target").css("display", "flex");
                $(".option").css("display", "flex");
                $("#upload").css("display", "block");
                $("#select_caption").css("display", "block");
                $("#select_progress").css("display", "block");
                this.upload();
                break;
            case 4:
                this.socket.send(JSON.stringify(["complete"]));
                break;
        }
    },
    download: function() {
        this.download_interval = setInterval(() => {
            if (this.receiving != this.selected || this.selected < 0) return;
            this.progress++;
            $("#progress .bar").css("width", `${this.progress}%`);
            if (this.progress == 100) {
                this.set_state(2);
            }
        }, 2000);
        this.incoming_wait = setTimeout(() => {
            this.ready_incoming();
        }, 2000);
        this.incoming_interval();
    },
    incoming_interval: function() {
        this.incoming_repeat = setTimeout(() => {
            this.ready_incoming();
            if (this.state == 1) this.incoming_interval();
        }, (Math.floor(Math.random() * 3) + 5) * 1000);
    },
    commands: function() {
        let commands = [];

        for (let i = 0; i < 5; i ++) {
            commands.push(this.generate_command());
            $("#command_list li").eq(i).text(commands[i]);
        }
    },
    upload: function() {
        let bytes = [];

        for (let i = 0; i < 4; i++) {
            let in_bytes = true;
            let byte = "";

            while (in_bytes) {
                byte = Math.floor(Math.random() * 256).toString(16).toUpperCase();
                if (byte.length == 1) byte = `0${byte}`;
                if (!bytes.includes(byte)) in_bytes = false;
            }

            bytes.push(byte);
            $(".option").eq(i).text(byte);
        }

        $(".target").text(this.random_element(bytes));
    },
    needs_repair: function() {
        this.sounds.error.play();
        this.socket.send(JSON.stringify(["needs_repair"]));
        $("#error_screen").css("display", "flex");
    },
    generate_command: function() {
        let commands = ["chmud", "mkdoor", "pkthunder", "shunt", "oofconfig", "pptables", "posh", "moov", "yas", "monk", "wig", "garbaj", "poke"];
        let keywords = ["bazinga", "uploads", "wrinkle", "cardboard", "towtruck", "chicken", "lampshade", "bigL", "stump", "justin-biebich", "shadow", "etc", "options", "trash", "sumsang", "cement", "hotdog", "nocap", "tictacs", "dev", "opt", "shunk", "german"];
        let args = [' --<<keyword>> "<<keyword>>"', ' >&', ' >>&', ' <<keyword>>@<<rand>>.<<rand>>.<<rand>>.<<rand>>', ' --<<keyword>>=<<rand>>', ' > /<<keyword>>/<<keyword>>/<<rand>>', ' --<<keyword>> /<<keyword>>/<<keyword>>/<<keyword>>', ' >> /<<keyword>>/<<keyword>>/<<keyword>>', " --<<keyword>>"];
        let command = "";

        command += this.random_element(commands);
        for (let i = 0; i < 3; i++) {
            command += this.random_element(args);
        }

        let keywords_done = false;

        while (!keywords_done) {
            let previous = command;
            command = command.replace("<<keyword>>", this.random_element(keywords));
            if (previous == command) keywords_done = true;
        }

        let rand_done = false;

        while (!rand_done) {
            let previous = command;

            command = command.replace("<<rand>>", this.rand());
            if (previous == command) rand_done = true;
        }

        return command;
    },
    rand: function() {
        return Math.floor(Math.random() * 200) + 30;
    },
    random_element: function(array) {
        let index = Math.floor(Math.random() * array.length);
        let element = array[index];

        array.splice(index, 1);
        return element;
    },
    repair_queue: function() {
        let time = Math.floor(Math.random() * 21 + 20) * 1000;

        clearTimeout(this.repair_interval);
        this.repair_interval = setTimeout(() => {
            this.needs_repair();
        }, time);
    },
    coming: function() {
        this.sounds.coming.play();
    },
    repairing: function() {
        this.sounds.repairing.play();
    },
    repaired: function() {
        $("#error_screen").css("display", "none");
        this.sounds.repairing.pause();
        this.sounds.repairing.currentTime = 0;
        this.sounds.repaired.play();
    },
}

$(".camera_button").on("click", function() {
    $(".camera_button").removeAttr("data-selected");
    $(this).attr("data-selected", "");
    $("#camera_screen img").css("display", "");
    $("#camera_screen img").eq($(this).index()).css("display", "block");
});

$(".node[data-source]").on("click", function() {
    game.selected = parseInt($(this).attr("data-source"));
    $(".transfer_line").removeAttr("data-active");
    $(".node").removeAttr("data-selected");
    $(".node[data-hub]").removeAttr("data-active");
    $(this).attr("data-selected", "");
    if($(this).is("[data-receiving]")) {
        game.node_selected($(this).attr("data-source"))
    }
})

$("#next_stage").on("click", function() {
    switch (game.state) {
        case 0:
            game.sounds.bg.play();
            game.set_state(1);
            break;
    }
});

$("#command").on("input", function() {
    let typed = $(this).val();
    let goal = $("#command_list li[data-selected]").text();

    if (typed != goal.substring(0, typed.length)) {
        $(this).attr("data-wrong", "");
    }
    else {
        $(this).removeAttr("data-wrong");
    }

    if (typed == goal) {
        $(this).val("");
        let new_command_index = $("#command_list li[data-selected]").index() + 1;

        if (new_command_index >= $("#command_list li").length) {
            game.set_state(3);
            return;
        }

        $("#command_list li[data-selected]").removeAttr("data-selected");
        $("#command_list li").eq(new_command_index).attr("data-selected", "");
    }
});

$(".option").on("click", function() {
    if ($(this).text() == $(".target").text()) {
        $("#select_progress").text(`${++game.select_count}/${game.select_goal}`);
        if (game.select_count == game.select_goal) {
            game.set_state(4);
            return;
        }
        game.upload();
    }
    else {
        game.needs_repair();
    }
});

setInterval(() => {
    $("#camera_screen img").each(function() {
        $(this).attr("src", $(this).attr("src"));
    });
}, 10000);

$(game.socket).on("message", function(event) {
    let data = JSON.parse(event.originalEvent.data);

    switch (data[0]) {
        case "attacked":
            game.needs_repair();
            break;
        case "repaired":
            game.repaired();
            game.repair_queue();
            break;
        case "repairing":
            game.repairing();
            break;
        case "coming":
            game.coming();
            break;
    }
});

$(game.socket).on("open", function() {
    let data = JSON.stringify(["guard"])
    this.send(data);
});