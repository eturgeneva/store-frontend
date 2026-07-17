const euroAmountFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatPrice(cents = 0) {
    const numericCents = Number(cents);
    const safeCents = Number.isFinite(numericCents) ? numericCents : 0;

    return `${euroAmountFormatter.format(safeCents / 100)} €`;
}
