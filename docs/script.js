const SERVER_ADDRESS = "ikos-minecraft-server.duckdns.org";

const API_URL =
    `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`;

const serverStatus =
    document.getElementById("server-status");
const playerCount =
    document.getElementById("player-count");
const serverVersion =
    document.getElementById("server-version");
const serverMotd =
    document.getElementById("server-motd");
const serverIcon =
    document.getElementById("server-icon");
const playersList =
    document.getElementById("players-list");
const lastUpdated =
    document.getElementById("last-updated");
const refreshButton =
    document.getElementById("refresh-button");
const serverAddress =
    document.getElementById("server-address");

serverAddress.textContent =
    SERVER_ADDRESS;

async function loadServerStatus() {
    serverStatus.textContent = "Loading...";
    serverStatus.className = "";

    try {
        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const data =
            await response.json();
        updateServerInfo(data);

    } catch (error) {
        console.error(
            "Failed to load server status:",
            error
        );
        showServerError();
    }
}

function updateServerInfo(data) {
    if (!data.online) {
        showOfflineServer();
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
        data.motd?.clean?.join(" ")
        ?? "No MOTD available.";

    updatePlayers(
        data.players?.list ?? []
    );
    updateServerIcon(
        data.icon
    );
    updateLastUpdated();
}

function showOfflineServer() {
    serverStatus.textContent = "Offline";
    serverStatus.className = "offline";

    playerCount.textContent =
        "0 / 0";
    serverVersion.textContent =
        "-";

    serverMotd.textContent =
        "The server is currently offline.";
    playersList.textContent =
        "No players online.";

    updateServerIcon(null);
    updateLastUpdated();
}

function showServerError() {
    serverStatus.textContent = "Error";
    serverStatus.className = "offline";

    playerCount.textContent =
        "- / -";
    serverVersion.textContent =
        "-";

    serverMotd.textContent =
        "Unable to load server information.";
    playersList.textContent =
        "Unable to load players.";

    updateServerIcon(null);
    updateLastUpdated();
}

function updatePlayers(players) {
    playersList.innerHTML = "";

    if (players.length === 0) {
        playersList.textContent =
            "No players online.";

        return;
    }

    players.forEach(player => {
        const playerElement =
            document.createElement("div");
        playerElement.className =
            "player";
        playerElement.textContent =
            player.name;
        playersList.appendChild(
            playerElement
        );
    });
}

function updateServerIcon(icon) {
    if (icon) {
        serverIcon.src = icon;
        serverIcon.style.display = "";
    } else {
        serverIcon.style.display = "none";
    }
}

function updateLastUpdated() {
    lastUpdated.textContent =
        `Last updated: ${
            new Date().toLocaleTimeString()
        }`;
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


const GITHUB_USERNAME =
    "iko-gith";
const GITHUB_REPOSITORY =
    "mc_server";
const GITHUB_RAW_BASE =
    `https://raw.githubusercontent.com/` +
    `${GITHUB_USERNAME}/` +
    `${GITHUB_REPOSITORY}/main`;


async function loadMarkdownFile(
    fileName,
    contentId,
    revealButtonId
) {
    const content =
        document.getElementById(contentId);

    const revealButton =
        document.getElementById(
            revealButtonId
        );

    const url =
        `${GITHUB_RAW_BASE}/${fileName}`;

    try {
        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const markdown =
            await response.text();

        content.innerHTML =
            DOMPurify.sanitize(
                marked.parse(markdown)
            );

        content
            .querySelectorAll("a")
            .forEach(link => {
                link.target = "_blank";
                link.rel =
                    "noopener noreferrer";
            });

        revealButton.hidden = false;
        revealButton.addEventListener(
            "click",
            () => {
                content.classList.add(
                    "revealed"
                );

                revealButton.remove();
            }
        );

    } catch (error) {
        console.error(
            `Failed to load ${fileName}:`,
            error
        );

        content.textContent =
            `Unable to load ${fileName}: ` +
            error.message;
    }
}

loadMarkdownFile(
    "README.md",
    "readme-content",
    "reveal-readme-button"
);

loadMarkdownFile(
    "changelog.md",
    "changelog-content",
    "reveal-changelog-button"
);
