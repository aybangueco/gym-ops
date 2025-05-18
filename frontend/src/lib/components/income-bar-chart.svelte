<script lang="ts">
	import type { MonthIncome } from '@modules/dashboard';
	import {
		BarController,
		BarElement,
		CategoryScale,
		Chart,
		Legend,
		LinearScale,
		Title,
		Tooltip
	} from 'chart.js';
	import { onDestroy, onMount } from 'svelte';

	let { barTitle, chartData }: { barTitle: string; chartData: MonthIncome[] } = $props();
	let canvas = $state<HTMLCanvasElement | undefined>(undefined);
	let chart = $state<Chart<'bar'> | undefined>(undefined);

	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

	function createChart() {
		if (!canvas) return;
		return new Chart(canvas, {
			type: 'bar',
			data: {
				labels: chartData.map((e) => e.month),
				datasets: [
					{
						label: `Total Incomes`,
						data: chartData.map((e) => e.total_income),
						backgroundColor: 'rgba(75, 192, 192, 0.5)',
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
		chart.data.labels = chartData.map((e) => e.month);
		chart.data.datasets[0].data = chartData.map((e) => e.total_income);
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
