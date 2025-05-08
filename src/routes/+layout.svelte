<svelte:head>
	<title>FileFlowarr</title>
	<meta name="description" content="The fastest way to send your Sonarr and Radarr libraries to FileFlows for automated processing and optimization—just one click per show or movie." />
	<meta name="theme-color" content="#1a1a1a" />
	<meta property="og:title" content="Flowarr – Sonarr & Radarr to FileFlows" />
	<meta property="og:description" content="Effortlessly browse your entire TV and movie collection, see which titles are already optimized, and add new ones to FileFlows with a single click." />
	<meta property="og:type" content="website" />
</svelte:head>

<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
