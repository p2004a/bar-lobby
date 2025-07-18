<!--
SPDX-FileCopyrightText: 2025 The BAR Lobby Authors

SPDX-License-Identifier: MIT
-->

<template>
    <div class="map-container">
        <div v-if="battleStore.battleOptions.map" class="map" :style="aspectRatioDrivenStyle">
            <img loading="lazy" :src="mapTextureUrl" />
            <div v-if="battleStore.battleOptions.mapOptions.startPosType === StartPosType.Boxes && boxes" class="boxes">
                <MapBattlePreviewStartBox v-for="(box, i) in boxes" v-startBox="box" :key="`box${i}`" :id="i" :box="box" />
            </div>
            <div
                v-if="battleStore.battleOptions.mapOptions.startPosType in [StartPosType.Fixed, StartPosType.Random]"
                class="start-positions"
            >
                <div
                    v-for="(side, sideIndex) in battleStore.battleOptions.map.startPos?.team?.[
                        battleStore.battleOptions.mapOptions.fixedPositionsIndex ?? 0
                    ]?.sides"
                    :key="`side${sideIndex}`"
                >
                    <div
                        v-for="(spawnPoint, spIndex) in side.starts"
                        :key="`startPos${spIndex}`"
                        v-startPos="[
                            battleStore.battleOptions.map.startPos?.positions[spawnPoint.spawnPoint],
                            mapWidthElmos,
                            mapHeightElmos,
                        ]"
                        v-setPlayerColor="rgbColors[sideIndex]"
                        class="start-pos"
                    >
                        <div class="start-pos-tooltip">
                            <span>{{ spawnPoint.spawnPoint }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { StartPosType } from "@main/game/battle/battle-types";
import { useImageBlobUrlCache } from "@renderer/composables/useImageBlobUrlCache";
import vSetPlayerColor from "@renderer/directives/vSetPlayerColor";
import vStartBox from "@renderer/directives/vStartBox";
import vStartPos from "@renderer/directives/vStartPos";
import { battleActions, battleStore } from "@renderer/store/battle.store";
import { StartBox } from "tachyon-protocol/types";
import { computed, defineComponent, ref, watch } from "vue";
import MapBattlePreviewStartBox from "@renderer/components/maps/MapBattlePreviewStartBox.vue";

defineComponent({
    directives: {
        startBox: vStartBox,
        startPos: vStartPos,
        setPlayerColor: vSetPlayerColor,
    },
});

const { get } = useImageBlobUrlCache();
const mapTextureUrl = computed(() => {
    if (!battleStore.battleOptions.map?.images) {
        return;
    }
    return get(battleStore.battleOptions.map?.springName, battleStore.battleOptions.map?.imagesBlob?.preview);
});

const startBoxes = ref(battleStore.battleOptions.map?.startboxesSet);
const startPositions = ref(battleStore.battleOptions.map?.startPos);
const mapWidthElmos = ref(battleStore.battleOptions.map?.mapWidth ? battleStore.battleOptions.map.mapWidth * 512 : null);
const mapHeightElmos = ref(battleStore.battleOptions.map?.mapHeight ? battleStore.battleOptions.map.mapHeight * 512 : null);
watch(
    () => battleStore.battleOptions.map,
    () => {
        startBoxes.value = battleStore.battleOptions.map?.startboxesSet;
        startPositions.value = battleStore.battleOptions.map?.startPos;
        mapWidthElmos.value = battleStore.battleOptions.map?.mapWidth ? battleStore.battleOptions.map.mapWidth * 512 : null;
        mapHeightElmos.value = battleStore.battleOptions.map?.mapHeight ? battleStore.battleOptions.map.mapHeight * 512 : null;
    }
);

const boxes = computed<StartBox[]>(() => battleActions.getCurrentStartBoxes());

const aspectRatioDrivenStyle = computed(() => {
    if (!battleStore.battleOptions.map?.mapWidth || !battleStore.battleOptions.map?.mapHeight) {
        return;
    }
    return battleStore.battleOptions.map.mapWidth / battleStore.battleOptions.map.mapHeight > 1 ? "height: auto;" : "height: 100%;";
});

const rgbColors = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 0, g: 255, b: 0 },
    { r: 255, g: 255, b: 0 },
    { r: 255, g: 0, b: 255 },
    { r: 0, g: 255, b: 255 },
];
</script>

<style lang="scss" scoped>
.map-container {
    flex-shrink: 0;
    aspect-ratio: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.3);
}

.map {
    position: relative;
    object-fit: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img {
        max-height: 100%;
        width: 100%;
    }
}

.boxes {
    position: absolute;
    width: 100%;
    height: 100%;
}

.start-positions {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.start-pos {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 14px;
    border: 1px solid hsl(0deg 0% 0% / 53%);
    box-shadow: 1px 1px rgb(0 0 0 / 43%);
    transform: translateX(-6px) translateY(-6px);
    &-tooltip {
        display: flex;
        align-items: center;
        position: absolute;
        transform: translateX(-50%);
        left: 6px;
        bottom: 13px;
        font-size: 12px;
        width: max-content;
        color: white;
        box-shadow:
            0 0 15px rgba(200, 200, 200, 0.5),
            0 0 25px rgba(200, 200, 200, 0.4);
        background-color: rgba(200, 200, 200, 0.15);
        .left &,
        .right & {
            bottom: -2px;
            transform: none;
        }
        .left & {
            left: 16px;
        }
        .right & {
            right: 16px;
            left: initial;
        }
        img {
            height: 16px;
            width: 16px;
        }
    }
}
</style>
