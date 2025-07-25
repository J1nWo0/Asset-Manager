<script setup>
import { useRouter } from "vue-router";
import ManagerSignUpModal from "../../components/manager/ManagerSignUpModal.vue";
import { useAppToast } from "../../composables/useAppToast";
import { useAuthStore } from "../../stores/apiStore";

const { success, error } = useAppToast();
const authStore = useAuthStore();

const router = useRouter();
function goToEmployee() {
    router.push("/employee");
}

function onClickLogin() {
    router.push("/");
}

async function handleRegister(managerData) {
    try {
        await authStore.registerManager(managerData.values);
        success("Registration successful!");
        router.push("/manager/dashboard");
    } catch (err) {
        const errors = err?.response?.data?.errors;
        if (errors) {
            const messages = Object.values(errors).flat();
            messages.forEach((msg) => error(msg));
        } else {
            error("Something went wrong during registration.");
        }
        console.error("Registration failed:", err);
    }
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen">
        <div
            @click="goToEmployee"
            class="absolute top-8 right-8 text-lg font-bold text-secondary hover:text-sky-600 cursor-pointer"
        >
            Employee Sign Up
        </div>

        <div
            class="flex flex-col items-center gap-6 rounded-2xl p-10"
            style="box-shadow: 0 5px 50px -12px rgba(255, 255, 255, 0.1)"
        >
            <manager-sign-up-modal @register="handleRegister" />
            <div class="text-center">
                Already have an account?
                <span class="text-sky-600 cursor-pointer" @click="onClickLogin"
                    >Login</span
                >
            </div>
        </div>
    </div>
</template>
