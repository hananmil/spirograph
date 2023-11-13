<script lang="ts">
	import { showFigures, showDots, isPaused, rotateCamera, cameraFocalDistance, stepsPerSecond } from '$lib';
	import Button, { Icon, Label } from '@smui/button';
	import Card, { Content } from '@smui/card';
	import Checkbox from '@smui/checkbox';
	import Swtich from '@smui/switch';
	import Slider from '@smui/slider';
	import FormField from '@smui/form-field';
	import Switch from '@smui/switch/src/Switch.svelte';
	export let reset: () => void;
</script>

<Card>
	<Content>
		<h3>Settings</h3>
		<FormField>
			<Icon class="material-icons">
				<span class="material-symbols-outlined"> videocam </span>
				<span class="material-symbols-outlined"> 360 </span>
			</Icon>
			<Switch bind:checked={$rotateCamera} />
		</FormField>
		<FormField>
			<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
				{$cameraFocalDistance}
			</span>
			<Icon class="material-icons">
				<span class="material-symbols-outlined"> videocam </span>
				<span class="material-symbols-outlined"> square_foot </span>
			</Icon>
			<Slider bind:value={$cameraFocalDistance} min={10} max={200} style="flex-grow: 1;" />
			<!-- <input type="range" bind:value={$cameraFocalDistance} min={10} max={200} step="1" /> -->
		</FormField>
		<FormField>
			<span slot="label" style="padding-right: 12px; width: max-content; display: block;">
				{$stepsPerSecond}
			</span>
			<Icon class="material-icons">
				<span class="material-symbols-outlined">
					60fps_select
					</span>
			</Icon>
			<Slider bind:value={$stepsPerSecond} min={1} max={1000} step={1} style="flex-grow: 1;" />
		</FormField>
		<FormField>
			<Icon class="material-icons">
				<span class="material-symbols-outlined"> visibility </span>
				<span class="material-symbols-outlined"> shape_line </span>
			</Icon>
			<Switch bind:checked={$showFigures} />
		</FormField>
		<FormField>
			<Icon class="material-icons">
				<span class="material-symbols-outlined"> visibility </span>
				<span class="material-symbols-outlined"> scatter_plot </span>
			</Icon>
			<Switch bind:checked={$showDots} />
		</FormField>
		<FormField>
            <Icon class="material-icons">
                <span class="material-symbols-outlined"> {$isPaused? "paused":"play_arrow"} </span>
            </Icon>
			<Switch bind:checked={$isPaused}/>
		</FormField>
		<FormField align="end">
			<Button on:click={() => reset()}>
				<Icon class="material-icons">refresh</Icon>
				<Label>Reset time</Label>
			</Button>
		</FormField>
	</Content>
</Card>

<style lang="less">
	:global(.smui-card) {
		margin-bottom: 12px;
	}

	:global(.mdc-form-field) {
		display: flex;
	}
</style>
