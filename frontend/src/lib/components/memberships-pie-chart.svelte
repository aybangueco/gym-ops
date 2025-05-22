<script lang="ts">
	import type { Membership, TotalMember } from '@modules/dashboard';
	import {
		PieController,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Title,
		Tooltip,
		ArcElement
	} from 'chart.js';
	import { onDestroy, onMount } from 'svelte';

	let {
		barTitle,
		chartData,
		memberships
	}: { barTitle: string; chartData: TotalMember[]; memberships: Membership[] } = $props();
	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chart = $state<Chart<'pie'> | undefined>(undefined);

	const createRandomColor = () => {
		const r = Math.floor(Math.random() * 156 + 100);
		const g = Math.floor(Math.random() * 156 + 100);
		const b = Math.floor(Math.random() * 156 + 100);
		return `rgba(${r}, ${g}, ${b}, 0.7)`;
	};

	Chart.register(PieController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

	function createChart() {
		const backgroundColors = chartData.map(() => createRandomColor());

		if (!canvas) return;
		return new Chart(canvas, {
			type: 'pie',
			data: {
				labels: chartData.map(
					(e) => memberships.find((membership) => membership.id === e.membership)?.membership_name
				),
				datasets: [
					{
						label: `Total Members`,
						data: chartData.map((e) => e.total),
						backgroundColor: backgroundColors,
						borderColor: 'rgba(75, 192, 192, 1)',
						borderWidth: 1
					}
				]
			}
		});
	}

	onMount(() => {
		chart = createChart();
	});

	$effect(() => {
		if (!chart) return;
		chartData.map(
			(e) => memberships.find((membership) => membership.id === e.membership)?.membership_name
		);
		chart.data.datasets[0].data = chartData.map((e) => e.total);
		chart.update();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="rounded-md bg-secondary p-5">
	<h1 class="text-2xl font-bold">
		{barTitle}
	</h1>
	<canvas bind:this={canvas} class="h-full w-full"></canvas>
</div>
