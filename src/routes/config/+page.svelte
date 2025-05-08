<script lang="ts">
  import { onMount } from "svelte";
  let sonarrUrl = "";
  let sonarrApiKey = "";
  let radarrUrl = "";
  let radarrApiKey = "";
  let fileflowsUrl = "";
  let message = "";

  onMount(async () => {
    const res = await fetch("/api/config");
    if (res.ok) {
      const config = await res.json();
      if (config) {
        sonarrUrl = config.sonarrUrl ?? "";
        sonarrApiKey = config.sonarrApiKey ?? "";
        radarrUrl = config.radarrUrl ?? "";
        radarrApiKey = config.radarrApiKey ?? "";
        fileflowsUrl = config.fileflowsUrl ?? "";
      }
    }
  });

  async function save() {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sonarrUrl,
        sonarrApiKey,
        radarrUrl,
        radarrApiKey,
        fileflowsUrl
      })
    });
    message = res.ok ? "Configuration saved!" : "Failed to save configuration.";
  }
</script>

<h1 class="text-2xl font-bold mb-4">Flowarr Configuration</h1>
<form on:submit|preventDefault={save} class="space-y-4 max-w-lg">
  <div>
    <label class="block font-semibold">Sonarr URL</label>
    <input class="input" bind:value={sonarrUrl} required />
  </div>
  <div>
    <label class="block font-semibold">Sonarr API Key</label>
    <input class="input" bind:value={sonarrApiKey} required />
  </div>
  <div>
    <label class="block font-semibold">Radarr URL</label>
    <input class="input" bind:value={radarrUrl} required />
  </div>
  <div>
    <label class="block font-semibold">Radarr API Key</label>
    <input class="input" bind:value={radarrApiKey} required />
  </div>
  <div>
    <label class="block font-semibold">FileFlows URL</label>
    <input class="input" bind:value={fileflowsUrl} required />
  </div>
  <button class="btn btn-primary mt-4" type="submit">Save</button>
  {#if message}
    <div class="mt-2 text-green-600">{message}</div>
  {/if}
</form>

<style>
.input {
  @apply border rounded px-2 py-1 w-full;
}
.btn {
  @apply px-4 py-2 rounded bg-blue-600 text-white font-semibold;
}
</style>