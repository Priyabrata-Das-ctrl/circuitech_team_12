document.addEventListener("DOMContentLoaded", function () {
    // Function to create a chart
    function createChart(ctx, label, data, color) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: Array(data.length).fill("").map((_, i) => `Point ${i + 1}`),
                datasets: [{
                    label: label,
                    data: data,
                    borderColor: color,
                    backgroundColor: "rgba(0, 102, 204, 0.2)",
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: "top" },
                },
            },
        });
    }

    // Fetch data from ThingSpeak
    async function fetchData(field) {
        const response = await fetch(
            `https://api.thingspeak.com/channels/<ThingSpeak_Channel_ID>/fields/${field}.json?results=10&api_key=<ThingSpeak_Read_API_Key>`
        );
        const json = await response.json();
        return json.feeds.map(feed => parseFloat(feed[`field${field}`]) || 0);
    }

    // Render charts
    const phCtx = document.getElementById("phChart").getContext("2d");
    const turbidityCtx = document.getElementById("turbidityChart").getContext("2d");
    const oxygenCtx = document.getElementById("oxygenChart").getContext("2d");
    const temperatureCtx = document.getElementById("temperatureChart").getContext("2d");

    Promise.all([
        fetchData(1), // Field 1: pH Levels
        fetchData(2), // Field 2: Turbidity
        fetchData(3), // Field 3: Dissolved Oxygen
        fetchData(4), // Field 4: Temperature
    ]).then(([phData, turbidityData, oxygenData, temperatureData]) => {
        createChart(phCtx, "pH Levels", phData, "#0066cc");
        createChart(turbidityCtx, "Turbidity", turbidityData, "#ff9900");
        createChart(oxygenCtx, "Dissolved Oxygen", oxygenData, "#33cc33");
        createChart(temperatureCtx, "Temperature", temperatureData, "#cc0000");
    });
});
