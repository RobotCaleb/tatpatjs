var canvas;
var ctx;
var canvasWidth = 600;
var canvasHeight = 800;
class Tat {
    constructor(x, y) {
        this.grid = [];
        for (var m = 0; m < x; m++) {
            this.grid[m] = [];
            for (var n = 0; n < y; n++) {
                var link = this.getRandomLink();
                this.grid[m][n] = link;
            }
        }
    }
    getRandomLink() {
        var keys = Object.keys(Link);
        var index = Math.floor(Math.random() * keys.length / 2);
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
class Run {
    constructor(x, y, next) {
        this.x = x;
        this.y = y;
        this.link = next;
    }
}
var w = 6;
var h = 8;
var tat = new Tat(w, h);
function loop() {
    requestAnimationFrame(loop);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    var stepX = canvasWidth / w;
    var stepY = canvasHeight / h;
    var grid = tat.grid;
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h - 1; y++) {
            var piece = grid[x][y];
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.arc(x * stepX + stepX / 2, y * stepY + stepY / 2, 5, 0, Math.PI * 2);
            ctx.stroke();
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
            ctx.strokeStyle = "red";
            ctx.lineWidth = 10;
            ctx.moveTo(x * stepX + stepX / 2, y * stepY + stepY / 2);
            ctx.lineTo(nx * stepX + stepX / 2, ny * stepY + stepY / 2);
            ctx.stroke();
        }
    }
}
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    loop();
};
//# sourceMappingURL=tatpat.js.map