<!--
SPDX-FileCopyrightText: 2025 The BAR Lobby Authors

SPDX-License-Identifier: MIT
-->

<template>
    <div v-if="isVisible" class="container">
        <Panel class="error-modal">
            <template #header>
                <div class="title">Fatal Error</div>
            </template>
            <div class="flex-col gap-md">
                <div>A fatal error has occurred and BAR Lobby needs to reload.</div>
                <div v-if="error" class="error">{{ error.message }}</div>
                <div v-if="promiseError?.reason.stack" class="error">{{ promiseError.reason.stack }}</div>
                <Button @click="uploadLogsCommand">Upload logs</Button>
                <div v-if="uploadLogMsg">{{ uploadLogMsg }}</div>
                <Button @click="reload">Reload</Button>
                <Button @click="quitToDesktop">Quit to Desktop</Button>
            </div>
        </Panel>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import Panel from "@renderer/components/common/Panel.vue";
import Button from "@renderer/components/controls/Button.vue";
import { Logger, uploadLogs } from "@renderer/utils/log";

const log = new Logger("Error.vue");

const isVisible = ref(false);
const error: Ref<ErrorEvent | undefined> = ref();
const promiseError: Ref<PromiseRejectionEvent | undefined> = ref();
const uploadLogMsg = ref("");

window.addEventListener("unhandledrejection", function (event) {
    console.error(event);
    console.log("unhandled rejection");
    log.error(event.reason.stack);
    promiseError.value = event;
    isVisible.value = true;
});

window.addEventListener("error", (event) => {
    if (event.message === "ResizeObserver loop limit exceeded") {
        event.stopPropagation();
        console.warn(event);
        return;
    }

    error.value = event;
    console.error(event);
    log.error(event.message);
    isVisible.value = true;
});

function reload() {
    window.document.location.reload();
}

async function quitToDesktop() {
    window.close();
}

async function uploadLogsCommand() {
    try {
        uploadLogMsg.value = "Uploading...";
        const url = await uploadLogs();
        await navigator.clipboard.writeText(url);
        uploadLogMsg.value = "Log URL was copied to clipboard.";
    } catch (e) {
        if (typeof e === "string") {
            uploadLogMsg.value = e;
        } else if (e instanceof Error) {
            uploadLogMsg.value = `Could not upload log: ${e.message}`;
        } else {
            uploadLogMsg.value = "Could not upload log.";
        }
        console.error(e);
    }
}
</script>

<style lang="scss" scoped>
.error-modal {
    background: rgba(224, 17, 17, 0.7) !important;
}
.error {
    font-size: 16px;
    white-space: pre-line;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 10px;
    user-select: all;
}
.container {
    @extend .fullsize;
    z-index: 2147483645; // max available value, 2147483646 is used by vue inspector.
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
}
.title {
    padding: 5px 10px;
    flex-grow: 1;
    text-transform: capitalize;
    font-weight: 600;
}
</style>
