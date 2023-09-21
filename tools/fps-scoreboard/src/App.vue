<script setup>
import ScoreBoard from './components/ScoreBoard.vue'
import ScoreDetails from './components/ScoreDetails.vue'
import { ElInputNumber, ElInput, ElButton } from 'element-plus'
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
        theme: 'valorant',
        rounds: 24
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
  },
  methods: {
    reset(all) {
      this.global.bestOf = 3
      this.global.map = 'MAP'
      this.left.score = []
      this.right.score = []
      if(all){
        this.global.league = ''
        this.global.logo = ''
        this.global.rounds = 24
        this.left.name = 'TEAM A'
        this.left.logo = ''
        this.left.pos = ''
        this.left.point = 0
        this.right.name = 'TEAM B'
        this.right.logo = ''
        this.right.pos = ''
        this.right.point = 0
      }
    },
    addScore(team, type){
      if(team == 'left'){
        this.left.score.push(type)
        this.right.score.push('lo')
      }
      else {
        this.right.score.push(type)
        this.left.score.push('lo')
      }
    },
    reduce(){
      this.left.score.pop()
      this.right.score.pop()
    }
  }
}
</script>

<template>
  <div class="wrapper">
    <ScoreBoard :global="global" :left="left" :right="right" />
    <ScoreDetails 
      :left-scores="left.score"
      :left-logo="left.logo"
      :right-scores="right.score"
      :right-logo="right.logo"
      :data-theme="global.theme"
      :rounds="global.rounds"
    />
    <hr />
    <div class="control">
      <div class="split global">
        <label for="map">Map</label>
        <ElInput v-model="global.map" name="map" />
        <label for="bestof">Best of</label>
        <ElInputNumber v-model="global.bestOf" name="bestof" :min="1" :step="2"/>
        <label for="rounds">Rounds</label>
        <ElInputNumber v-model="global.rounds" name="rounds" :min="1" />
        <label for="league">League Name</label>
        <ElInput v-model="global.league" name="league"/>
        <label for="league-logo">League Logo</label>
        <ElInput v-model="global.logo" name="league-logo" type="textarea" :autosize="{minRows: 2}"/>
        <ElButton @click="reset(false)">Reset Stats</ElButton>
        <div></div>
        <ElButton @click="reset(true)">Reset All</ElButton>
        <div></div>
        <ElButton @click="reduce()">Reduce Score</ElButton>
      </div>
      <div class="split left">
        <label for="left-name">Team A Name</label>
        <ElInput v-model="left.name" name="left-name" />
        <label for="left-logo">{{ left.name }} Logo</label>
        <ElInput v-model="left.logo" name="left-logo" type="textarea" :autosize="{minRows: 2}"/>
        <label for="left-pos">{{ left.name }} Position</label>
        <ElInput v-model="left.pos" name="left-pos" />
        <label for="left-point">{{ left.name }} Points</label>
        <ElInputNumber v-model="left.point" name="left-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
        <div>Score</div>
        <div>
          <ElButton @click="addScore('left', 'el')">Elimination</ElButton>
          <ElButton @click="addScore('left', 'ex')">Exploded</ElButton>
          <ElButton @click="addScore('left', 'de')">Defused</ElButton>
          <ElButton @click="addScore('left', 'ti')">Time Out</ElButton>
        </div>
      </div>
      <div class="split right">
        <label for="right-name">Team B Name</label>
        <ElInput v-model="right.name" name="right-name" />
        <label for="right-logo">{{ right.name }} Logo</label>
        <ElInput v-model="right.logo" name="right-logo" type="textarea" :autosize="{minRows: 2}"/>
        <label for="right-pos">{{ right.name }} Position</label>
        <ElInput v-model="right.pos" name="right-pos" />
        <label for="right-point">{{ right.name }} Points</label>
        <ElInputNumber v-model="right.point" name="right-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
        <div>Score</div>
        <div>
          <ElButton @click="addScore('right', 'el')">Elimination</ElButton>
          <ElButton @click="addScore('right', 'ex')">Exploded</ElButton>
          <ElButton @click="addScore('right', 'de')">Defused</ElButton>
          <ElButton @click="addScore('right', 'ti')">Time Out</ElButton>
        </div>
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
  width: 100%;
}

.control .split {
  display: flex;
  flex-direction: column;
}

.split.global {
  flex-grow: 1;
}

.split.left, .split.right {
  flex-grow: 2;
}
</style>
