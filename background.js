document.addEventListener('DOMContentLoaded', function() {
    // Three.js setup
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Get theme colors
    const getThemeColors = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? [0.4, 0.4, 0.4] : [0.4, 0.8, 0.86];
    };
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const themeColors = getThemeColors();
    
    for(let i = 0; i < 5000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
        
        colors.push(...themeColors);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.5
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    
    camera.position.z = 1000;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.0003;
        points.rotation.y += 0.0003;
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate();
}); 