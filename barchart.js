// Load the data from the CSV file
d3.csv("ACI-IoT-2023.csv").then(data => {
    // Step 1: Process the data to count occurrences of each protocol
    const protocolCounts = d3.rollup(
        data,
        v => v.length, // Count the number of rows for each protocol
        d => d.Protocol // Group by the 'Protocol' column
    );

    // Convert to an array of objects for easier use in D3
    const processedData = Array.from(protocolCounts, ([protocol, count]) => ({ protocol, count }));

    // Step 2: Set up chart dimensions and margins
    const margin = { top: 30, right: 30, bottom: 50, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Step 3: Set up scales
    const x = d3.scaleBand()
        .domain(processedData.map(d => d.protocol)) // Protocols as categories
        .range([0, width])
        .padding(0.2); // Add padding between bars

    const y = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.count)]) // Counts as values
        .nice() // Round the domain for better visuals
        .range([height, 0]);

    // Step 4: Add axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y));

    // Step 5: Draw bars
    svg.selectAll(".bar")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.protocol))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.count))
        .on("mouseover", (event, d) => {
            tooltip.style("opacity", 1)
                .html(`${d.protocol}: ${d.count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 25) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

    // Step 6: Add a tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");
});
