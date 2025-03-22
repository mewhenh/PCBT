document.addEventListener('DOMContentLoaded', () => {
  const xInput = document.getElementById('xInput');
  const yInput = document.getElementById('yInput');
  const angleInput = document.getElementById('angleInput');
  const trapeziumContainer = document.getElementById('trapezium-container');

  // Get container dimensions for a responsive grid
  const containerWidth = trapeziumContainer.clientWidth;
  const containerHeight = trapeziumContainer.clientHeight;
  const gridCols = 6;
  const gridRows = 6;
  const cellWidth = containerWidth / gridCols;
  const cellHeight = containerHeight / gridRows;

  // Create SVG element with responsive settings
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('id', 'trapezium-svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
  trapeziumContainer.appendChild(svg);

  // Draw vertical grid lines
  for (let i = 0; i <= gridCols; i++) {
    const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const x = i * cellWidth;
    vLine.setAttribute('x1', x);
    vLine.setAttribute('y1', 0);
    vLine.setAttribute('x2', x);
    vLine.setAttribute('y2', containerHeight);
    vLine.setAttribute('class', 'grid-line');
    svg.appendChild(vLine);
  }

  // Draw horizontal grid lines
  for (let j = 0; j <= gridRows; j++) {
    const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const y = j * cellHeight;
    hLine.setAttribute('x1', 0);
    hLine.setAttribute('y1', y);
    hLine.setAttribute('x2', containerWidth);
    hLine.setAttribute('y2', y);
    hLine.setAttribute('class', 'grid-line');
    svg.appendChild(hLine);
  }

  // Define center and cell size for positioning shapes
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const cellSize = (cellWidth + cellHeight) / 2;

  // Create an inverted trapezium (narrow part on top)
  // For a responsive design, dimensions are relative to cellSize:
  //   - Bottom (wider) edge = cellSize
  //   - Top (narrow) edge = 40% of cellSize
  //   - Height = 25% of cellSize
  const bottomWidth = cellSize;
  const topWidth = cellSize * 0.4;
  const height = cellSize * 0.25;

  // Calculate vertices for the trapezium
  // The trapezium is centered at (centerX, centerY)
  // Bottom edge:
  const bottomLeftX = centerX - bottomWidth / 2;
  const bottomLeftY = centerY + height / 2;
  const bottomRightX = centerX + bottomWidth / 2;
  const bottomRightY = centerY + height / 2;
  // Top edge:
  const topLeftX = centerX - topWidth / 2;
  const topLeftY = centerY - height / 2;
  const topRightX = centerX + topWidth / 2;
  const topRightY = centerY - height / 2;

  // Build the path string for the inverted trapezium:
  // Starts at bottom left, goes to bottom right, then top right, then top left, and closes.
  const trapeziumPath = `M ${bottomLeftX} ${bottomLeftY} L ${bottomRightX} ${bottomRightY} L ${topRightX} ${topRightY} L ${topLeftX} ${topLeftY} Z`;
  const trapezium = document.createElementNS("http://www.w3.org/2000/svg", "path");
  trapezium.setAttribute('d', trapeziumPath);
  trapezium.setAttribute('class', 'trapezium');
  svg.appendChild(trapezium);

  // Create stick (positioned relative to the center)
  // Stick starts at the center and extends upward by 25% of cellSize.
  const stickLength = cellSize * 0.25;
  const stick = document.createElementNS("http://www.w3.org/2000/svg", "line");
  stick.setAttribute('x1', centerX);
  stick.setAttribute('y1', centerY);
  stick.setAttribute('x2', centerX);
  stick.setAttribute('y2', centerY - stickLength);
  stick.setAttribute('class', 'stick');
  svg.appendChild(stick);

  // Create X-axis arrow (placed below the grid)
  const xArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  // For simplicity, these coordinates are relative to container dimensions.
  const xArrowPath = `M ${-0.1 * containerWidth} ${containerHeight * 1.05} L ${containerWidth * 1.05} ${containerHeight * 1.05} L ${containerWidth * 1.00} ${containerHeight * 1.00} M ${containerWidth * 1.05} ${containerHeight * 1.05} L ${containerWidth * 1.00} ${containerHeight * 1.10}`;
  xArrow.setAttribute('d', xArrowPath);
  xArrow.setAttribute('stroke', '#888888');
  xArrow.setAttribute('stroke-width', '2');
  xArrow.setAttribute('fill', 'none');
  svg.appendChild(xArrow);

  // Create Y-axis arrow (placed to the left of the grid)
  const yArrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const yArrowPath = `M ${-0.1 * containerWidth} ${containerHeight * 1.05} L ${-0.1 * containerWidth} ${-0.1 * containerHeight} L ${-0.15 * containerWidth} ${-0.05 * containerHeight} M ${-0.1 * containerWidth} ${-0.1 * containerHeight} L ${-0.05 * containerWidth} ${-0.05 * containerHeight}`;
  yArrow.setAttribute('d', yArrowPath);
  yArrow.setAttribute('stroke', '#888888');
  yArrow.setAttribute('stroke-width', '2');
  yArrow.setAttribute('fill', 'none');
  svg.appendChild(yArrow);

  // Add X-axis label
  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute('x', containerWidth * 1.05);
  xLabel.setAttribute('y', containerHeight * 1.05 + 15);
  xLabel.setAttribute('fill', '#888888');
  xLabel.textContent = 'X';
  svg.appendChild(xLabel);

  // Add Y-axis label
  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute('x', -15);
  yLabel.setAttribute('y', -0.1 * containerHeight);
  yLabel.setAttribute('fill', '#888888');
  yLabel.textContent = 'Y';
  svg.appendChild(yLabel);

  // Create a dot for the (X, Y) position
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttribute('r', '5');
  dot.setAttribute('fill', '#888888');
  dot.setAttribute('cx', centerX);
  dot.setAttribute('cy', centerY);
  svg.appendChild(dot);

  function updateValues() {
    const x = parseFloat(xInput.value) || 0;
    const y = parseFloat(yInput.value) || 0;
    const angle = parseFloat(angleInput.value) || 0;

    // Update stick rotation around the center
    stick.style.transformOrigin = `${centerX}px ${centerY}px`;
    stick.style.transform = `rotate(${angle}deg)`;

    // Calculate new dot position based on grid cells
    const dotX = centerX + x * cellWidth;
    const dotY = centerY - y * cellHeight;

    // Animate the dot movement
    dot.animate([
      { cx: dot.getAttribute('cx'), cy: dot.getAttribute('cy') },
      { cx: dotX, cy: dotY }
    ], {
      duration: 500,
      easing: 'ease-in-out',
      fill: 'forwards'
    }).onfinish = () => {
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

    document.getElementById('xOffset').textContent = offsetX.toFixed(3);
    document.getElementById('yOffset').textContent = offsetY.toFixed(3);

    console.log(`Calculated angle: ${calculatedAngle}`);
    console.log(`Length: ${length}`);
    console.log(`Coordinates: ${coordinates}`);
    console.log(`Offset x: ${offsetX.toFixed(3)}`);
    console.log(`Offset y: ${offsetY.toFixed(3)}`);
  }

  xInput.addEventListener('input', updateCalculations);
  yInput.addEventListener('input', updateCalculations);
  angleInput.addEventListener('input', updateCalculations);

  updateCalculations();
  updateValues();
});
