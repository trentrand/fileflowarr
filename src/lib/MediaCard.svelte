<script lang="ts">
  export let item: any;
  export let adding = false;
  export let onAdd: (item: any) => void;
</script>

<div class="h-full flex">
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4 flex flex-col items-center border border-gray-100 relative group w-full h-full min-h-[370px]">
    <img src={item.poster} alt={item.title} class="w-36 h-52 object-cover mb-3 rounded-xl shadow group-hover:scale-105 transition-transform duration-200" />
    <div class="font-bold text-lg text-gray-900 text-center mb-1">{item.title}</div>
    <div class="text-xs uppercase tracking-wide text-blue-500 mb-2">{item.type}</div>
    <div class="flex-1 flex flex-col w-full items-center justify-end">
      {#if item.inFileFlows}
        <span class="inline-block bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full mb-1 text-xs">In FileFlows</span>
        {#if item.saving}
          <div class="text-xs mt-1 text-gray-700 bg-green-50 rounded-full px-2 py-1">
            <span class="font-semibold text-green-800">Saved:</span>
            <span>{((Math.max(0, item.saving.OriginalSize - item.saving.FinalSize) / 1_000_000_000).toFixed(1))} GB</span>
            <span class="text-gray-500">({item.saving.TotalFiles} files)</span>
          </div>
        {:else}
          <span class="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mt-2 text-xs">Processing...</span>
        {/if}
      {:else}
        <button
          class="btn px-5 py-2 mt-3 text-base shadow hover:bg-blue-700 transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          on:click={() => onAdd(item)}
          disabled={adding}
        >
          {#if adding}
            <svg class="animate-spin mr-2" width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" stroke="#2563eb" stroke-width="2" stroke-dasharray="24" stroke-linecap="round"/></svg>
            Adding...
          {:else}
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect width="18" height="18" rx="4" fill="#fff"/><path d="M5 9h8M9 5v8" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/></svg>
            Add to FileFlows
          {/if}
        </button>
      {/if}
    </div>
  </div>
</div>


<style>
.btn {
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>
