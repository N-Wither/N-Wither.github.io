<script setup>
import ScoreBoard from './components/ScoreBoard.vue'
</script>

<script>
export default {
  data() {
    return {
      global: {
        bestOf: 5,
        map: 'BIND',
        logo: 'https://liquipedia.net/commons/images/thumb/a/ae/VCT_Champions_icon_allmode.png/25px-VCT_Champions_icon_allmode.png'
      },
      left: {
        name: 'EG',
        logo: 'https://liquipedia.net/commons/images/thumb/8/8c/Evil_Geniuses_2020_lightmode.png/105px-Evil_Geniuses_2020_lightmode.png',
        pos: 'AMER#1',
        score: ['lo', 'lo', 'de', 'lo', 'de', 'lo', 'el', 'lo', 'de', 'el', 'lo', 'lo', 'el', 'el', 'el', 'el', 'lo', 'lo', 'el', 'el', 'el', 'lo', 'el'],
        point: 3
      },
      right: {
        name: 'PRX',
        logo: 'https://liquipedia.net/commons/images/thumb/8/8c/Paper_Rex_lightmode.png/59px-Paper_Rex_lightmode.png',
        pos: 'PAC#1',
        score: ['el', 'el', 'lo', 'ex', 'lo', 'el', 'lo', 'ex', 'lo', 'lo', 'el', 'el', 'lo', 'lo', 'lo', 'lo', 'de', 'de', 'lo', 'lo', 'lo', 'de', 'lo'],
        point: 1
      }
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <ScoreBoard :global="global" :left="left" :right="right" />
    <div>
      <label for="map">Map</label>
      <input type="text" v-model="global.map" name="map">
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
