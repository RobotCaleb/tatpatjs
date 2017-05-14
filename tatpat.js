var seed = Math.random();
var seeds = [];
var seedIndex = 0;
var random = () => {
    var x;
    do {
        x = Math.sin(seed++) * 10000;
        x = x - Math.floor(x);
    } while (x < 0.15 || x > 0.9);
    x = (x - 0.15) * 1 / 0.75;
    return x;
};
var seedRandom = (sd) => {
    if (!sd) {
        sd = Math.random();
    }
    seed = sd;
};
class Tat {
    constructor(x, y) {
        this.grid = [];
        for (var m = 0; m < x; m++) {
            this.grid[m] = [];
            for (var n = 0; n < y; n++) {
                var link = this.getRandomLink();
                if (m > 0) {
                    do {
                        link = this.getRandomLink();
                    } while (link == Link.Left && this.grid[m - 1][n] == Link.Right);
                }
                this.grid[m][n] = link;
            }
        }
    }
    state() {
        return this.rng.state();
    }
    getRandomLink() {
        var keys = Object.keys(Link);
        var index = Math.floor(random() * keys.length / 2);
        var k = keys[index];
        return parseInt(k, 10);
    }
}
var Link;
(function (Link) {
    Link[Link["None"] = 0] = "None";
    Link[Link["Left"] = 1] = "Left";
    Link[Link["Up"] = 2] = "Up";
    Link[Link["Right"] = 3] = "Right";
})(Link || (Link = {}));
var PipDraw;
(function (PipDraw) {
    PipDraw[PipDraw["Min"] = 0] = "Min";
    PipDraw[PipDraw["None"] = 0] = "None";
    PipDraw[PipDraw["Intersections"] = 1] = "Intersections";
    PipDraw[PipDraw["All"] = 2] = "All";
    PipDraw[PipDraw["Max"] = 2] = "Max";
})(PipDraw || (PipDraw = {}));
var Color;
(function (Color) {
    Color[Color["Min"] = 0] = "Min";
    Color[Color["RedBlack"] = 0] = "RedBlack";
    Color[Color["BlackWhite"] = 1] = "BlackWhite";
    Color[Color["WhiteBlack"] = 2] = "WhiteBlack";
    Color[Color["Max"] = 2] = "Max";
})(Color || (Color = {}));
class Run {
    constructor(x, y, next) {
        this.x = x;
        this.y = y;
        this.link = next;
    }
}
var canvas;
var ctx;
var canvasWidth = 600;
var canvasHeight = 800;
var halfWidth = canvasWidth / 2;
var pipRadius = 8;
var w = 3;
var h = 9;
var minW = 3;
var minH = 3;
var maxW = 12;
var maxH = 16;
var bg = 'black';
var fg = 'red';
var tat;
var pipDraw = PipDraw.Intersections;
var color = Color.BlackWhite;
var dirty = false;
var render = () => {
    renderWhich("left");
    renderWhich("right");
    var wspan = document.getElementById('w');
    wspan.innerText = w.toString();
    var hspan = document.getElementById('h');
    hspan.innerText = h.toString();
};
var renderWhich = (which) => {
    if (which == "right") {
        var data = ctx.getImageData(0, 0, halfWidth, canvasHeight);
        createImageBitmap(data).then((bmp) => {
            ctx.translate(halfWidth, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(bmp, -halfWidth, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        });
        return;
    }
    switch (color) {
        case Color.RedBlack:
            fg = 'red';
            bg = 'black';
            break;
        case Color.BlackWhite:
            fg = 'black';
            bg = 'white';
            break;
        case Color.WhiteBlack:
            fg = 'white';
            bg = 'black';
            break;
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    var stepX = halfWidth / w;
    var stepY = canvasHeight / h;
    var grid = tat.grid;
    switch (pipDraw) {
        case PipDraw.All: {
            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h; y++) {
                    ctx.beginPath();
                    ctx.strokeStyle = fg;
                    ctx.lineWidth = 5;
                    ctx.arc(x * stepX + stepX / 2, y * stepY + stepY / 2, pipRadius, 0, Math.PI * 2);
                    ctx.fillStyle = fg;
                    ctx.fill();
                    ctx.stroke();
                }
            }
            break;
        }
        case PipDraw.Intersections: {
            for (var x = 0; x < w; x++) {
                for (var y = 0; y < h - 1; y++) {
                    var piece = grid[x][y];
                    var nx = x;
                    var ny = y;
                    switch (piece) {
                        case Link.Left:
                            nx = x - 1;
                            ny = y + 1;
                            break;
                        case Link.Up:
                            nx = x;
                            ny = y + 1;
                            break;
                        case Link.Right:
                            nx = x + 1;
                            ny = y + 1;
                            break;
                        case Link.None:
                            continue;
                    }
                    if (x == 0 && piece == Link.Left || x == w - 1 && piece == Link.Right) {
                        continue;
                    }
                    ctx.strokeStyle = fg;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.arc(x * stepX + stepX / 2, y * stepY + stepY / 2, pipRadius, 0, Math.PI * 2);
                    ctx.fillStyle = fg;
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(nx * stepX + stepX / 2, ny * stepY + stepY / 2, pipRadius, 0, Math.PI * 2);
                    ctx.fillStyle = fg;
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
        case PipDraw.None: {
            break;
        }
    }
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var piece = grid[x][y];
            // don't render the last row as there's nowhere to step to from there
            if (y == h - 1) {
                continue;
            }
            var nx = 0;
            var ny = y + 1;
            switch (piece) {
                case Link.Left:
                    nx = x - 1;
                    break;
                case Link.Up:
                    nx = x;
                    break;
                case Link.Right:
                    nx = x + 1;
                    break;
                case Link.None:
                    continue;
            }
            if (x == 0 && piece == Link.Left || x == w - 1 && piece == Link.Right) {
                continue;
            }
            ctx.beginPath();
            ctx.strokeStyle = fg;
            ctx.lineWidth = 10;
            ctx.moveTo(x * stepX + stepX / 2, y * stepY + stepY / 2);
            ctx.lineTo(nx * stepX + stepX / 2, ny * stepY + stepY / 2);
            ctx.stroke();
        }
    }
};
var rebuild = (reseed) => {
    if (reseed == false) {
        seed = seeds[seedIndex];
    }
    else {
        seedRandom();
        seeds.push(seed);
        seedIndex = seeds.length - 1;
    }
    tat = new Tat(w, h);
    render();
};
var next = () => {
    seedIndex = seedIndex + 1;
    if (seedIndex >= seeds.length) {
        rebuild();
        return;
    }
    seedRandom(seeds[seedIndex]);
    tat = new Tat(w, h);
    render();
};
var prev = () => {
    seedIndex = seedIndex - 1;
    if (seedIndex < 0) {
        seedIndex = 0;
    }
    seedRandom(seeds[seedIndex]);
    tat = new Tat(w, h);
    render();
};
var save = () => {
    var data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var download = document.getElementById('download');
    download.setAttribute("href", data);
    download.click();
    render();
};
var updatePipDraw = () => {
    var children = document.getElementsByClassName('pipinput');
    for (var child in children) {
        if (children.hasOwnProperty(child)) {
            var element = children[child];
            if (element.checked) {
                pipDraw = parseInt(element.value);
                break;
            }
        }
    }
    render();
};
var updatePipDrawForm = () => {
    var children = document.getElementsByClassName('pipinput');
    for (var child in children) {
        if (children.hasOwnProperty(child)) {
            var element = children[child];
            if (parseInt(element.value) == pipDraw) {
                element.checked = true;
                break;
            }
        }
    }
    render();
};
var updateColor = () => {
    var children = document.getElementsByClassName('colorinput');
    for (var child in children) {
        if (children.hasOwnProperty(child)) {
            var element = children[child];
            if (element.checked) {
                color = parseInt(element.value);
                break;
            }
        }
    }
    render();
};
var updateColorForm = () => {
    var children = document.getElementsByClassName('colorinput');
    for (var child in children) {
        if (children.hasOwnProperty(child)) {
            var element = children[child];
            if (parseInt(element.value) == color) {
                element.checked = true;
                break;
            }
        }
    }
    render();
};
var nextColor = () => {
    color++;
    if (color > Color.Max) {
        color = Color.Min;
    }
};
var nextIntersect = () => {
    pipDraw++;
    if (pipDraw > PipDraw.Max) {
        pipDraw = PipDraw.Min;
    }
};
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    var rbld = document.getElementById('btn-rebuild');
    rbld.onclick = () => { rebuild(); };
    var btnSave = document.getElementById('btn-save');
    btnSave.onclick = save;
    var formPip = document.getElementById('form-pip');
    formPip.onchange = updatePipDraw;
    var formColor = document.getElementById('form-color');
    formColor.onchange = updateColor;
    window.onkeydown = (key) => {
        if (key.key == 'r') {
            rebuild();
        }
        else if (key.keyCode == 39 /* right arrow */) {
            next();
        }
        else if (key.keyCode == 37 /* left arrow */) {
            prev();
        }
        else if (key.key == 's') {
            save();
        }
        else if (key.key == 'h') {
            w = w - 1;
            if (w < minW) {
                w = maxW;
            }
            rebuild(false);
        }
        else if (key.key == 'j') {
            w = w + 1;
            if (w > maxW) {
                w = minW;
            }
            rebuild(false);
        }
        else if (key.key == 'k') {
            h = h - 1;
            if (h < minH) {
                h = maxH;
            }
            rebuild(false);
        }
        else if (key.key == 'l') {
            h = h + 1;
            if (h > maxH) {
                h = minH;
            }
            rebuild(false);
        }
        else if (key.key == 'c') {
            nextColor();
            updateColorForm();
        }
        else if (key.key == 'i') {
            nextIntersect();
            updatePipDrawForm();
        }
    };
    rebuild();
    updatePipDrawForm();
    updateColorForm();
    render();
};
//# sourceMappingURL=tatpat.js.map