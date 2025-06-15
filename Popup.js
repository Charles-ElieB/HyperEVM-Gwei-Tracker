async function fetchGasPrice() {
  const rpcUrl = "https://rpc.hyperliquid.xyz/evm";

  try {
    const res = await fetch(rpcUrl, {
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
    const gweiDec = (wei % 1_000_000_000n) / 100_000_000n; // 1 décimale

    document.getElementById("gwei").textContent = `${gweiInt}.${gweiDec} Gwei`;
  } catch (err) {
    console.error(err);
    document.getElementById("gwei").textContent = "Loading error";
  }
}

fetchGasPrice();
setInterval(fetchGasPrice, 5000);
chrome.runtime.sendMessage({ type: "updateGwei" });

