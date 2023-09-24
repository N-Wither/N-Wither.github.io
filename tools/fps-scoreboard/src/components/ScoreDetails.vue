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
    <div class="details">
        <div class="details-left">
            <div class="flex-center logo-container">
                <img :src="leftLogo" class="logo">
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
        <div class="details-right">
            <div class="flex-center logo-container">
                <img :src="rightLogo" class="logo">
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
    height: 60px;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
    background: var(--background);
    justify-content: center;
    align-items: center;
    position: relative;
}

:is(.details, .details-left, .details-right)::-webkit-scrollbar {
    display: none;
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
    justify-content: center;
}

.details-left .score, .details-right .score, .logo-container{
    min-width: 30px;
    min-height: 30px;
    max-width: 30px;
    max-height: 30px;
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

.details-left .score {
    overflow-x: hidden;
    animation: 0.2s ease-out slideToBottom, 0.2s ease-out expand;
}
.details-right .score {
    overflow-x: hidden;
    animation: 0.2s ease-out slideToTop, 0.2s ease-out expand;
}

@keyframes slideToBottom {
    from {
        transform: translateY(-100%);
    }
    to {
        transform: translateY(0);
    }
}
@keyframes slideToTop {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
@keyframes expand {
    from {
        max-width: 0;
        min-width: 0;
    }
    to {
        max-width: 30px;
        min-width: 30px;
    }
}
</style>