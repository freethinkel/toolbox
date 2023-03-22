<script>
  import Placeholder from "../components/Placeholder.svelte";
  import { SnappingStore } from "../store/snapping.store";

  const frame = SnappingStore.$placeholder;
</script>

<Placeholder frame={$frame} />
