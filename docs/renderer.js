document.addEventListener('DOMContentLoaded', () => {
    const xInput = document.getElementById('xInput');
    const yInput = document.getElementById('yInput');
    const angleInput = document.getElementById('angleInput');
    const trapeziumContainer = document.getElementById('trapezium-container');
  
    // Create SVG element with extended viewBox
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('id', 'trapezium-svg');
    svg.setAttribute('viewBox', '-50 -50 400 400');
    trapeziumContainer.appendChild(svg);
  
    // Create 6x6 grid
    for (let i = 0; i <= 6; i++) {
      // Vertical lines
      const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      vLine.setAttribute('x1', i * 50);
      vLine.setAttribute('y1', 0);
      vLine.setAttribute('x2', i * 50);
      vLine.setAttribute('y2', 300);
      vLine.setAttribute('class', 'grid-line');
      svg.appendChild(vLine);
  
      // Horizontal lines
      const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      hLine.setAttribute('x1', 0);
      hLine.setAttribute('y1', i * 50);
      hLine.setAttribute('x2', 300);
      hLine.setAttribute('y2', i * 50);
      hLine.setAttribute('class', 'grid-line');
      svg.appendChild(hLine);
    }
  
    // Create trapezium (centered in one grid cell)
    const trapezium = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trapezium.setAttribute('d', 'M 125 150 L 175 150 L 160 175 L 140 175 Z');
    trapezium.setAttribute('class', 'trapezium');
    svg.appendChild(trapezium);
  
    // Create stick (centered on the trapezium)
    const stick = document.createElementNS("http://www.w3.org/2000/svg", "line");
    stick.setAttribute('x1', '150');
    stick.setAttribute('y1', '150');
    stick.setAttribute('x2', '150');
    stick.setAttribute('y2', '125');
    stick.setAttribute('class', 'stick');
    svg.appendChild(stick);
  
    // Create X-axis arrow (outside the grid)
    const xArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    xArrow.setAttribute('d', 'M -30 330 L 330 330 L 325 325 M 330 330 L 325 335');
    xArrow.setAttribute('stroke', '#e16666');
    xArrow.setAttribute('stroke-width', '2');
    xArrow.setAttribute('fill', 'none');
    svg.appendChild(xArrow);
  
    // Create Y-axis arrow (outside the grid)
    const yArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    yArrow.setAttribute('d', 'M -30 330 L -30 -30 L -35 -25 M -30 -30 L -25 -25');
    yArrow.setAttribute('stroke', '#e16666');
    yArrow.setAttribute('stroke-width', '2');
    yArrow.setAttribute('fill', 'none');
    svg.appendChild(yArrow);
  
    // Add X-axis label
    const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    xLabel.setAttribute('x', '335');
    xLabel.setAttribute('y', '345');
    xLabel.setAttribute('fill', '#e16666');
    xLabel.textContent = 'X';
    svg.appendChild(xLabel);
  
    // Add Y-axis label
    const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    yLabel.setAttribute('x', '-45');
    yLabel.setAttribute('y', '-35');
    yLabel.setAttribute('fill', '#e16666');
    yLabel.textContent = 'Y';
    svg.appendChild(yLabel);
  
    // Create dot for X and Y position
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute('r', '5');
    dot.setAttribute('fill', '#e16666');
    dot.setAttribute('cx', '150');  // Set initial position to center
    dot.setAttribute('cy', '150');
    svg.appendChild(dot);
  
    function updateValues() {
      const x = parseFloat(xInput.value) || 0;
      const y = parseFloat(yInput.value) || 0;
      const angle = parseFloat(angleInput.value) || 0;
  
      // Update stick rotation
      stick.style.transform = `rotate(${angle}deg)`;
  
      // Calculate new dot position
      const dotX = 150 + x * 50;
      const dotY = 150 - y * 50;
  
      // Animate dot movement from its current position to the new position
      dot.animate([
        { cx: dot.getAttribute('cx'), cy: dot.getAttribute('cy') },
        { cx: dotX, cy: dotY }
      ], {
        duration: 500,
        easing: 'ease-in-out',
        fill: 'forwards'
      }).onfinish = () => {
        // Update the dot's attributes after animation
        dot.setAttribute('cx', dotX);
        dot.setAttribute('cy', dotY);
      };
  
      console.log(`X: ${x}, Y: ${y}, Angle: ${angle}`);
    }
  
    [xInput, yInput, angleInput].forEach(input => {
      input.addEventListener('input', updateValues);
    });
  
    function calculateAngle(B) {
      const [x, y] = B;
      const radian = Math.atan2(x, y);
      return radian * (180 / Math.PI);
    }
  
    function calculateLength(B) {
      const [x, y] = B;
      return Math.sqrt(x ** 2 + y ** 2);
    }
  
    function angleLengthToCoordinates(angle, length) {
      const radian = angle * (Math.PI / 180);
      const x = length * Math.sin(radian);
      const y = length * Math.cos(radian);
      return [x, y];
    }
  
    function updateCalculations() {
      const xVal = parseFloat(xInput.value) || 0;
      const yVal = parseFloat(yInput.value) || 0;
      const angleVal = parseFloat(angleInput.value) || 0;
  
      const B = [xVal, yVal];
      const calculatedAngle = calculateAngle(B);
      const length = calculateLength(B);
      const coordinates = angleLengthToCoordinates(calculatedAngle + angleVal, length);
  
      const offsetX = (B[0] - coordinates[0]);
      const offsetY = (B[1] - coordinates[1]);
  
      // Update the display
      document.getElementById('xOffset').textContent = offsetX.toFixed(3);
      document.getElementById('yOffset').textContent = offsetY.toFixed(3);
  
      console.log(`Calculated angle: ${calculatedAngle}`);
      console.log(`Length: ${length}`);
      console.log(`Coordinates: ${coordinates}`);
      console.log(`Offset x: ${offsetX.toFixed(3)}`);
      console.log(`Offset y: ${offsetY.toFixed(3)}`);
    }
  
    // Add event listeners to your inputs for calculations
    xInput.addEventListener('input', updateCalculations);
    yInput.addEventListener('input', updateCalculations);
    angleInput.addEventListener('input', updateCalculations);
  
    // Initial calculation and update
    updateCalculations();
    updateValues();
  });
  