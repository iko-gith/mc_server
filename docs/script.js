const API_URL = "http://85.174.249.145:3000/api/status";

const serverStatus = document.getElementById("server-status");
const playerCount = document.getElementById("player-count");
const serverVersion = document.getElementById("server-version");
const serverMotd = document.getElementById("server-motd");
const playersList = document.getElementById("players-list");
const lastUpdated = document.getElementById("last-updated");
const refreshButton = document.getElementById("refresh-button");
const serverAddress = document.getElementById("server-address");

async function loadServerStatus() {
    serverStatus.textContent = "Loading...";
    serverStatus.className = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch server status");
        }

        const data = await response.json();

        updateServerInfo(data);

    } catch (error) {
        console.error("Failed to load server status:", error);

        serverStatus.textContent = "Error";
        serverStatus.className = "offline";

        playerCount.textContent = "- / -";
        serverVersion.textContent = "-";
        serverMotd.textContent =
            "Unable to load server information.";

        playersList.textContent =
            "Unable to load players.";
    }
}

function updateServerInfo(data) {
    serverAddress.textContent =
        data.address ?? "Unknown";

    if (!data.online) {
        serverStatus.textContent = "Offline";
        serverStatus.className = "offline";

        playerCount.textContent = "0 / 0";
        serverVersion.textContent = "-";

        serverMotd.textContent =
            "The server is currently offline.";

        playersList.textContent =
            "No players online.";

        lastUpdated.textContent =
            `Last updated: ${new Date().toLocaleTimeString()}`;

        return;
    }

    serverStatus.textContent = "Online";
    serverStatus.className = "online";

    const onlinePlayers =
        data.players?.online ?? 0;

    const maxPlayers =
        data.players?.max ?? 0;

    playerCount.textContent =
        `${onlinePlayers} / ${maxPlayers}`;

    serverVersion.textContent =
        data.version ?? "Unknown";

    serverMotd.textContent =
        data.motd ?? "No MOTD available.";

    updatePlayers(
        data.players?.names ?? []
    );

    lastUpdated.textContent =
        `Last updated: ${new Date().toLocaleTimeString()}`;
}

function updatePlayers(players) {
    playersList.innerHTML = "";

    if (players.length === 0) {
        playersList.textContent =
            "No players online.";

        return;
    }

    players.forEach(name => {
        const playerElement =
            document.createElement("div");

        playerElement.className =
            "player";

        playerElement.textContent =
            name;

        playersList.appendChild(
            playerElement
        );
    });
}

refreshButton.addEventListener(
    "click",
    loadServerStatus
);

loadServerStatus();
setInterval(
    loadServerStatus,
    5 * 60 * 1000
);
