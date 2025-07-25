<script setup>
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import { computed, onMounted, ref, watch } from "vue";
import { getEmployeeRentals } from "../../api/rentalApi";
import { useAuthStore } from "../../stores/apiStore";

const filterOptions = [
    { label: "All", value: null },
    { label: "Active Request", value: "Active Request" },
    { label: "Past Request", value: "Past Request" },
];

const selected = ref(null);

const rents = ref([]);
const authStore = useAuthStore();
const employeeId = ref(authStore.user?.id || "");

const fetchRents = async (id) => {
    try {
        const response = await getEmployeeRentals(id);
        rents.value = response.data;
    } catch (error) {
        console.error("Error fetching rents:", error);
    }
};

onMounted(() => {
    if (employeeId.value) {
        fetchRents(employeeId.value);
    }
});

// Watch for user changes in case user is loaded asynchronously
watch(
    () => authStore.user,
    (newUser) => {
        if (newUser && newUser.id) {
            employeeId.value = newUser.id;
            fetchRents(newUser.id);
        }
    },
    { immediate: false }
);

const products = computed(() => {
    if (selected.value === null) return rents.value;
    if (selected.value === "Active Request")
        return rents.value.filter((p) =>
            ["Pending", "Confirmed"].includes(p.rentalStatus)
        );
    if (selected.value === "Past Request")
        return rents.value.filter((p) => p.rentalStatus === "Returned");
    return [];
});

const getSeverity = (product) => {
    switch (product.rentalStatus) {
        case "Returned":
            return "success";
        case "Confirmed":
            return "warning";
        case "Pending":
            return "danger";
        default:
            return null;
    }
};

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatCurrency(value) {
    return `€ ${value.toFixed(2)}`;
}
</script>

<template>
    <div class="px-16 py-4">
        <!-- Dropdown for filter -->
        <div class="mt-4 w-48">
            <Dropdown
                v-model="selected"
                :options="filterOptions"
                optionLabel="label"
                optionValue="value"
                class="w-full"
                :showClear="selected !== null"
                @clear="selected = null"
                placeholder="All"
            />
        </div>

        <div class="mt-6">
            <DataTable :value="products" tableStyle="min-width: 50rem">
                <template #header>
                    <div
                        class="flex flex-wrap items-center justify-between gap-2"
                    >
                        <span class="text-xl font-bold">My Requests</span>
                    </div>
                </template>

                <Column
                    field="assetName"
                    header="Name"
                    sortable
                    style="width: 20%"
                />

                <Column header="Image" style="width: 20%">
                    <template #body="slotProps">
                        <img
                            :src="slotProps.data.imageUrl"
                            :alt="slotProps.data.name"
                            class="w-24 h-24 object-cover rounded"
                        />
                    </template>
                </Column>

                <Column field="date" header="Date" sortable style="width: 20%">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedStart) }}
                    </template>
                </Column>

                <Column
                    field="amount"
                    header="Amount"
                    sortable
                    style="width: 15%"
                >
                    <template #body="slotProps">
                        {{ formatCurrency(slotProps.data.amount) }}
                    </template>
                </Column>

                <Column header="Status" style="width: 10%">
                    <template #body="slotProps">
                        <span
                            :class="{
                                'text-green-600 font-semibold':
                                    slotProps.data.rentalStatus ===
                                    'Returned',
                                'text-yellow-600 font-semibold':
                                    slotProps.data.rentalStatus ===
                                    'Confirmed',
                                'text-red-600 font-semibold':
                                    slotProps.data.rentalStatus ===
                                    'Pending',
                            }"
                        >
                            {{ slotProps.data.rentalStatus }}
                        </span>
                    </template>
                </Column>

                <template #footer>
                    In total there are
                    {{ products ? products.length : 0 }} products.
                </template>
            </DataTable>
        </div>
    </div>
</template>
