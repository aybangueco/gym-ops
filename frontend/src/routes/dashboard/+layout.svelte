<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { Separator } from '$lib/components/ui/separator';
	import { Menu, Home, FileUser, Users, Settings, LogOut } from '@lucide/svelte';
	import { logOut } from '@modules/auth';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { children } = $props();
	let sidebarOpen = $state(false);
</script>

<div class="flex h-screen min-h-screen overflow-hidden bg-background">
	<!-- Sidebar Overlay -->
	{#if sidebarOpen}
		<button
			class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
			onclick={() => (sidebarOpen = !sidebarOpen)}>a</button
		>
	{/if}

	<!-- Sidebar -->
	<aside
		class={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r bg-card transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
	>
		<div class="p-6 text-center">
			<h2 class="text-2xl font-semibold tracking-tight">Gym Ops</h2>
		</div>
		<Separator />
		<ScrollArea class="flex-1 px-3">
			<nav class="flex flex-col gap-2 py-4">
				<Button variant="ghost" class="justify-start gap-2 px-3" onclick={() => goto('/dashboard')}>
					<Home class="h-4 w-4" />
					<span>Home</span>
				</Button>
				<Button
					variant="ghost"
					class="justify-start gap-2 px-3"
					onclick={() => goto('/dashboard/manage-members')}
				>
					<Users class="h-4 w-4" />
					<span>Manage Members</span>
				</Button>
				<Button
					variant="ghost"
					class="justify-start gap-2 px-3"
					onclick={() => goto('/dashboard/manage-memberships')}
				>
					<FileUser class="h-4 w-4" />
					<span>Manage Memberships</span>
				</Button>
				<Button variant="ghost" class="justify-start gap-2 px-3">
					<Settings class="h-4 w-4" />
					<span>Account settings</span>
				</Button>
			</nav>
		</ScrollArea>
		<div class="mt-auto border-t p-4">
			<Button variant="outline" class="w-full justify-start gap-2" onclick={logOut}>
				<LogOut class="h-4 w-4" />
				<span>Logout</span>
			</Button>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Top navigation for mobile menu button -->
		<header class="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
			<Button
				variant="ghost"
				size="icon"
				class="md:hidden"
				onclick={() => (sidebarOpen = !sidebarOpen)}
			>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle menu</span>
			</Button>
			<h1 class="font-semibold">{page.url.pathname}</h1>
		</header>

		<!-- Page content -->
		<main class="h-full flex-1 overflow-auto p-6">
			{@render children()}
		</main>
	</div>
</div>
