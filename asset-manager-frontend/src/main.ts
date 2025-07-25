import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Material from "@primevue/themes/material";
import router from "./router";
import { definePreset } from "@primeuix/themes";
import { createPinia } from "pinia";
import "primeicons/primeicons.css";
import "./styles/style.css";

//PrimeVue Components
import Button from "primevue/button";
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";

import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

const app = createApp(App);

const Noir = definePreset(Material, {
    semantic: {
        primary: {
            50: "{sky.50}",
            100: "{sky.100}",
            200: "{sky.200}",
            300: "{sky.300}",
            400: "{sky.400}",
            500: "{sky.500}",
            600: "{sky.600}",
            700: "{sky.700}",
            800: "{sky.800}",
            900: "{sky.900}",
            950: "{sky.950}",
        },
        colorScheme: {
            light: {
                primary: {
                    color: "{sky.950}",
                    inverseColor: "#ffffff",
                    hoverColor: "{sky.900}",
                    activeColor: "{sky.800}",
                },
                highlight: {
                    background: "{sky.950}",
                    focusBackground: "{sky.700}",
                    color: "#ffffff",
                    focusColor: "#ffffff",
                },
            },
            dark: {
                primary: {
                    color: "{sky.50}",
                    inverseColor: "{sky.950}",
                    hoverColor: "{sky.100}",
                    activeColor: "{sky.200}",
                },
                highlight: {
                    background: "rgba(200, 220, 255, 0.12)",
                    focusBackground: "rgba(200, 220, 255, 0.30)",
                    color: "rgba(220, 235, 255, 0.87)",
                    focusColor: "rgba(220, 235, 255, 1)",
                },
            },
        },
    },
});

app.use(PrimeVue, {
    theme: {
        preset: Noir,
    },
});

app.component("Button", Button);
app.component("Card", Card);
app.component("DatePicker", DatePicker);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Tag", Tag);

app.use(ToastService);
app.component("Toast", Toast);

const pinia = createPinia();
app.use(pinia);

app.use(router);
app.mount("#app");
