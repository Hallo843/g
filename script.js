const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize(){

    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

resize();

window.addEventListener("resize", resize);



// =========================
// POINTER
// =========================

const fish = {

    x: innerWidth / 2,
    y: innerHeight / 2
};

window.addEventListener("mousemove", e => {

    fish.x = e.clientX;
    fish.y = e.clientY;
});

window.addEventListener("touchmove", e => {

    fish.x = e.touches[0].clientX;
    fish.y = e.touches[0].clientY;

}, { passive:true });



// =========================
// CAT BODY
// =========================

const spine = [];

const total = innerWidth < 768 ? 10 : 14;

const spacing = innerWidth < 768 ? 18 : 26;

for(let i = 0; i < total; i++){

    spine.push({

        x: innerWidth / 2,
        y: innerHeight / 2
    });
}



// =========================
// UPDATE
// =========================

function updateCat(){

    spine[0].x += (fish.x - spine[0].x) * 0.08;
    spine[0].y += (fish.y - spine[0].y) * 0.08;

    for(let i = 1; i < spine.length; i++){

        const prev = spine[i - 1];
        const current = spine[i];

        const dx = prev.x - current.x;
        const dy = prev.y - current.y;

        const angle = Math.atan2(dy, dx);

        current.x = prev.x - Math.cos(angle) * spacing;
        current.y = prev.y - Math.sin(angle) * spacing;
    }
}



// =========================
// DRAW BACKGROUND
// =========================

function drawBackground(){

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    gradient.addColorStop(0, "#0f1020");
    gradient.addColorStop(1, "#05060f");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // estrellas

    for(let i = 0; i < 80; i++){

        ctx.beginPath();

        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();
    }
}



// =========================
// DRAW FISH
// =========================

function drawFish(){

    ctx.save();

    ctx.translate(fish.x, fish.y);

    // glow

    const glow = ctx.createRadialGradient(
        0,
        0,
        2,
        0,
        0,
        30
    );

    glow.addColorStop(0, "#c084fc");
    glow.addColorStop(1, "transparent");

    ctx.fillStyle = glow;

    ctx.beginPath();
    ctx.arc(0,0,30,0,Math.PI*2);
    ctx.fill();

    // pez

    ctx.fillStyle = "#e879f9";

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        14,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // cola

    ctx.beginPath();

    ctx.moveTo(-12,0);
    ctx.lineTo(-22,-10);
    ctx.lineTo(-22,10);

    ctx.fill();

    ctx.restore();
}



// =========================
// DRAW CAT
// =========================

function drawCat(){

    // cuerpo

    for(let i = spine.length - 1; i >= 0; i--){

        const p = spine[i];

        const size = 40 - i * 2;

        ctx.beginPath();

        ctx.fillStyle = "#f1f1f1";

        ctx.arc(
            p.x,
            p.y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // patas

    drawLegs();

    // cola

    drawTail();

    // cabeza

    drawHead();
}



// =========================
// HEAD
// =========================

function drawHead(){

    const head = spine[0];

    ctx.save();

    ctx.translate(head.x, head.y);

    // cabeza

    ctx.beginPath();

    ctx.fillStyle = "#ffffff";

    ctx.arc(0,0,35,0,Math.PI*2);

    ctx.fill();

    // orejas

    ctx.beginPath();

    ctx.moveTo(-20,-10);
    ctx.lineTo(-10,-50);
    ctx.lineTo(5,-15);

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(20,-10);
    ctx.lineTo(10,-50);
    ctx.lineTo(-5,-15);

    ctx.fill();

    // ojos

    ctx.beginPath();

    ctx.fillStyle = "#111";

    ctx.arc(-10,0,4,0,Math.PI*2);
    ctx.arc(10,0,4,0,Math.PI*2);

    ctx.fill();

    // nariz

    ctx.beginPath();

    ctx.fillStyle = "#ff8fab";

    ctx.arc(0,10,4,0,Math.PI*2);

    ctx.fill();

    ctx.restore();
}



// =========================
// LEGS
// =========================

function drawLegs(){

    const legPoints = [
        spine[3],
        spine[5],
        spine[7],
        spine[9]
    ];

    legPoints.forEach((p,i)=>{

        if(!p) return;

        ctx.beginPath();

        ctx.strokeStyle = "#d6d6d6";
        ctx.lineWidth = 16;
        ctx.lineCap = "round";

        ctx.moveTo(p.x, p.y);

        ctx.lineTo(
            p.x + (i % 2 === 0 ? -15 : 15),
            p.y + 70
        );

        ctx.stroke();
    });
}



// =========================
// TAIL
// =========================

function drawTail(){

    const tail = spine[spine.length - 1];

    for(let i = 0; i < 8; i++){

        const x = tail.x + i * 12;
        const y = tail.y + Math.sin(Date.now() * 0.01 + i) * 12;

        ctx.beginPath();

        ctx.fillStyle = "#d9d9d9";

        ctx.arc(
            x,
            y,
            10 - i,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}



// =========================
// ANIMATE
// =========================

function animate(){

    drawBackground();

    updateCat();

    drawCat();

    drawFish();

    requestAnimationFrame(animate);
}

animate();