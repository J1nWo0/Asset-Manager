<script setup>
import AssetModal from "@/components/manager/AssetModal.vue";
import Button from "primevue/button";
import DataView from "primevue/dataview";
import Dropdown from "primevue/dropdown";
import Paginator from "primevue/paginator";
import { computed, onMounted, ref, watch } from "vue";
import { getAllAssets } from "../../api/assetApi";

const selectedCategory = ref(null);
const searchQuery = ref("");
const first = ref(0);
const itemsPerPage = 10;
const assets = ref([]);
const status = ref("all");
const statusOptions = ["All Items", "Borrowed", "Available"];
const selectedStatus = ref("All Items");
const showModal = ref(false);
const selectedAsset = ref(null);

const fetchAssets = async () => {
    const res = await getAllAssets(status.value);
    assets.value = res.data;
};

watch(selectedStatus, async (newVal) => {
    status.value = newVal.toLowerCase().replace(" ", "");
    await fetchAssets();
});

onMounted(async () => {
    await fetchAssets();
});

// Apply category + search filter locally
const filteredAssets = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return assets.value.filter((asset) => {
        const matchesCategory = selectedCategory.value
            ? asset.category === selectedCategory.value
            : true;
        const matchesSearch = asset.name.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
});

// Pagination
const paginatedAssets = computed(() => {
    return filteredAssets.value.slice(first.value, first.value + itemsPerPage);
});

function onPageChange(event) {
    first.value = event.first;
}

// Clear category and search
function resetCategory() {
    selectedCategory.value = null;
    first.value = 0;
    searchQuery.value = "";
}

// Modal open
function openModal(asset) {
    selectedAsset.value = asset;
    showModal.value = true;
}

// Generate category options from assets (dynamic)
const categoryOptions = computed(() => {
    return statusOptions.map((status) => ({ label: status, value: status }));
});
</script>

<template>
    <div class="px-16 py-4">
        <div class="px-4 sm:px-6 lg:px-8">
            <h2 class="text-lg text-brand-black font-semibold font-ubuntu mb-2">
                Available Assets
            </h2>

            <!-- Search and Category Dropdown -->
            <div class="flex flex-wrap items-center justify-between mb-4 gap-4">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search assets..."
                    class="bg-transparent border border-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-200 w-full sm:max-w-xs"
                />

                <div class="flex gap-2 items-center">
                    <Dropdown
                        v-model="selectedStatus"
                        :options="categoryOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select Status"
                        severity="primary"
                        class="w-48"
                    />
                </div>
            </div>

            <!-- Asset Grid -->
            <DataView
                :value="paginatedAssets"
                layout="grid"
                :paginator="false"
                class="mt-6"
            >
                <template #grid="{ items }">
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <div
                            v-for="item in items"
                            :key="item.id || item.name"
                            class="border rounded-lg p-4 flex flex-col shadow-sm hover:shadow-md transition"
                        >
                            <div
                                class="relative bg-sky-50 flex justify-center rounded p-4 mb-4"
                            >
                                <img
                                    :src="item.imageUrl"
                                    :alt="item.name"
                                    class="rounded w-full max-w-[250px] object-cover h-40"
                                />
                            </div>

                            <div class="flex flex-col flex-grow">
                                <h3 class="text-lg font-semibold mb-1">
                                    {{ item.name }}
                                </h3>
                                <p
                                    class="text-sm text-secondary line-clamp-2 mb-3"
                                >
                                    {{ item.description }}
                                </p>

                                <div class="text-2xl font-bold mb-4">
                                    ${{ item.amount ?? "—" }}
                                </div>

                                <Button
                                    label="View Details"
                                    class="mt-auto"
                                    severity="primary"
                                    @click="openModal(item)"
                                />
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>

            <!-- Pagination -->
            <div class="mt-6 flex justify-center">
                <Paginator
                    :rows="itemsPerPage"
                    :totalRecords="filteredAssets.length"
                    :first="first"
                    @update:first="onPageChange"
                />
            </div>
        </div>

        <!-- Asset Modal -->
        <AssetModal v-model="showModal" :asset="selectedAsset" />
    </div>
</template>
