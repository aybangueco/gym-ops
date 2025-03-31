<script lang="ts">
	import { goto } from '$app/navigation';
	import { ThemeToggle } from '$lib/components/ui/theme-toggle';
	import { Button } from '$lib/components/ui/button';
</script>

<!-- Header Section -->
<header class="flex w-full items-center justify-between border p-5">
	<h1 class="text-3xl font-bold">Gym Ops</h1>
	<nav>
		<ul class="flex items-center justify-center gap-3">
			<li class="hover:bg-secondary rounded-md border p-2 hover:cursor-pointer">
				<a href="/register">Get Started</a>
			</li>
			<li>
				<ThemeToggle />
			</li>
		</ul>
	</nav>
</header>

<!-- Hero Section -->
<section class="bg-primary/5 py-20">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-4xl font-bold md:text-5xl">Manage Your Gym Operations</h2>
		<p class="mx-auto mb-8 max-w-xl text-lg">
			Streamline membership tracking, schedule classes, and optimize your fitness business with our
			all-in-one gym management solution.
		</p>
		<Button onclick={() => goto('/register')} class="rounded-md px-6 py-3 font-semibold"
			>Start Free Trial</Button
		>
	</div>
</section>

<!-- Features Section -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<h2 class="mb-12 text-center text-3xl font-bold">Why Choose Gym Ops?</h2>

		<div class="grid gap-8 md:grid-cols-3">
			<!-- Feature 1 -->
			<div class="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 text-primary rounded-full p-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Member & Membership Management</h3>
				<p class="text-gray-600 dark:text-gray-300">
					Easily track memberships, payments, and attendance with our intuitive dashboard.
				</p>
			</div>

			<!-- Feature 2 -->
			<div class="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 text-primary rounded-full p-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Inventory Management</h3>
				<p class="text-gray-600 dark:text-gray-300">
					Create and manage inventory items from your gym.
				</p>
			</div>

			<!-- Feature 3 -->
			<div class="rounded-lg border p-6 text-center shadow-sm transition-all hover:shadow-md">
				<div class="mb-4 flex justify-center">
					<div class="bg-primary/10 text-primary rounded-full p-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
				</div>
				<h3 class="mb-2 text-xl font-semibold">Performance Analytics</h3>
				<p class="text-gray-600 dark:text-gray-300">
					Gain insights into your gym's performance with detailed reports and analytics.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Testimonial Section
<section class="bg-primary/5 py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-12 text-3xl font-bold">What Our Customers Say</h2>

		<div class="mx-auto max-w-2xl rounded-lg border bg-white p-8 shadow-sm dark:bg-gray-800">
			<p class="mb-4 text-lg italic">
				"Since implementing Gym Ops, we've increased membership retention by 30% and streamlined all
				our administrative tasks. The system practically pays for itself!"
			</p>
			<div class="mt-4">
				<p class="font-semibold">Sarah Johnson</p>
				<p class="text-sm text-gray-600 dark:text-gray-300">Fitness Center Owner</p>
			</div>
		</div>
	</div>
</section> -->

<!-- CTA Section -->
<section class="py-16">
	<div class="container mx-auto px-4 text-center">
		<h2 class="mb-4 text-3xl font-bold">Ready to Transform Your Gym Business?</h2>
		<p class="mx-auto mb-8 max-w-xl">
			Join thousands of gym owners who have simplified their operations and grown their business
			with Gym Ops.
		</p>
		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<Button onclick={() => goto('/register')} class="rounded-md px-6 py-3 font-semibold"
				>Start Free Trial</Button
			>
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="border-t bg-gray-50 py-12 dark:bg-gray-900">
	<div class="container mx-auto px-4">
		<div class="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row">
			<h1 class="text-3xl font-bold">Gym Ops</h1>
			<nav>
				<ul class="flex flex-wrap gap-6">
					<li><a href="/features" class="hover:text-primary">Features</a></li>
					<li><a href="/pricing" class="hover:text-primary">Pricing</a></li>
					<li><a href="/resources" class="hover:text-primary">Resources</a></li>
					<li><a href="/contact" class="hover:text-primary">Contact</a></li>
				</ul>
			</nav>
		</div>
		<div class="border-t pt-8 text-center text-sm">&copy; 2025 Gym Ops. All rights reserved.</div>
	</div>
</footer>
