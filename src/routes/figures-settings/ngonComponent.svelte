<script lang="ts">
    import FormField from '@smui/form-field';
    import Content from '@smui/card';
    import Button, { Icon as ButtonIcon, Label as ButtonLabel } from '@smui/button';
    import type { NgonDTO,dto } from '$lib';
    export let i:number;
    export let figure: any;
    export let remove_figure: (i:number) => void;
    export let reset: () => void;

</script>

<Content>
    <h3>NGon</h3>
    <FormField align="end" style="display: flex;">
        <input
            type="range"
            style="flex-grow: 1;"
            bind:value={figure.numSides}
            min={2}
            max={20}
            on:change={() => reset()}
        />
        <span slot="label" style="padding-right: 12px; width: max-content; display: block;">
            Point count {figure.numSides}
        </span>
    </FormField> 
    <FormField align="end" style="display: flex;">
        <input
            type="range"
            style="flex-grow: 1;"
            bind:value={figure.radius}
            min={5}
            max={500}
            step={5}
            on:change={() => reset()}
        />
        <span slot="label" style="padding-right: 12px; width: max-content; display: block;">
            Radius {figure.radius}
        </span>
    </FormField>
    <FormField align="end" style="display: flex;">
        <input
            type="range"
            style="flex-grow: 1;"
            bind:value={figure.pointSpeed}
            min={-1}
            max={1}
            step="0.001"
            on:change={() => reset()}
        />
        <span slot="label" style="padding-right: 12px; width: max-content; display: block;">
            Speed {figure.pointSpeed}
        </span>
    </FormField>
    <FormField align="end" style="display: flex;">
        <input
            type="range"
            style="flex-grow: 1;"
            bind:value={figure.rotationSpeed}
            min={-1}
            max={1}
            step={0.001}
            on:change={() => reset()}
        />
        <span slot="label" style="padding-right: 12px; width: max-content; display: block;">
            Rotation speed {figure.rotationSpeed}
        </span>
    </FormField>
    <FormField align="end" style="display: flex;">
       
        <Button on:click={() => remove_figure(i)}>
            <ButtonIcon class="material-icons">remove_circle</ButtonIcon>
            <ButtonLabel>Remove Square</ButtonLabel>
        </Button>
    </FormField>
</Content>