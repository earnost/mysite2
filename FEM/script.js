function calculateDeflection() {
    const length = parseFloat(document.getElementById('length').value);
    const load = parseFloat(document.getElementById('load').value);
    const distance = parseFloat(document.getElementById('distance').value);
    const youngsModulus = parseFloat(document.getElementById('youngsModulus').value);

    if (isNaN(length) || isNaN(load) || isNaN(distance) || isNaN(youngsModulus) || length <= 0 || load <= 0 || distance < 0 || youngsModulus <= 0) {
        alert("Please enter valid positive numbers.");
        return;
    }

    const momentOfInertia = (1 / 12) * (length ** 4); // Simple example, adjust as needed
    const deflection = (load * Math.pow(distance, 2) * (3 * length - distance)) / (6 * youngsModulus * momentOfInertia);

    document.getElementById('deflection').textContent = deflection.toFixed(4);
    drawBeam(length, deflection, distance);
}

function drawBeam(length, deflection, loadDistance) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const scale = 100; // Scaling factor for visualization
    const beamLengthPixels = length * scale;
    const maxDeflectionPixels = 50; // Maximum deflection to display

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw X and Y axes
    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.lineTo(50, canvas.height - 30);
    ctx.lineTo(canvas.width - 10, canvas.height - 30);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw X and Y axis labels
    ctx.font = '12px Arial';
    ctx.fillText('0', 40, canvas.height - 15);
    ctx.fillText(length.toFixed(2) + ' m', canvas.width - 80, canvas.height - 15);
    ctx.fillText('0', 20, canvas.height - 30);
    ctx.fillText(maxDeflectionPixels / scale + ' m', 20, 30);

    // Draw beam
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(50 + beamLengthPixels, canvas.height - 30);
    ctx.stroke();

    // Draw deflection (simplified)
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 30);
    ctx.lineTo(50 + (beamLengthPixels / 2), canvas.height - 30 - (deflection / 0.01) * maxDeflectionPixels);
    ctx.lineTo(50 + beamLengthPixels, canvas.height - 30);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // Draw load
    ctx.beginPath();
    ctx.moveTo(50 + (loadDistance * scale), canvas.height - 30);
    ctx.lineTo(50 + (loadDistance * scale), canvas.height - 50);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    // Draw support
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 40);
    ctx.lineTo(50, canvas.height - 20);
    ctx.strokeStyle = 'green';
    ctx.stroke();
}



