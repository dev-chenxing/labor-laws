<script lang="ts">
	import { mod } from "@lib/math.ts";
	interface Props {
		laborLaws: string[];
		}
		let { laborLaws }: Props = $props();

	let activeIndex: number = $state(0);

	function getLaborLawHref(law: string) {
		return `/labor-laws/${law}`
	}

	function onkeydown(e: KeyboardEvent) {
		if (document.querySelector("dialog")?.open) {
			if (e.key == "ArrowDown") {activeIndex = mod(activeIndex + 1, laborLaws.length ?? 0);}
			else if (e.key == "ArrowUp") {activeIndex = mod(activeIndex - 1, laborLaws.length ?? 0);}
			else if (e.key == "Enter") {window.open(getLaborLawHref(laborLaws[activeIndex]), "_self")}
		}
	}
</script>

<svelte:window
	{onkeydown}
/>

<div id="laborLaws" class="max-h-80 overflow-scroll">
	{#each laborLaws as law, index}
	<p class={"p-0.5 text-base/5 " + (index === activeIndex ? "bg-white text-black" : "")}>
		<a href={getLaborLawHref(law)}>{law}</a>
	</p>
	{/each}
</div>
