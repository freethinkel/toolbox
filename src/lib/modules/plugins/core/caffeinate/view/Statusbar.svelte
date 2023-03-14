<script>
  import Switch from "@/modules/shared/components/Switch.svelte";
  import { CaffeinateStore } from "../store/caffeinate.store";

  const enabled = CaffeinateStore.$enabled.$store;
  const setEnabled = CaffeinateStore.$enabled.setValue;
</script>

<div class="wrapper">
  <Switch checked={$enabled} on:change={({ detail }) => setEnabled(detail)}>
    Caffeinate
  </Switch>
</div>

<style>
  .wrapper {
    padding-top: 10px;
  }
</style>
