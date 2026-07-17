<script setup>
defineProps({
    item: {
        type: Object,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    imageSrc: {
        type: String,
        default: '',
    },
    imageAlt: {
        type: String,
        default: '',
    },
    to: {
        type: [String, Object],
        default: null,
    },
    variant: {
        type: String,
        default: 'product',
    },
});
</script>

<template>
    <article :class="['item', `item--${variant}`]">
        <div v-if="imageSrc || $slots.image" class="itemMedia">
            <slot name="image" :item="item">
                <img :src="imageSrc" :alt="imageAlt || title">
            </slot>
        </div>

        <div class="itemInfo">
            <p v-if="subtitle" class="itemBrand">{{ subtitle }}</p>
            <h3 class="itemName">
                <router-link v-if="to" :to="to" class="productLink">
                    {{ title }}
                </router-link>
                <template v-else>{{ title }}</template>
            </h3>

            <!-- #meta: info under the title (price, quantity, order status etc) -->
            <div v-if="$slots.meta" class="itemMeta">
                <slot name="meta" :item="item" />
            </div>
        </div>

        <!-- #aside: content beside the main details ("+ 3 more items") -->
        <div v-if="$slots.aside" class="itemAside">
            <slot name="aside" :item="item" />
        </div>

        <!-- #actions: buttons -->
        <div v-if="$slots.actions" class="itemActions">
            <slot name="actions" :item="item" />
        </div>
    </article>
</template>
