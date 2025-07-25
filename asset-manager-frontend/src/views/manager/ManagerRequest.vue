<script setup>
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Tag from "primevue/tag";
import { computed, onMounted, ref } from "vue";
import { getEmployeeRentals, putRentalStatus } from "../../api/rentalApi";

const filterOptions = [
    { label: "All", value: null },
    { label: "Confirmed Request", value: "Confirmed" },
    { label: "Pending Request", value: "Pending" },
    { label: "Returned Assets", value: "Returned" },
];

const selected = ref(null);
const rentals = ref([]);

// Fetch rentals from API
const fetchRentals = async () => {
    try {
        const response = await getEmployeeRentals();
        rentals.value = response.data;
    } catch (error) {
        console.error("Error fetching rentals:", error);
    }
};

// Filter rentals locally by status
const products = computed(() => {
    if (!selected.value) return rentals.value;
    return rentals.value.filter(
        (item) => item.rentalStatus === selected.value
    );
});

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Update rental status
const updateStatus = async (item, newStatus) => {
    try {
        await putRentalStatus(item.id, newStatus);
        await fetchRentals(); // Refresh after update
    } catch (error) {
        console.error("Failed to update status", error);
    }
};

onMounted(() => {
    fetchRentals();
});
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
                placeholder="All"
            />
        </div>

        <div class="mt-6">
            <DataTable
                :value="products"
                tableStyle="min-width: 50rem"
                :sortMode="'multiple'"
            >
                <Column
                    field="employeeName"
                    header="Employee Name"
                    sortable
                    style="width: 20%"
                />
                <Column
                    field="assetName"
                    header="Item Name"
                    sortable
                    style="width: 20%"
                />
                <Column header="Start Date" sortable style="width: 15%">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedStart) }}
                    </template>
                </Column>
                <Column header="End Date" sortable style="width: 15%">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data.borrowedEnd) }}
                    </template>
                </Column>
                <Column header="Status" sortable style="width: 15%">
                    <template #body="slotProps">
                        <Tag
                            style="
                                border: 2px solid var(--border-color);
                                background: transparent;
                                color: var(--text-color);
                            "
                            :value="slotProps.data.rentalStatus"
                        />
                    </template>
                </Column>
                <Column header="Action" style="width: 15%">
                    <template #body="slotProps">
                        <div class="flex gap-2">
                            <Button
                                v-if="
                                    slotProps.data.rentalStatus === 'Pending'
                                "
                                label="Approve"
                                size="small"
                                class="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 rounded-full px-3 py-1 text-xs"
                                @click="
                                    updateStatus(slotProps.data, 'Approved')
                                "
                            />

                            <Button
                                v-else-if="
                                    slotProps.data.rentalStatus ===
                                    'Confirmed'
                                "
                                label="Return"
                                size="small"
                                class="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 rounded-full px-3 py-1 text-xs"
                                @click="
                                    updateStatus(slotProps.data, 'Returned')
                                "
                            />

                            <Button
                                v-else-if="
                                    slotProps.data.rentalStatus ===
                                    'Returned'
                                "
                                label="Completed"
                                size="small"
                                disabled
                                class="bg-green-100 text-green-700 border border-green-300 rounded-full px-3 py-1 text-xs cursor-default"
                            />
                        </div>
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
