const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = createParticles(1000);
});

const mouse = {
    x: 0,
    y: 0
}

const context = canvas.getContext('2d');
const forceRadius = 150;
const forceStrength = 100;
const maxVelocity = 4;

const colors = ["#387EA2", "#5BA3C6", "#9BCBE5", "#DDECF6"];
const backgroundColor = "#031d2c";

function createParticle(x, y) {
    return {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        homeX: x,
        homeY: y,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}

function createParticles(count) {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
        newParticles.push(createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
    return newParticles;
}

let particles = createParticles(1000);

function updateParticles(particles) {
    particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < forceRadius) {
            const angle = Math.atan2(dy, dx);
            const force = (forceRadius - distance) / forceRadius;
            p.vx += Math.cos(angle) * force * forceStrength * 0.1;
            p.vy += Math.sin(angle) * force * forceStrength * 0.1;
        }

        const homeDX = p.homeX - p.x;
        const homeDY = p.homeY - p.y;
        p.vx += homeDX * 0.001;
        p.vy += homeDY * 0.001;

        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;

        p.vx *= 0.95;
        p.vy *= 0.95;

        if (p.vx > maxVelocity) p.vx = maxVelocity;
        if (p.vx < -maxVelocity) p.vx = -maxVelocity;
        if (p.vy > maxVelocity) p.vy = maxVelocity;
        if (p.vy < -maxVelocity) p.vy = -maxVelocity;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x > canvas.width) p.x = 0;
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y < 0) p.y = canvas.height;
    });
}

function drawParticles(context, particles) {
    particles.forEach(p => {
    context.fillStyle = p.color;
    context.shadowColor = p.color;
    context.shadowBlur = 15;
    context.beginPath();
    context.arc(p.x, p.y, 1, 0, Math.PI * 2);
    context.fill();
    });

    context.shadowBlur = 0;
    context.shadowColor = 'rgba(0,0,0,0)';
}

function animate() {
    updateParticles(particles);

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(context, particles);

    requestAnimationFrame(animate);
}


canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

animate();
