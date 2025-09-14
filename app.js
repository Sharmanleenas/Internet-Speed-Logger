const testBtn = document.getElementById("testBtn");
const statusEl = document.getElementById("status");
const logTable = document.getElementById("logTable");
const clearBtn = document.getElementById("clearBtn");

let logs = [];

function renderLogs() {
  logTable.innerHTML = "";
  logs.forEach((log, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${log.speed.toFixed(2)} Mbps</td>
        <td>${log.time}</td>
    `;
    logTable.appendChild(tr);
  });
}

async function testSpeed() {
  const fileUrl = "https://speed.cloudflare.com/__down?bytes=5000000";
  const fileSizeBytes = 5 * 1024 * 1024; // 5 MB
  statusEl.textContent = "Testing speed... Please wait";
  statusEl.classList.add("loading"); // add CSS pulse animation
  const startTime = new Date().getTime();

  try {
    const response = await fetch(fileUrl + "&cacheBust=" + Date.now());
    await response.blob();

    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000; // seconds
    const bitsLoaded = fileSizeBytes * 8;
    const speedMbps = bitsLoaded / duration / (1024 * 1024);

    statusEl.textContent = `Your Internet speed: ${speedMbps.toFixed(2)} Mbps`;
    statusEl.classList.remove("loading");

    logs.push({
      speed: speedMbps,
      time: new Date().toLocaleString(),
    });

    renderLogs();
  } catch (err) {
    statusEl.textContent = "Error testing speed!";
    statusEl.classList.remove("loading");
    console.error("Speed test failed", err);
  }
}

testBtn.addEventListener("click", testSpeed);

clearBtn.addEventListener("click", () => {
  logs = [];
  renderLogs();
  statusEl.textContent = "Logs Cleared";
});
