<script setup>
import { format } from "date-fns";
import { X } from "lucide-vue-next";
import DatePicker from "primevue/datepicker";
import { ref } from "vue";
import { rentAsset } from "../../api/rentalApi";
import { useAppToast } from "../../composables/useAppToast";

import Button from "primevue/button";

const { success, error } = useAppToast();

const props = defineProps({
    modelValue: Boolean,
    asset: Object,
});
const emit = defineEmits(["update:modelValue"]);

const startDate = ref(null);
const endDate = ref(null);

import { watch } from "vue";

// Reset dates when asset changes
watch(
  () => props.asset,
  () => {
    startDate.value = null;
    endDate.value = null;
  }
);

const closeModal = () => {
    emit("update:modelValue", false);
};

const onClickRent = async () => {
    if (!startDate.value || !endDate.value) {
        error("Please select both start and end dates.");
        return;
    }
    const formattedStart = format(startDate.value, "yyyy-MM-dd");
    const formattedEnd = format(endDate.value, "yyyy-MM-dd");
    try {
        await rentAsset(props.asset.id, formattedStart, formattedEnd);
        success("Asset rented successfully");
        emit("updated");
    } catch (error) {
        error("Failed to rent asset. Please try again.");
        console.error("Error renting asset:", error);
    }
    closeModal();
};
</script>

<template>
    <transition name="fade">
        <div
            v-if="modelValue"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div
                class="bg-[#18181B] rounded-lg p-6 shadow-lg max-w-[90vw] max-h-[90vh] overflow-auto relative"
            >
                <!-- Close (X) Button -->
                <button
                    @click="closeModal"
                    class="absolute top-4 right-4 text-sky-50 hover:text-sky-100"
                >
                    <X class="w-6 h-6" />
                </button>

                <div class="flex gap-6">
                    <!-- Image -->
                    <img
                        :src="asset.imageUrl"
                        alt="Asset Image"
                        class="w-[300px] h-[300px] object-cover rounded-lg"
                    />

                    <!-- Info -->
                    <div class="flex flex-col justify-center">
                        <h1 class="text-sky-50 text-xl font-semibold mb-4">
                            {{ asset.name }}
                        </h1>
                        <p class="text-sky-100 max-w-md">
                            {{ asset.description }}
                        </p>
                        <h1 class="text-sky-50 text-xl font-semibold mt-4">
                            € {{ asset.amount }}
                        </h1>

                        <!-- Rent Duration -->
                        <h3 class="font-semibold text-md text-sky-50 mt-2">
                            Rent Duration
                        </h3>

                        <div class="grid grid-cols-2">
                            <!-- Start Date -->
                            <div class="p-3 flex flex-col gap-1">
                                <label class="text-xs font-bold text-sky-50"
                                    >START</label
                                >
                                <DatePicker
                                    v-model="startDate"
                                    placeholder="Select start date"
                                    dateFormat="mm/dd/yy"
                                    :showTime="false"
                                    :touchUI="true"
                                    :utc="false"
                                    inputClass="border-none bg-sky-50 text-xs p-0 focus:ring-0"
                                    class="w-full"
                                />
                            </div>

                            <!-- End Date -->
                            <div class="p-3 flex flex-col gap-1">
                                <label class="text-xs font-bold text-sky-50"
                                    >END</label
                                >
                                <DatePicker
                                    v-model="endDate"
                                    placeholder="Select end date"
                                    dateFormat="mm/dd/yy"
                                    :showTime="false"
                                    :touchUI="true"
                                    :utc="false"
                                    inputClass="border-none bg-transparent text-xs p-0 focus:ring-0"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- Submit -->
                        <Button
                            @click="onClickRent"
                            type="submit"
                            label="Submit"
                            severity="primary"
                            class="text-black mt-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
