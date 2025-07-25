<script setup>
import { Form, FormField } from "@primevue/forms";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import { useRouter } from "vue-router";
import { useAppToast } from "../composables/useAppToast";
import { useAuthStore } from "../stores/apiStore";

const { success, error } = useAppToast();

const router = useRouter();
const authStore = useAuthStore();

const onSignUpClick = () => {
    router.push("/employee");
};

async function handleLogin(formData) {
    try {
        await authStore.login(formData.values);
        success("Logged in successfully!");

        await authStore.fetchUser();

        if (authStore.user.role === "Employee") {
            router.push("/employee/dashboard"); // Redirect to employee dashboard
        } else {
            router.push("/manager/dashboard"); // Redirect to manager dashboard
        }
    } catch (err) {
        const errors = err?.response?.data?.errors;
        if (errors) {
            const messages = Object.values(errors).flat();
            messages.forEach((msg) => error(msg));
        } else if (err?.response?.status === 401) {
            error("Invalid email or password. Please try again.");
        }
        console.error("Login failed:", err);
    }
}
</script>

<template>
    <section class="relative flex items-center justify-center min-h-screen">
        <div
            class="p-8 rounded-lg"
            style="box-shadow: 0 5px 50px -12px rgba(255, 255, 255, 0.1)"
        >
            <h1 class="text-2xl font-bold text-center mb-6 text-primary-100">
                Log in
            </h1>
            <Form
                @submit="handleLogin"
                class="flex flex-col gap-4 w-full sm:w-56"
            >
                <FormField
                    v-slot="$field"
                    as="section"
                    name="Email"
                    initialValue=""
                    class="flex flex-col gap-2"
                >
                    <InputText type="text" placeholder="Email" />
                    <Message
                        v-if="$field?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $field.error?.message }}</Message
                    >
                </FormField>
                <FormField
                    v-slot="$field"
                    asChild
                    name="password"
                    initialValue=""
                >
                    <section class="flex flex-col gap-2">
                        <Password
                            type="text"
                            placeholder="Password"
                            :feedback="false"
                            toggleMask
                            fluid
                        />
                        <Message
                            v-if="$field?.invalid"
                            severity="error"
                            size="small"
                            variant="simple"
                            >{{ $field.error?.message }}</Message
                        >
                    </section>
                </FormField>

                <Button
                    type="submit"
                    label="Log In"
                    severity="primary"
                    class="text-black p-2 w-full"
                />
            </Form>
            <div class="text-center mt-4">
                Don't have an account?
                <span
                    class="text-sky-600 dark:text-sky-600 hover:underline cursor-pointer"
                    @click="onSignUpClick"
                >
                    Sign Up
                </span>
            </div>
        </div>
    </section>
</template>
