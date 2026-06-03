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

    if (props.product.is_new || productId % 5 === 0) {
        generatedBadges.push('New');
    }

    if (props.product.on_sale || props.product.discount_percent) {
        generatedBadges.push('Sale');
    }

    if (props.product.stock_quantity && props.product.stock_quantity <= 5) {
        generatedBadges.push('Low stock');
    }

    if (!generatedBadges.length && price > 0 && price <= 2500) {
        generatedBadges.push('Sweet deal');
    }

    if (!generatedBadges.length) {
        generatedBadges.push('Gift pick');
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
