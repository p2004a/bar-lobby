<!--
SPDX-FileCopyrightText: 2025 The BAR Lobby Authors

SPDX-License-Identifier: MIT
-->

<template>
    <Button :class="activeClasses" v-bind="$attrs" @click="onClick">
        <template v-if="modelValue">{{ onText }}</template>
        <template v-else>{{ offText }}</template>
    </Button>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Button from "@renderer/components/controls/Button.vue";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        onText: string;
        offText: string;
        onClasses?: string[];
        offClasses?: string[];
    }>(),
    {
        onClasses: () => ["on"],
        offClasses: () => ["off"],
    }
);

const activeClasses = computed(() => (props.modelValue ? props.onClasses : props.offClasses));

const emits = defineEmits<{
    (event: "update:modelValue", on: boolean): void;
}>();

function onClick() {
    emits("update:modelValue", !props.modelValue);
}
</script>

<style lang="scss" scoped></style>
