<script setup>
defineOptions({
    name: 'BaseDrawer',
});

defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        required: true,
    },
    labelledBy: {
        type: String,
        default: 'drawer-title',
    },
});

const emit = defineEmits(['close', 'mouseenter', 'mouseleave']);
</script>

<template>
    <div
        v-if="open"
        class="drawerOverlay"
        @click="emit('close')"
    />

    <aside
        class="drawer"
        :class="{ open }"
        :aria-hidden="!open"
        :aria-labelledby="labelledBy"
        @mouseenter="emit('mouseenter')"
        @mouseleave="emit('mouseleave')"
    >
        <div class="drawerHeader">
            <h2 :id="labelledBy">
                <slot name="title">{{ title }}</slot>
            </h2>

            <button
                type="button"
                class="drawerClose"
                :aria-label="`Close ${title}`"
                @click="emit('close')"
            >
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="drawerBody">
            <slot />
        </div>

        <div
            v-if="$slots.footer"
            class="drawerFooter"
        >
            <slot name="footer" />
        </div>
    </aside>
</template>
