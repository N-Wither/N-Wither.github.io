<script setup>
import ScoreBoard from './components/ScoreBoard.vue'
import ScoreDetails from './components/ScoreDetails.vue'
import { ElInputNumber, ElInput, ElButton, ElSwitch } from 'element-plus'
</script>

<script>
export default {
  data() {
    return {
      global: {
        bestOf: 5,
        map: '... | PREVIOUS: BIND PRX 5-13 EG | CURRENT: LOTUS | DECIDER: PEARL ',
        match: 'VALORANT CHAMPIONS LA: GRAND FINALS',
        logo: 'https://liquipedia.net/commons/images/thumb/a/ae/VCT_Champions_icon_allmode.png/50px-VCT_Champions_icon_allmode.png',
        theme: 'valorant',
        rounds: 24,
        startsAsAtk: false
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
      let scoresNeededToWin = Math.ceil(this.global.rounds / 2) + 1
      let shouldAddPoint = (this[team].score.filter(s => s != 'lo').length + 1 == scoresNeededToWin) && this[team].point < Math.ceil(this.global.bestOf / 2)
      if(team == 'left'){
        if(this.isMaxRoundsReached()) return;
        this.left.score.push(type)
        this.right.score.push('lo')
        if(shouldAddPoint) this.left.point ++
      }
      else {
        if(this.isMaxRoundsReached()) return;
        this.right.score.push(type)
        this.left.score.push('lo')
        if(shouldAddPoint) this.right.point ++
      }
    },
    reduce(){
      this.left.score.pop()
      this.right.score.pop()
    },
    isAtk(){
      let half = Math.ceil(this.global.rounds / 2)
      let current = this.left.score.length + 1
      if(current <= half && this.global.startsAsAtk == true) return true;
      else if (current <= half && this.global.startsAsAtk == false) return false;
      else if (current > half && this.global.startsAsAtk == true) return false;
      else return true
    },
    swap(){
      [this.left, this.right] = [this.right, this.left]
    },
    isMaxRoundsReached(){
      return this.left.score.length >= 100
    }
  }
}
</script>

<template>
  <div class="wrapper" :data-theme="global.theme">
    <ScoreBoard :global="global" :left="left" :right="right" :data-swapped="isAtk()"/>
    <ScoreDetails 
      :left-scores="left.score"
      :left-logo="left.logo"
      :right-scores="right.score"
      :right-logo="right.logo"
      :rounds="global.rounds"
      :atk-start="global.startsAsAtk"
    />
    <hr />
    <div class="control">
      <div class="split global">
        <label for="map">Map</label>
        <ElInput v-model="global.map" name="map" type="textarea" :autosize="{minRows: 1}" />
        <label for="match">Match</label>
        <ElInput v-model="global.match" name="match" type="textarea" :autosize="{minRows: 1}" />
        <label for="bestof">Best of</label>
        <ElInputNumber v-model="global.bestOf" name="bestof" :min="1" :step="2"/>
        <label for="rounds">Rounds</label>
        <ElInputNumber v-model="global.rounds" name="rounds" :min="1" :max="100"/>
        <label for="league">League Name</label>
        <ElInput v-model="global.match" name="league"/>
        <label for="league-logo">League Logo</label>
        <ElInput v-model="global.logo" name="league-logo" type="textarea" :autosize="{minRows: 2}"/>
        <div>
          <ElSwitch v-model="global.startsAsAtk" name="atk-start"></ElSwitch>
          <label for="atk-start">Start As Attacker</label>
        </div>
        <ElButton @click="reset(false)" type="warning">Reset Stats</ElButton>
        <div></div>
        <ElButton @click="reset(true)" type="danger">Reset All</ElButton>
        <div></div>
        <ElButton @click="reduce()">Reduce Score</ElButton>
        <div></div>
        <ElButton @click="swap()">Swap Teams</ElButton>
      </div>
      <div class="split left" :data-atk="isAtk()">
        <label for="left-name">Team A Name</label>
        <ElInput v-model="left.name" name="left-name" />
        <label for="left-logo">Team A Logo</label>
        <ElInput v-model="left.logo" name="left-logo" type="textarea" :autosize="{minRows: 2}"/>
        <label for="left-pos">Team A Position</label>
        <ElInput v-model="left.pos" name="left-pos" />
        <label for="left-point">Team A Points</label>
        <ElInputNumber v-model="left.point" name="left-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
        <div>Score</div>
        <ElButton @click="addScore('left', 'el')" :disabled="isMaxRoundsReached()">&#xf230; Enemy Eliminated &#xf230;</ElButton>
        <div></div>
        <ElButton @click="addScore('left', 'ex')" :disabled="!isAtk() || isMaxRoundsReached()">&#xf685; Bomb Exploded &#xf685;</ElButton>
        <div></div>
        <ElButton @click="addScore('left', 'de')" :disabled="isAtk() || isMaxRoundsReached()">&#xe2aa; Bomb Defused &#xe2aa;</ElButton>
        <div></div>
        <ElButton @click="addScore('left', 'ti')" :disabled="isAtk() || isMaxRoundsReached()">&#xea5c; Time Out &#xea5c;</ElButton>
      </div>
      <div class="split right" :data-atk="!isAtk()">
        <label for="right-name">Team B Name</label>
        <ElInput v-model="right.name" name="right-name" />
        <label for="right-logo">Team B Logo</label>
        <ElInput v-model="right.logo" name="right-logo" type="textarea" :autosize="{minRows: 2}"/>
        <label for="right-pos">Team B Position</label>
        <ElInput v-model="right.pos" name="right-pos" />
        <label for="right-point">Team B Points</label>
        <ElInputNumber v-model="right.point" name="right-point" :min="0" :max="Math.ceil(global.bestOf / 2)" />
        <div>Score</div>
        <ElButton @click="addScore('right', 'el')" :disabled="isMaxRoundsReached()">&#xf230; Enemy Eliminated &#xf230;</ElButton>
        <div></div>
        <ElButton @click="addScore('right', 'ex')" :disabled="isAtk() || isMaxRoundsReached()">&#xf685; Bomb Exploded &#xf685;</ElButton>
        <div></div>
        <ElButton @click="addScore('right', 'de')" :disabled="!isAtk() || isMaxRoundsReached()">&#xe2aa; Bomb Defused &#xe2aa;</ElButton>
        <div></div>
        <ElButton @click="addScore('right', 'ti')" :disabled="!isAtk() || isMaxRoundsReached()">&#xea5c; Time Out &#xea5c;</ElButton>
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
<style>
:root.dark-mode {
  --el-fill-color-light: #333333;
  --el-fill-color-regular: #ffffff;
  --el-fill-color-blank: #2a2a2a;
  --el-text-color-regular: #ffffff;
  --el-text-color-placeholder: #424242;
}
:root.dark-mode .el-input {
  --el-input-text-color: #ffffff;
  --el-input-bg-color: #2a2a2a;
}
:root.dark-mode .el-switch {
  --el-switch-off-color: #333333;
}

.el-input input, .el-input-number input {
  font-family: "Metropolis", "Readex Pro", "Noto Sans SC", "Material Symbols Outlined";
}
</style>
<style>
@import './assets/themes.css';

.split[data-atk=true]{
  background: var(--right-color-alpha);
}
.split[data-atk=false]{
  background: var(--left-color-alpha);
}
</style>
