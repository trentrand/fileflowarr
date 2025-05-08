<script lang="ts">
  import { onMount } from "svelte";
  import MediaCard from "$lib/MediaCard.svelte";
  type Item = {
    id: number;
    title: string;
    path: string;
    poster: string;
    type: "series" | "movie";
    inFileFlows: boolean;
    saving?: {
      Library: string;
      TotalFiles: number;
      FinalSize: number;
      OriginalSize: number;
    };
  };

  let items: Item[] = [];
  let savings: any[] = [];
  let loading = true;
  let error = "";
  let adding: Record<number, boolean> = {};
  let hideAdded = false;
  let tab: "series" | "movie" = "series";

  $: totalFinal = savings.reduce((sum, s) => sum + (s.FinalSize || 0), 0);
  $: totalOriginal = savings.reduce((sum, s) => sum + (s.OriginalSize || 0), 0);

  async function fetchConfig() {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Config not found");
    return await res.json();
  }

  async function fetchSonarrSeries(_config: { sonarrUrl: string; sonarrApiKey: string }) {
    const res = await fetch("/api/sonarr");
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((s: any) => ({
      id: s.id,
      title: s.title,
      path: s.path,
      poster: s.images?.find((img: any) => img.coverType === "poster")?.remoteUrl || "",
      type: "series"
    }));
  }

  async function fetchRadarrMovies(_config: { radarrUrl: string; radarrApiKey: string }) {
    const res = await fetch("/api/radarr");
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((m: any) => ({
      id: m.id,
      title: m.title,
      path: m.path,
      poster: m.images?.find((img: any) => img.coverType === "poster")?.remoteUrl || "",
      type: "movie"
    }));
  }

  async function fetchFileFlowsLibraries(_config: { fileflowsUrl: string }) {
    const res = await fetch("/api/fileflows");
    if (!res.ok) return [];
    return await res.json();
  }

  async function load() {
    loading = true;
    error = "";
    try {
      const config = await fetchConfig();
      const [series, movies, libraries, savingsData] = await Promise.all([
        fetchSonarrSeries(config),
        config.radarrUrl && config.radarrApiKey
          ? fetchRadarrMovies(config)
          : Promise.resolve([]),
        fetchFileFlowsLibraries(config),
        fetch("/api/fileflows/savings").then(r => r.ok ? r.json() : [])
      ]);
      savings = savingsData;
      items = [...series, ...movies].map(item => {
        const lib = libraries.find((lib: any) => lib.Path === item.path);
        let saving = null;
        if (lib) {
          // Try to match by library name (case-insensitive)
          saving = savings.find((s: any) =>
            s.Library?.toLowerCase() === lib.Name?.toLowerCase()
          );
        }
        return {
          ...item,
          inFileFlows: !!lib,
          saving
        };
      });
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    loading = false;
  }

  onMount(load);

  async function addToFileFlows(item: Item) {
    adding[item.id] = true;
    // Compose minimal required library object
    const now = new Date().toISOString();
    const flowName = item.type === "series" ? "Optimize Television" : "Optimize Movie";
    const body = {
      Name: item.title,
      Path: item.path,
      Enabled: true,
      DateCreated: now,
      DateModified: now,
      Extensions: [
        "ts", "mp4", "mkv", "avi", "mpe", "mpeg", "mov", "mpv", "flv", "wmv", "webm", "avchd", "h264", "h265"
      ],
      Flow: {
        Name: flowName
      },
      // Sensible defaults for required fields
      DetectFileCreation: 0,
      DetectFileLastWritten: 0,
      DetectFileSize: 0,
      DetectFileCreationLower: 0,
      DetectFileCreationUpper: 0,
      DetectFileLastWrittenLower: 0,
      DetectFileLastWrittenUpper: 0,
      DetectFileSizeLower: 0,
      DetectFileSizeUpper: 0,
      DownloadsDirectory: false,
      SkipFileAccessTests: false,
      Folders: false,
      WaitTimeSeconds: 0,
      ExcludeHidden: false,
      Schedule: "",
      ScanInterval: 10800,
      FileSizeDetectionInterval: 5,
      Priority: 0,
      ProcessingOrder: 0,
      HoldMinutes: 0,
      MaxRunners: 0,
      TopLevelOnly: false,
      DisableFileSystemEvents: false
    };
    try {
      const res = await fetch("/api/fileflows/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        item.inFileFlows = true;
        // Force Svelte to update the UI
        items = [...items];
      }
    } finally {
      adding[item.id] = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-16">
  <header class="sticky top-0 z-10 bg-white/80 backdrop-blur shadow-sm mb-8">
    <div class="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h1 class="text-4xl font-extrabold tracking-tight flex items-center gap-4 text-blue-900 drop-shadow">
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36"><rect width="36" height="36" rx="8" fill="#2563eb"/><path d="M10 18h16M18 10v16" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
        FileFlowarr
      </h1>
      {#if savings.length}
        <span class="inline-block bg-green-100 text-green-800 text-base font-semibold px-4 py-2 rounded-lg shadow">
          Saved <span class="font-bold">{((totalOriginal - totalFinal) / 1_000_000_000).toFixed(1)} GB</span>
          from <span class="font-bold">{(totalOriginal / 1_000_000_000).toFixed(1)} GB</span>
        </span>
      {/if}
    </div>
  </header>
  <main class="max-w-5xl mx-auto px-4">
    <div class="text-2xl font-semibold mb-6 text-blue-800">Your Collection</div>
    <div class="flex gap-4 mb-8 items-center justify-between">
      <div class="flex gap-4">
        <button
          class="px-6 py-2 rounded-t-lg font-bold text-blue-900 border-b-2 transition-colors duration-200"
          class:bg-blue-200={tab === 'series'}
          class:border-blue-600={tab === 'series'}
          class:border-transparent={tab !== 'series'}
          on:click={() => tab = 'series'}
        >
          Television
        </button>
        <button
          class="px-6 py-2 rounded-t-lg font-bold text-blue-900 border-b-2 transition-colors duration-200"
          class:bg-blue-200={tab === 'movie'}
          class:border-blue-600={tab === 'movie'}
          class:border-transparent={tab !== 'movie'}
          on:click={() => tab = 'movie'}
        >
          Movies
        </button>
      </div>
      <label class="flex items-center gap-2 text-blue-900 font-medium cursor-pointer select-none">
        <input type="checkbox" bind:checked={hideAdded} class="accent-blue-600 w-4 h-4" />
        Hide added
      </label>
    </div>
    {#if loading}
      <div class="text-lg text-blue-700 animate-pulse">Loading...</div>
    {:else if error}
      <div class="text-red-600 bg-red-100 border border-red-300 rounded p-4">{error}</div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {#each items.filter(i => i.type === tab && (!hideAdded || !i.inFileFlows)) as item}
          <MediaCard {item} adding={adding[item.id]} onAdd={addToFileFlows} />
        {/each}
      </div>
    {/if}
  </main>
</div>
