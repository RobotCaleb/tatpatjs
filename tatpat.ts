var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

var canvasWidth = 600;
var canvasHeight = 800;

class Tat {
    grid: Link[][];

    constructor(x: number, y: number) {
        this.grid = [];
        for (var m: number = 0; m < x; m++) {
            this.grid[m] = [];
            for (var n: number = 0; n < y; n++) {
                var link = this.getRandomLink();
                this.grid[m][n] = link;
            }
        }
    }

    private getRandomLink(): Link {
        var keys = Object.keys(Link);
        var index = Math.floor(Math.random() * keys.length / 2);
        var k = keys[index];
        
        return <Link>parseInt(k, 10);
    }
}

enum Link {
    None = 0,
    Left,
    Up,
    Right,
}

class Run {
    x: number;
    y: number;
    link: Link;

    constructor(x: number, y: number, next: Link) {
        this.x = x;
        this.y = y;
        this.link = next;
    }
}

var w: number = 6;
var h: number = 8;
var tat: Tat = new Tat(w, h);

function loop() {
   requestAnimationFrame(loop);
   ctx.fillStyle = "black";
   ctx.fillRect(0, 0, canvasWidth, canvasHeight);

   var stepX: number = canvasWidth / w;
   var stepY: number = canvasHeight / h;

   var grid = tat.grid;

    for (var x: number = 0; x < w; x++) {
        for (var y: number = 0; y < h; y++) {
            var piece = grid[x][y];

            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.arc(x * stepX + stepX / 2, y * stepY + stepY / 2, 5, 0, Math.PI * 2);
            ctx.stroke();

            // don't render the last row as there's nowhere to step to from there
            if (y == h - 1) {
                continue;
            }
            
            var nx: number = 0;
            var ny: number = y + 1;

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
   canvas = <HTMLCanvasElement>document.getElementById('canvas');
   ctx = canvas.getContext("2d");
   
   canvas.width = canvasWidth;
   canvas.height = canvasHeight;

   loop();
}
