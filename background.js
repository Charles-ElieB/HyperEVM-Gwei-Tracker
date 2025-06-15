async function updateGweiBadge() {
  try {
    const res = await fetch("https://rpc.hyperliquid.xyz/evm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 1
      })
    });

    const data = await res.json();
    const wei = BigInt(data.result);
    const gweiInt = wei / 1_000_000_000n;
    const gweiDec = (wei % 1_000_000_000n) / 100_000_000n;
    const gweiStr = `${gweiInt}.${gweiDec}`;

    // Display on extension icon
    chrome.action.setBadgeText({ text: gweiStr });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

  } catch (err) {
    console.error("Error Gwei:", err);
    chrome.action.setBadgeText({ text: "ERR" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
  }
}

// Update every 5 seconds
updateGweiBadge();
setInterval(updateGweiBadge, 5000);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateGwei") {
    updateGweiBadge();
  }
});

// ✅ Adds an alarm to startup
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("updateGwei", { periodInMinutes: 0.1 }); // Every 6 seconds
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateGwei") {
    updateGweiBadge();
  }
});

// ✅ We force a direct update at the very beginning
updateGweiBadge();

// ✅ Message listener for popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "updateGwei") {
    updateGweiBadge();
  }
});