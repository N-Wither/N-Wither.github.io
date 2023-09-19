<script setup>
import ScoreBoard from './components/ScoreBoard.vue'
import { ElInputNumber, ElInput } from 'element-plus'
</script>

<script>
export default {
  data() {
    return {
      global: {
        bestOf: 5,
        map: 'LOTUS',
        league: 'Valorant Champions',
        logo: 'https://liquipedia.net/commons/images/thumb/a/ae/VCT_Champions_icon_allmode.png/50px-VCT_Champions_icon_allmode.png',
        theme: 'valorant'
      },
      left: {
        name: 'EVIL GENIUSES',
        logo: 'https://am-a.akamaihd.net/image?resize=72:72&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1644568669110_CrestWhite1.png',
        pos: 'AMERICAS#1',
        score: ['lo', 'lo', 'de', 'lo', 'de', 'lo', 'el', 'lo', 'de', 'el', 'lo', 'lo', 'el', 'el', 'el', 'el', 'lo', 'lo', 'el', 'el', 'el', 'lo', 'el'],
        point: 3
      },
      right: {
        name: 'PAPER REX',
        logo: 'https://am-a.akamaihd.net/image?resize=72:72&f=http%3A%2F%2Fstatic.lolesports.com%2Fteams%2F1630018120582_paper-rex-2021.png',
        pos: 'PACIFIC#1',
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
    <div class="control">
      <div class="split">
        <label for="map">Map</label>
        <ElInput v-model="global.map" name="map" />
        <label for="bestof">Best of</label>
        <ElInputNumber v-model="global.bestOf" name="bestof" :min="1" :step="2"/>
      </div>
      <div class="split">
        <label for="left-name">Team 1 Name</label>
        <ElInput v-model="left.name" name="left-name" />
        <label for="left-pos">{{ left.name }} Position</label>
        <ElInput v-model="left.pos" name="left-pos" />
        <label for="left-point">{{ left.name }} Points</label>
        <ElInputNumber v-model="left.point" name="left-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
      </div>
      <div class="split">
        <label for="right-name">Team 2 Name</label>
        <ElInput v-model="right.name" name="right-name" />
        <label for="right-pos">{{ right.name }} Position</label>
        <ElInput v-model="right.pos" name="right-pos" />
        <label for="right-point">{{ right.name }} Points</label>
        <ElInputNumber v-model="right.point" name="right-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
      </div>
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

.control {
  display: flex;
  flex-direction: row;
  gap: 6px;
}

/* .control .split {
  display: flex;
  flex-direction: column;
} */
</style>
