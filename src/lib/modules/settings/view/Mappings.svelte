<script lang="ts">
  import FramePosition from "@/modules/shared/components/FramePosition.svelte";
  import ShortcutRecorder from "@/modules/shared/components/ShortcutRecorder.svelte";
  import { SettingsStore } from "../store/settings.store";
  import type { MappingAction } from "../model/mappings";

  const mappings = SettingsStore.mappings.$store;

  const changeMapping = (mapping: MappingAction, newKeys: string[]) => {
    SettingsStore.mappings.setValue(
      SettingsStore.mappings.$store.getState().map((item) => {
        if (item === mapping) {
          item.shortcut = newKeys;
        }
        return item;
      })
    );
  };
</script>

<div class="wrapper">
  <table>
    <thead>
      <tr>
        <th>Action</th>
        <th>Mapping</th>
      </tr>
    </thead>

    <tbody>
      {#each $mappings as mapping}
        <tr>
          <td>
            <FramePosition frame={mapping.frame} />
          </td>
          <td>
            <div class="shortcut">
              <ShortcutRecorder
                keys={mapping.shortcut}
                on:record={({ detail }) => changeMapping(mapping, detail)}
              />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="postcss">
  .wrapper {
    padding: 12px;
    overflow: auto;
    flex: 1;
    min-height: 0;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
    & td:last-of-type,
    & th:last-of-type {
      text-align: right;
    }
  }

  .shortcut {
    display: flex;
    justify-content: flex-end;
  }
</style>
