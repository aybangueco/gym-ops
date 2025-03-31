<script lang="ts">
	let { children } = $props();
</script>

<main class="flex h-screen flex-col items-center justify-center">
	{@render children()}
</main>
