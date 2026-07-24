const SERVER_ADDRESS = "5.143.129.175";

const API_URL =
    `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`;


const serverStatus = document.getElementById("server-status");
const playerCount = document.getElementById("player-count");
const serverVersion = document.getElementById("server-version");
const serverMotd = document.getElementById("server-motd");
const serverIcon = document.getElementById("server-icon");
const playersList = document.getElementById("players-list");
const lastUpdated = document.getElementById("last-updated");
const refreshButton = document.getElementById("refresh-button");


document.getElementById("server-address").textContent =
    SERVER_ADDRESS;


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
        console.error(error);

        serverStatus.textContent = "Error";
        serverStatus.className = "offline";

        playerCount.textContent = "- / -";
        serverVersion.textContent = "-";
        serverMotd.textContent = "Unable to load server information.";

        playersList.textContent = "Unable to load players.";
    }
}


function updateServerInfo(data) {
    if (!data.online) {
        serverStatus.textContent = "Offline";
        serverStatus.className = "offline";

        playerCount.textContent = "0 / 0";

        serverVersion.textContent = "-";

        serverMotd.textContent =
            "The server is currently offline.";

        playersList.textContent =
            "No players online.";

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

    if (data.motd && data.motd.clean) {
        serverMotd.textContent =
            data.motd.clean.join(" ");
    } else {
        serverMotd.textContent =
            "No MOTD available.";
    }


    updatePlayers(data.players?.list ?? []);


    if (data.icon) {
        serverIcon.src = data.icon;
    } else {
        serverIcon.style.display = "none";
    }


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


    players.forEach(player => {

        const playerElement =
            document.createElement("div");

        playerElement.className = "player";

        playerElement.textContent =
            player.name;

        playersList.appendChild(playerElement);
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


const GITHUB_USERNAME = "iko-gith";
const GITHUB_REPOSITORY = "mc_server";

const README_URL =
    `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/main/README.md`;

async function loadReadme() {
    const readmeContent =
        document.getElementById("readme-content");

    const revealButton =
        document.getElementById(
            "reveal-readme-button"
        );

    try {
        const response =
            await fetch(README_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const markdown =
            await response.text();

        readmeContent.innerHTML =
            DOMPurify.sanitize(
                marked.parse(markdown)
            );

        readmeContent
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
                readmeContent.classList.add(
                    "revealed"
                );

                revealButton.remove();
            }
        );

    } catch (error) {
        console.error(
            "Failed to load README:",
            error
        );

        readmeContent.textContent =
            "Unable to load README.md: " +
            error.message;
    }
}

loadReadme();

const CHANGELOG_URL =
    "https://raw.githubusercontent.com/iko-gith/mc_server/main/changelog.md";

async function loadChangelog() {
    const changelogContent =
        document.getElementById("changelog-content");

    const revealButton =
        document.getElementById("reveal-changelog-button");

    try {
        const response = await fetch(CHANGELOG_URL);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const changelog = await response.text();
        const entries = changelog.split(
            /(?=^## \d{2}\.\d{2}\.\d{4}\s*$)/m
        );

        const firstEntry = entries[0];
        const remainingEntries = entries.slice(1).join("");

        changelogContent.innerHTML = marked.parse(firstEntry);

        if (remainingEntries.trim() !== "") {
            revealButton.hidden = false;

            revealButton.addEventListener("click", () => {
                changelogContent.textContent =
                    marked.parse(firstEntry) + marked.parse(remainingEntries);

                changelogContent.classList.add("revealed");

                revealButton.remove();
            });
        }

    } catch (error) {
        console.error("Failed to load changelog:", error);

        changelogContent.textContent =
            "Unable to load changelog.txt: " + error.message;
    }
}

loadChangelog();
