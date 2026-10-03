// ============================================================
// VOID TERMINAL v3.8
// NEXUS — Fictional Investigation
// ============================================================

let history = [];
let historyIndex = -1;

let currentPath = "/";
let securityLevel = 0;

let discovered = [];

let nexusUnlocked = false;
let echoUnlocked = false;
let anomalyUnlocked = false;
let finalUnlocked = false;
let endingUnlocked = false;
let hasGameEnded = false;


// ============================================================
// FILESYSTEM
// ============================================================

const filesystem = {

    "/": {
        folders: ["home", "system", "nexus"],
        files: ["README.txt"]
    },

    "/home": {
        folders: ["guest"],
        files: []
    },

    "/home/guest": {
        folders: ["documents", "downloads"],
        files: ["welcome.txt"]
    },

    "/home/guest/documents": {
        folders: [],
        files: [
            "notes.txt",
            "ideas.txt"
        ]
    },

    "/home/guest/downloads": {
        folders: [],
        files: [
            "mystery.dat"
        ]
    },

    "/system": {
        folders: [],
        files: [
            "config.sys",
            "kernel.log"
        ]
    },

    "/nexus": {
        folders: ["public"],
        files: [
            "about.txt"
        ]
    },

    "/nexus/public": {
        folders: ["archive"],
        files: [
            "welcome.txt",
            "employees.txt"
        ]
    },

    "/nexus/public/archive": {
        folders: [],
        files: [
            "incident_17.txt",
            "project_list.txt"
        ]
    }
};


// ============================================================
// FILE CONTENT
// ============================================================

const files = {

    "README.txt": `
VOID TERMINAL

This environment is fictional.

If you somehow discovered this terminal,
please stop looking around.

Seriously.
`,

    "welcome.txt": `
Welcome, guest.

You weren't supposed to have access to this environment.

If you're reading this,
someone forgot to remove something.
`,

    "notes.txt": `
I keep seeing the same symbol.

A circle.

Three lines through it.

I don't know what it means.
`,

    "ideas.txt": `
Things I should probably not write down here:

- Build something strange.
- Hide something inside it.
- Make sure nobody notices.

Maybe that's the point.
`,

    "mystery.dat": `
01000101 01000011 01001000 01001111
`,

    "config.sys": `
VOID SYSTEM CONFIGURATION

environment = SIMULATION
network = DISABLED
external_connections = FALSE

warning:
unexpected directory detected
`,

    "kernel.log": `
VOID KERNEL LOG

00:00 — system boot
00:01 — guest environment initialized
02:14 — signal anomaly detected
03:17 — unknown process
03:17 — process terminated
03:17 — process returned
`,

    "about.txt": `
NEXUS

"Information is power."

Established: 1987

Public purpose:
Research and technological development.

Private purpose:
[REDACTED]
`,

    "nexus_welcome.txt": `
NEXUS PUBLIC ARCHIVE

Welcome.

This archive contains publicly available
information regarding NEXUS operations.

Some information has been restricted.
`,

    "employees.txt": `
NEXUS PERSONNEL

Director:
M. Vale

Researchers:
Dr. E. Morrow
Dr. A. Kline

Security:
R. Cross

Several personnel records are unavailable.
`,

    "incident_17.txt": `
NEXUS INTERNAL ARCHIVE

INCIDENT 17

Location:
Facility E-4

Time:
02:14

Summary:

An unauthorized signal was detected.

The signal appeared to originate
from inside the facility.

No source was identified.

Three minutes later,
every security camera
stopped recording.
`,

    "project_list.txt": `
RESTRICTED PROJECT DETECTED.

CURRENT PROJECTS

PROJECT ORBIT
PROJECT LANTERN
PROJECT VEIL
PROJECT ECHO

PROJECT ECHO

STATUS:
RESTRICTED

ACCESS:
DIRECTOR LEVEL ONLY
`,

    // ========================================================
    // HIDDEN NEXUS FILES
    // ========================================================

    "classified.txt": `
PROJECT ECHO

CLASSIFICATION:
DIRECTOR LEVEL

The following information has been
partially recovered.

[DATA REDACTED]

Additional records exist.
`,

    "director.log": `
DIRECTOR'S PRIVATE LOG

The signal is changing.

Someone—or something—is responding.

I believe we made a mistake.

If the pattern is correct,
they already know we found them.
`,

    "morrow.txt": `
DR. MORROW — PRIVATE NOTE

ECHO responds to a specific word.

Do not repeat it near the receiver.

I am serious.

If the system reacts,
leave immediately.
`,

    "cross.txt": `
R. CROSS — SECURITY REPORT

There is another user inside the network.

The account does not exist
in the personnel database.

Username:

NULL
`,

    "null.txt": `
UNKNOWN USER — NULL

You are looking in the wrong place.

NEXUS is not the organization
you should be afraid of.

Look at the timestamps.
`,

    "timestamps.txt": `
RECOVERED TIMESTAMP RECORD

03:17
03:17
03:17
03:17

Every incident.

Every interruption.

Every unauthorized login.

03:17.
`,

    // ========================================================
    // ECHO
    // ========================================================

    "echo_final.txt": `
PROJECT ECHO — FINAL RECOVERY

[RECORD PARTIALLY CORRUPTED]

The signal is not coming from outside.

It is coming from the VOID Terminal.

The terminal was built as an interface
for the signal.

Someone has been using it to communicate.
`,

    // ========================================================
    // SYSTEM ANOMALY
    // ========================================================

    "signal.log": `
VOID SIGNAL RECORD

SOURCE:
[LOCAL]

ORIGIN:
[UNRESOLVED]

The signal appears to be responding
to terminal activity.

Last response:
03:17
`,

    "receiver.sys": `
RECEIVER STATUS

STATUS:
ACTIVE

INPUT:
UNKNOWN

OUTPUT:
UNKNOWN

The receiver should not exist
inside this environment.
`,

    // ========================================================
    // FINAL FILE
    // ========================================================

    "final.txt": `
HELLO, GUEST.

YOU FOUND US.

WE HAVE BEEN WAITING.

THIS WAS NEVER A HACK.

IT WAS AN INVITATION.
`
};


// ============================================================
// DOM ELEMENTS
// ============================================================

const output = document.getElementById("output");
const input = document.getElementById("commandInput");
const alertBox = document.getElementById("alert");


// ============================================================
// OUTPUT
// ============================================================

function print(text = "", className = "") {

    const line = document.createElement("div");

    if (className) {
        line.className = className;
    }

    line.innerHTML = escapeHTML(text)
        .replace(/\n/g, "<br>");

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}


function printCommand(command) {

    const line = document.createElement("div");

    line.className = "command";

    line.innerHTML =
        `<span class="prompt">guest@void:~$</span> ${escapeHTML(command)}`;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// PATH HELPERS
// ============================================================

function normalizePath(path) {

    if (path === "/") {
        return "/";
    }

    const parts = path
        .split("/")
        .filter(Boolean);

    const result = [];

    for (const part of parts) {

        if (part === "..") {

            result.pop();

        } else if (part !== ".") {

            result.push(part);
        }
    }

    return "/" + result.join("/");
}


function getParentPath(path) {

    if (path === "/") {
        return "/";
    }

    const parts = path
        .split("/")
        .filter(Boolean);

    parts.pop();

    if (parts.length === 0) {
        return "/";
    }

    return "/" + parts.join("/");
}


// ============================================================
// HELP
// ============================================================

function help() {

    print("");
    print("AVAILABLE COMMANDS", "green");
    print("");

    print("help — command list");
    print("clear — clear terminal");
    print("about — terminal information");
    print("ls — list files");
    print("cd [folder] — enter folder");
    print("pwd — current location");
    print("cat [file] — read file");
    print("scan — fictional system scan");
    print("status — system status");
    print("whoami — identify yourself");
    print("cd .. — go back to previous folder")

    if (securityLevel >= 1) {

        print("");
        print("Additional commands detected.", "yellow");
        print("");
        print("decrypt — attempt to decode a file");
        print("logs — inspect hidden logs");
    }

    if (nexusUnlocked) {

        print("");
        print("NEXUS ACCESS DETECTED.", "purple");
        print("");
        print("connect nexus — establish fictional connection");
    }

    if (anomalyUnlocked) {

        print("");
        print("SYSTEM ANOMALY DETECTED.", "red");
        print("");
        print("inspect — inspect current environment");
    }

    print("");
}


// ============================================================
// LS
// ============================================================

function listFiles() {

    const directory = filesystem[currentPath];

    if (!directory) {

        print("Directory data unavailable.", "red");
        return;
    }

    print("");

    directory.folders.forEach(folder => {

        print(`📁 ${folder}/`, "folder");

    });

    directory.files.forEach(file => {

        print(`📄 ${file}`, "file");

    });

    print("");
}


// ============================================================
// CD
// ============================================================

function changeDirectory(target) {

    if (!target) {

        print("Usage: cd [folder]", "yellow");
        return;
    }


    // Root
    if (target === "/") {

        currentPath = "/";

        print("Location changed to /", "green");

        return;
    }


    // Parent
    if (target === "..") {

        if (currentPath === "/") {

            print("Already at root directory.", "yellow");
            return;
        }

        currentPath = getParentPath(currentPath);

        print(
            `Location changed to ${currentPath}`,
            "green"
        );

        return;
    }


    // Absolute path
    if (target.startsWith("/")) {

        const newPath = normalizePath(target);

        if (filesystem[newPath]) {

            currentPath = newPath;

            print(
                `Location changed to ${currentPath}`,
                "green"
            );

        } else {

            print(
                `cd: ${target}: directory not found`,
                "red"
            );
        }

        return;
    }


    // Relative paths
    if (target.includes("/")) {

        const newPath = normalizePath(
            currentPath + "/" + target
        );

        if (filesystem[newPath]) {

            currentPath = newPath;

            print(
                `Location changed to ${currentPath}`,
                "green"
            );

        } else {

            print(
                `cd: ${target}: directory not found`,
                "red"
            );
        }

        return;
    }


    const directory = filesystem[currentPath];

    if (!directory) {

        print(
            "Current directory unavailable.",
            "red"
        );

        return;
    }


    if (!directory.folders.includes(target)) {

        print(
            `cd: ${target}: directory not found`,
            "red"
        );

        return;
    }


    const newPath =
        currentPath === "/"
            ? `/${target}`
            : `${currentPath}/${target}`;


    if (!filesystem[newPath]) {

        print(
            `cd: ${target}: directory not found`,
            "red"
        );

        return;
    }


    currentPath = newPath;

    print(
        `Location changed to ${currentPath}`,
        "green"
    );
}


// ============================================================
// CAT
// ============================================================

function readFile(filename) {

    if (!filename) {

        print("Usage: cat [file]", "yellow");
        return;
    }

    const directory = filesystem[currentPath];

    if (!directory) {

        print(
            "Current directory unavailable.",
            "red"
        );

        return;
    }


    if (!directory.files.includes(filename)) {

        print(
            `cat: ${filename}: file not found`,
            "red"
        );

        return;
    }


    let fileKey = filename;


    // Different welcome.txt inside NEXUS
    if (
        currentPath === "/nexus/public" &&
        filename === "welcome.txt"
    ) {

        fileKey = "nexus_welcome.txt";
    }


    if (!files[fileKey]) {

        print(
            `cat: ${filename}: unreadable`,
            "red"
        );

        return;
    }


    print("");
    print(files[fileKey]);
    print("");

    checkDiscovery(filename);
}


// ============================================================
// DISCOVERY SYSTEM
// ============================================================

function checkDiscovery(filename) {

    const discoveryKey =
        `${currentPath}/${filename}`;

    if (discovered.includes(discoveryKey)) {
        return;
    }


    discovered.push(discoveryKey);


    securityLevel++;


    // Project list unlocks NEXUS hidden layer
    if (filename === "project_list.txt") {

        nexusUnlocked = true;

        showAlert(
            "RESTRICTED DATA DISCOVERED"
        );
    }


    // Mystery data
    if (filename === "mystery.dat") {

        showAlert(
            "UNKNOWN DATA PATTERN DETECTED"
        );
    }


    // Timestamp discovery
    if (filename === "timestamps.txt") {

        showAlert(
            "TIMESTAMP PATTERN CONFIRMED"
        );
    }


    // ECHO discovery
    if (
        filename === "echo_final.txt" &&
        currentPath === "/nexus/public/archive/ECHO"
    ) {

        echoUnlocked = true;

        unlockSystemAnomaly();

        showAlert(
            "SYSTEM ANOMALY DETECTED"
        );
    }


    // Final discovery
    if (
        filename === "final.txt" &&
        currentPath === "/system/anomaly"
    ) {

        endingUnlocked = true;

        showAlert(
            "SYSTEM STATE CHANGED"
        );
    }
}


// ============================================================
// DECRYPT
// ============================================================

function decrypt() {

    print("");
    print(
        "Attempting fictional decryption...",
        "yellow"
    );

    setTimeout(() => {

        print("");
        print("KEY ACCEPTED.", "green");
        print("");

        if (securityLevel >= 1) {

            unlockNexusLayer();

            print(
                "Additional encrypted NEXUS data detected.",
                "purple"
            );

            print("");

            print(
                "The archive structure has changed.",
                "purple"
            );

            print("");

            print(
                "Try checking the NEXUS archive again.",
                "yellow"
            );

        } else {

            print(
                "No compatible encrypted data detected.",
                "yellow"
            );
        }

        print("");

    }, 500);
}


// ============================================================
// UNLOCK NEXUS
// ============================================================

function unlockNexusLayer() {

    const archive =
        filesystem["/nexus/public/archive"];


    if (!archive) {
        return;
    }


    // Hidden NEXUS files
    const hiddenFiles = [
        "classified.txt",
        "director.log",
        "morrow.txt",
        "cross.txt",
        "null.txt",
        "timestamps.txt"
    ];


    hiddenFiles.forEach(file => {

        if (!archive.files.includes(file)) {

            archive.files.push(file);
        }
    });


    // ========================================================
    // CREATE ECHO PROJECT FOLDER
    // ========================================================

    if (!archive.folders.includes("ECHO")) {

        archive.folders.push("ECHO");
    }


    // Create ECHO directory
    if (!filesystem["/nexus/public/archive/ECHO"]) {

        filesystem["/nexus/public/archive/ECHO"] = {

            folders: [],

            files: [
                "echo_final.txt"
            ]
        };
    }


    nexusUnlocked = true;
}


// ============================================================
// SYSTEM ANOMALY
// ============================================================

function unlockSystemAnomaly() {

    if (anomalyUnlocked) {
        return;
    }


    const system =
        filesystem["/system"];


    if (!system) {
        return;
    }


    if (!system.folders.includes("anomaly")) {

        system.folders.push("anomaly");
    }


    filesystem["/system/anomaly"] = {

        folders: [],

        files: [
            "signal.log",
            "receiver.sys"
        ]
    };


    anomalyUnlocked = true;
}


// ============================================================
// FINAL STAGE
// ============================================================

function unlockFinalStage() {

    if (finalUnlocked) {
        return;
    }


    const anomaly =
        filesystem["/system/anomaly"];


    if (!anomaly) {
        return;
    }


    if (!anomaly.files.includes("final.txt")) {

        anomaly.files.push("final.txt");
    }


    finalUnlocked = true;

    showAlert(
        "UNKNOWN RESPONSE DETECTED"
    );

    
}

// ============================================================
// LOGS
// ============================================================

function logs() {

    print("");
    print(
        "HIDDEN SYSTEM LOG",
        "green"
    );

    print("");

    print("03:17 — unauthorized signal");
    print("03:17 — camera failure");
    print("03:17 — unknown login");
    print("03:17 — NULL account detected");

    print("");

    print(
        "Why is everything happening at 03:17?",
        "yellow"
    );

    print("");
}


// ============================================================
// SCAN
// ============================================================

function scan() {

    print("");
    print(
        "Starting fictional scan...",
        "yellow"
    );

    print("");

    let progress = 0;


    const interval = setInterval(() => {

        progress += 10;


        const filled =
            "█".repeat(progress / 10);

        const empty =
            "░".repeat(10 - progress / 10);


        print(
            `[${filled}${empty}] ${progress}%`
        );


        if (progress >= 100) {

            clearInterval(interval);

            print("");

            print(
                "SCAN COMPLETE.",
                "green"
            );

            print("");

            print(
                "Local environment: SIMULATION"
            );

            if (anomalyUnlocked) {

                print(
                    "Warning: unexpected directory detected.",
                    "red"
                );

            } else {

                print(
                    "No unusual processes detected."
                );
            }

            print("");
        }

    }, 100);
}


// ============================================================
// STATUS
// ============================================================

function statusCommand() {

    print("");

    print("CPU .............. ONLINE");
    print("MEMORY ........... 42%");
    print("NETWORK .......... SIMULATED");
    print("SECURITY ......... ACTIVE");

    print(
        `SECURITY LEVEL ... ${securityLevel}`
    );

    print(
        `NEXUS ............ ${
            nexusUnlocked
                ? "CONNECTED"
                : "KNOWN"
        }`
    );

    print(
        `ECHO ............. ${
            echoUnlocked
                ? "UNLOCKED"
                : "LOCKED"
        }`
    );

    if (anomalyUnlocked) {

        print(
            "ANOMALY .......... DETECTED",
            "red"
        );
    }

    if (finalUnlocked) {

        print(
            "UNKNOWN RESPONSE . ACTIVE",
            "red"
        );
    }

    print("");
}


// ============================================================
// CONNECT NEXUS
// ============================================================

function connectNexus() {

    print("");

    print(
        "Connecting to fictional NEXUS network...",
        "yellow"
    );


    setTimeout(() => {

        nexusUnlocked = true;

        print("");

        print(
            "Connection established.",
            "green"
        );

        print("");

        print(
            "Welcome to NEXUS.",
            "purple"
        );

        print("");

        print(
            "You now have access to the public archive."
        );

        print("");

    }, 700);
}


// ============================================================
// INSPECT
// ============================================================

function inspect() {

    print("");

    print(
        "ENVIRONMENT INSPECTION",
        "green"
    );

    print("");

    print(
        `Current path: ${currentPath}`
    );

    print(
        `Security level: ${securityLevel}`
    );

    print(
        `NEXUS connection: ${
            nexusUnlocked
                ? "ACTIVE"
                : "INACTIVE"
        }`
    );

    print(
        `ECHO status: ${
            echoUnlocked
                ? "UNLOCKED"
                : "LOCKED"
        }`
    );

    print("");


    if (
        echoUnlocked &&
        anomalyUnlocked &&
        currentPath === "/system"
    ) {

        print(
            "Unexpected directory activity detected.",
            "yellow"
        );

        print("");

        print(
            "Something appears to be responding.",
            "red"
        );

        print("");

        print(
            "Check the newly detected system directory.",
            "yellow"
        );

        print("");

        return;
    }


    if (finalUnlocked) {

        print(
            "The terminal appears to be waiting.",
            "red"
        );

        print("");

        return;
    }


    print(
        "No unusual local processes detected."
    );

    print("");
}


// ============================================================
// WHOAMI
// ============================================================

function whoami() {

    print("");
    print("guest");
    print("");
}


// ============================================================
// PWD
// ============================================================

function pwd() {

    print("");
    print(currentPath);
    print("");
}


// ============================================================
// ABOUT
// ============================================================

function about() {

    print("");

    print(
        "VOID TERMINAL v3.8",
        "green"
    );

    print("");

    print(
        "Fictional investigative environment."
    );

    print(
        "Network status: SIMULATED"
    );

    print("");

    print(
        "Someone appears to have left something behind.",
        "yellow"
    );

    print("");
}


// ============================================================
// CLEAR
// ============================================================

function clearTerminal() {

    output.innerHTML = "";
}


// ============================================================
// ALERT
// ============================================================

function showAlert(message) {

    if (!alertBox) {
        return;
    }


    alertBox.textContent = message;

    alertBox.classList.add("show");


    setTimeout(() => {

        alertBox.classList.remove("show");

    }, 3000);
}


// ============================================================
// COMMAND PROCESSOR
// ============================================================

function processCommand(rawCommand) {

    const command = rawCommand.trim();


    if (!command) {
        return;
    }


    printCommand(command);


    const parts =
        command.split(/\s+/);


    const mainCommand =
        parts[0].toLowerCase();


    const argument =
        parts.slice(1)
        .join(" ")
        .trim();


    switch (mainCommand) {


        case "help":

            help();

            break;


        case "clear":

            clearTerminal();

            break;


        case "about":

            about();

            break;


        case "whoami":

            whoami();

            break;


        case "pwd":

            pwd();

            break;


        case "ls":

            listFiles();

            break;


        case "cd":

            changeDirectory(argument);

            break;


        case "cat":

            readFileWithProgression(argument);

            break;


        case "scan":

            scan();

            break;


        case "status":

            statusCommand();

            break;


        case "decrypt":

            decrypt();

            break;


        case "logs":

            logs();

            break;


        case "connect":

            if (
                argument.toLowerCase() === "nexus"
            ) {

                connectNexus();

            } else {

                print(
                    "Usage: connect nexus",
                    "yellow"
                );
            }

            break;


        case "inspect":

            if (anomalyUnlocked) {

                inspect();

            } else {

                print(
                    "Command not found.",
                    "red"
                );
            }

            break;


        default:

            print(
                `Command not found: ${command}`,
                "red"
            );

            print(
                "Type help for available commands.",
                "yellow"
            );
    }
}


// ============================================================
// PROGRESSION-AWARE FILE READER
// ============================================================

const originalReadFile = readFile;

function readFileWithProgression(filename) {

    originalReadFile(filename);


    // ========================================================
    // READING FINAL.TXT ENDS CHAPTER 1
    // ========================================================

    if (
    filename === "final.txt" &&
    currentPath === "/system/anomaly" &&
    finalUnlocked &&
    !hasGameEnded
) {

    hasGameEnded = true;

    // Wait 4 seconds so the player can read the final message
    setTimeout(() => {

        const blackScreen =
            document.getElementById("black-screen");

        const creditsScreen =
            document.getElementById("credits-screen");

        const creditsContent =
            document.getElementById("credits-content");

        if (!blackScreen || !creditsScreen || !creditsContent) {
            return;
        }


        // Fade to black
        blackScreen.classList.add("show");


        // Wait for the fade to finish
        setTimeout(() => {

            blackScreen.classList.remove("show");

            creditsScreen.style.display = "block";


            // Reset credits position
            creditsContent.style.top = "100%";


            // Start scrolling
            requestAnimationFrame(() => {

                creditsContent.style.transition =
                    "top 25s linear";

                creditsContent.style.top =
                    `-${creditsContent.offsetHeight}px`;

            });


            // After credits finish
            setTimeout(() => {

                const chapterTwo =
                    document.getElementById("chapter-two-screen");
                creditsScreen.style.display = "none";
                if (!chapterTwo) {
                    return;
                }


                chapterTwo.style.display = "flex";


                // Fade Chapter 2 in
                requestAnimationFrame(() => {

                    chapterTwo.style.opacity = "1";

                });


                // Keep Chapter 2 screen visible for 3 seconds
                setTimeout(() => {

                    chapterTwo.style.opacity = "0";

                }, 3000);

            }, 26000);

        }, 1600);

    }, 4000);
}


    // ========================================================
    // READING RECEIVER.SYS TRIGGERS FINAL STAGE
    // ========================================================

    if (
        filename === "receiver.sys" &&
        currentPath === "/system/anomaly" &&
        !finalUnlocked
    ) {

        setTimeout(() => {

            print("");

            print(
                "SIGNAL RESPONSE DETECTED.",
                "red"
            );

            print("");

            print(
                "The terminal has received something.",
                "yellow"
            );

            print("");

            unlockFinalStage();

            print(
                "A new file has appeared.",
                "purple"
            );

            print("");

        }, 400);
    }
}


// ============================================================
// INPUT HISTORY
// ============================================================

input.addEventListener("keydown", event => {


    // ENTER
    if (event.key === "Enter") {

        const command =
            input.value.trim();


        if (!command) {
            return;
        }


        history.push(command);

        historyIndex =
            history.length;


        // All commands go through the normal processor.
        processCommand(command);


        input.value = "";
    }


    // UP
    if (event.key === "ArrowUp") {

        if (history.length === 0) {
            return;
        }


        event.preventDefault();


        historyIndex =
            Math.max(
                0,
                historyIndex - 1
            );


        input.value =
            history[historyIndex] || "";
    }


    // DOWN
    if (event.key === "ArrowDown") {

        if (history.length === 0) {
            return;
        }


        event.preventDefault();


        historyIndex =
            Math.min(
                history.length,
                historyIndex + 1
            );


        input.value =
            history[historyIndex] || "";
    }
});


// ============================================================
// KEEP INPUT FOCUSED
// ============================================================

document.addEventListener("click", () => {

    input.focus();

});


// ============================================================
// INITIAL FOCUS
// ============================================================

input.focus();

// ============================================================
// GAME FINISHED
// ============================================================
