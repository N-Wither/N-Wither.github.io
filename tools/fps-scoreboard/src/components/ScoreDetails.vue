<script setup>
let props = defineProps(['leftScores', 'rightScores', 'rounds', 'leftLogo', 'rightLogo', 'atkStart'])

let sort = (scores) => {
    let swapRound = Math.ceil(props.rounds / 2)
    let half1 = []
    let half2 = []
    scores.forEach((score, index) => {
        if(index + 1 <= swapRound){
            half1.push(score)
            if(index + 1 == swapRound){
                half1.push('swap')
            }
        }
        else {
            half2.push(score)
        }
    })
    return half1.concat(half2)
}

let isSwapped = (currentRound) => {
    let half = Math.ceil(props.rounds / 2)
    if(currentRound <= half && props.atkStart == false) return false;
    else if (currentRound <= half && props.atkStart == true) return true;
    else if (currentRound > half && props.atkStart == false) return true;
    else return false
}
</script>

<template>
    <div class="details" :data-theme="theme">
        <div class="details-left flex-center">
            <div class="flex-center logo-container">
                <img :src="leftLogo">
            </div>
            <div 
                v-for="(type, index) in sort(props.leftScores)"
                :key="index"
                :class="'score ' + type"
                :data-index="index <= Math.ceil(rounds / 2) ? index + 1 : index"
                :data-swapped="isSwapped(index)"
            >
            </div>
        </div>
        <div class="details-right flex-center">
            <div class="flex-center logo-container">
                <img :src="rightLogo">
            </div>
            <div 
                v-for="(type, index) in sort(props.rightScores)"
                :key="index"
                :class="'score ' + type"
                :data-index="index <= Math.ceil(rounds / 2) ? index + 1 : index"
                :data-swapped="isSwapped(index)"
            >
            </div>
        </div>
    </div>
</template>

<style>
.details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.details * {
    transition: 0.2s;
}

.details img {
    max-width: 24px;
    max-height: 24px;
}

.details-left, .details-right {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 30px;
    background: var(--background);
    color: var(--text-color);
}

.details-left .score, .details-right .score, .logo-container{
    width: 30px;
    height: 30px;
    font-size: 16px;
}

.details *::before {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.details-left :is(.ex, .el, .de, .ti)::before {
    background: var(--left-color-alpha);
}
.details-left :is(.ex, .el, .de, .ti)[data-swapped=true]::before {
    background: var(--right-color-alpha);
}
.details-left .swap::before {
    content: '↓';
}

.details-right :is(.ex, .el, .de, .ti)::before {
    background: var(--right-color-alpha);
}
.details-right :is(.ex, .el, .de, .ti)[data-swapped=true]::before {
    background: var(--left-color-alpha);
}
.details-right .swap::before {
    content: '↑';
}

.lo::before {
    content: attr(data-index);
}
.ex::before {
    content: '\f685';
}
.el::before {
    content: '\f230';
}
.de::before {
    content: '\e2aa';
}
.ti::before {
    content: '\ea5c';
}
</style>