<script lang="ts">
	import { MemberForm } from '@modules/dashboard/member';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<MemberForm memberships={data.membershipsData?.memberships ?? []} />
