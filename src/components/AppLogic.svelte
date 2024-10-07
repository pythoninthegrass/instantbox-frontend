<script>
  import { onMount } from 'svelte';
  import { getOSList, getOSUrl, removeContainerById } from '../util/api';
  import { getItem, setItem, rmItem } from '../util/util';
  import SelectSystemConfig from './SelectSystemConfig.astro';
  import SystemConfiguration from './SystemConfiguration.svelte';
  import LanguageSwitcher from './LanguageSwitcher.svelte';

  export let osList;

  let isExistContainer = false;
  let container = {};
  let selectedVersion = {};
  let selectedOS = {};
  let screenLoading = false;
  let screenText = '';
  let skipModalVisible = false;

  onMount(() => {
    checkExistingContainer();
  });

  function checkExistingContainer() {
    let containerInfo = getItem("containerInfo");
    if (containerInfo) {
      containerInfo = JSON.parse(containerInfo);
      const curTime = Math.floor(new Date().getTime() / 1000);
      if (curTime < containerInfo.timeout) {
        isExistContainer = true;
        container = containerInfo;
      } else {
        rmItem("containerInfo");
      }
    }
  }

  async function handleSelectAgain() {
    screenLoading = true;
    screenText = 'Purging...';
    const timestamp = Math.floor(new Date().getTime() / 1000);
    try {
      const res = await removeContainerById(
        container.containerId,
        container.shareUrl,
        timestamp
      );
      if (res.statusCode !== 1) {
        throw new Error(res.message);
      }
      isExistContainer = false;
      container = {};
      rmItem("containerInfo");
    } catch (err) {
      console.error(err);
    } finally {
      screenLoading = false;
    }
  }

  async function handleCreateContainer(event) {
    const { os, timeout, cpu, mem, port } = event.detail;
    screenLoading = true;
    screenText = 'Creating container...';
    try {
      const res = await getOSUrl(os, timeout, cpu, mem, port);
      if (res.statusCode !== 1) {
        throw new Error(res.message);
      }
      container = {
        ...res,
        system: selectedOS.label,
        version: selectedVersion.label,
        cpu,
        mem,
        timeoutH: timeout,
        innerPort: port
      };
      setItem("containerInfo", JSON.stringify(container));
      isExistContainer = true;
      skipModalVisible = true;
    } catch (err) {
      console.error(err);
    } finally {
      screenLoading = false;
    }
  }
</script>

{#if screenLoading}
  <div class="loading-screen">
    <p>{screenText}</p>
  </div>
{/if}

{#if isExistContainer}
  <SystemConfiguration {container} />
  <div style="margin-top: 20px; text-align: center;">
    <button on:click={() => window.open(container.shareUrl.replace('http://:', `http://${window.location.hostname}:`))}>
      Open OS
    </button>
    <button on:click={handleSelectAgain}>
      Purge OS
    </button>
  </div>
{:else}
  <SelectSystemConfig {osList} on:create={handleCreateContainer} />
{/if}

{#if skipModalVisible}
  <div class="modal">
    <p>Open webshell?</p>
    <button on:click={() => {
      window.open(container.shareUrl.replace('http://:', `http://${window.location.hostname}:`));
      skipModalVisible = false;
    }}>OK</button>
    <button on:click={() => skipModalVisible = false}>Cancel</button>
  </div>
{/if}

<style lang="scss">
  @import '../styles/App.scss';
</style>
