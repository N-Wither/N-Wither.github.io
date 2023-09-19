<script setup>
let props = defineProps(['global', 'left', 'right'])

let getPoints = (point) => {
    let win = Math.ceil(props.global.bestOf / 2)
    let points = []
    for(let i = 0; i < win; i ++){
        if(i < point) points.push('win')
        else points.push('blank')
    }
    return points
}

let leftPoints = getPoints(props.left.point)
</script>

<template>
    <div class="scoreboard">
        <div class="row-1">
            <div class="logo left">
                <img :src="left.logo" :alt="left.name">
            </div>
            <div class="name left">
                <div class="name-text">{{ left.name }}</div>
                <div class="name-pos">{{ left.pos }}</div>
            </div>
            <div class="score left">{{ left.score.filter(s => s != 'lo').length }}</div>
            <div class="logo league"></div>
            <div class="score right">{{ right.score.filter(s => s != 'lo').length }}</div>
            <div class="name right">
                <div class="name-text">{{ right.name }}</div>
                <div class="name-pos">{{ right.pos }}</div>
            </div>
            <div class="logo right">
                <img :src="right.logo" :alt="right.name">
            </div>
        </div>
        <div class="row-2">
            <div class="point-container left">
                <div class="point" v-for="(point, index) in leftPoints" :key="index" :data-type="point"></div>
            </div>
            <div class="map flex-center">{{ global.map }}</div>
            <div class="point-container right">
                <div class="point" v-for="(point, index) in getPoints(right.point)" :key="index" :data-type="point"></div>
            </div>
        </div>
    </div>
</template>

<style>
.scoreboard {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 50px 16px;
    margin: auto;
    text-align: center;
    width: 100%;
}

.scoreboard img {
    max-width: 42px;
    max-height: 42px;
}

.row-1 {
    background-color: #0f1519;
    display: grid;
    grid-template-columns: 50px auto 50px 50px 50px auto 50px;
}

.logo, .name, .score{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.logo {
    padding: 4px;
}

.name.left {
    justify-content: left;
}

.name.right {
    justify-content: right;
}

.map, .point-container {
    height: 16px;
}

.row-2 {
    display: grid;
    grid-template-columns: auto 70px auto;
    font-size: 60%;
}

.point-container {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: flex-start;
}

.point-container.left {
    grid-row: 1/4;
    flex-direction: row-reverse;
}

.point-container.right {
    flex-direction: row;
}

.point-container .point {
    width: 8px;
    height: 8px;
}

.point-container .point[data-type=blank] {
    background: gray;
}

.point-container.left .point[data-type=win] {
    background: turquoise;
}

.point-container.right .point[data-type=win] {
    background: crimson;
}
</style>