<script setup>
import { computed } from 'vue';

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const badges = computed(() => {
    if (Array.isArray(props.product.badges) && props.product.badges.length) {
        return props.product.badges.slice(0, 2);
    }

    const generatedBadges = [];
    const productId = Number(props.product.id);
    const price = Number(props.product.price_cents || 0);
    const randomNumber = Math.random();

    // no property yet
    if (props.product.is_new || randomNumber < 0.2) {
        generatedBadges.push('New');
    }

    if (props.product.on_sale || props.product.discount_percent) {
        generatedBadges.push('Sale');
    }

    // no property yet
    if (props.product.stock_quantity && props.product.stock_quantity <= 5) {
        generatedBadges.push('Low stock');
    }

    if (!generatedBadges.length && price > 0 && price <= 1500) {
        generatedBadges.push('Sweet deal');
    }

    return generatedBadges.slice(0, 2);
});
</script>

<template>
    <div class="productBadges">
        <span
            v-for="badge in badges"
            :key="badge"
            class="productBadge"
        >
            {{ badge }}
        </span>
    </div>
</template>
