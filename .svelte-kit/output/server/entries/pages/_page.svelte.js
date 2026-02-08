import "clsx";
import { x as attr, y as attr_class, w as slot, z as bind_props, F as stringify, G as ensure_array_like } from "../../chunks/index.js";
import { m as fallback, l as escape_html } from "../../chunks/context.js";
import "../../chunks/schema.js";
function Header($$renderer) {
  $$renderer.push(`<header class="bg-white shadow-sm"><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-4"><h1 class="text-2xl font-bold text-slate-800">AvgPay <span class="text-blue-600">| Nursing</span></h1></div></div></header>`);
}
function Button($$renderer, $$props) {
  let type = fallback($$props["type"], "button");
  let variant = fallback($$props["variant"], "primary");
  let onClick = fallback($$props["onClick"], void 0);
  let disabled = fallback($$props["disabled"], false);
  const baseClasses = "px-8 py-4 text-lg font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-slate-700 bg-slate-200 hover:bg-slate-300 focus:ring-slate-400"
  };
  $$renderer.push(`<button${attr("type", type)}${attr("disabled", disabled, true)}${attr_class(`${stringify(baseClasses)} ${stringify(variantClasses[variant])} ${stringify(disabled ? "opacity-50 cursor-not-allowed" : "")}`)}><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></button>`);
  bind_props($$props, { type, variant, onClick, disabled });
}
function SalaryForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let formData = {
      locationState: "CA",
      locationCity: "",
      specialty: "ICU",
      yearsExperience: 0,
      payRateHourly: 50,
      overtimeRateHourly: void 0,
      stipendWeekly: void 0,
      bonusesAnnual: void 0
    };
    let isLoading = false;
    const states = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY"
    ];
    const specialties = [
      "ICU",
      "ER",
      "Med-Surg",
      "OR",
      "L&D",
      "Pediatrics",
      "PACU",
      "NICU",
      "Telemetry",
      "Oncology",
      "Other"
    ];
    $$renderer2.push(`<div class="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto"><h2 class="text-3xl font-bold mb-6 text-slate-800 text-center">Add Your Anonymous Salary</h2> <p class="text-center text-slate-600 mb-8">Help the community by sharing your compensation. All submissions are anonymous.</p> <form class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="locationCity" class="block text-sm font-medium text-slate-700">City</label> <input type="text" id="locationCity"${attr("value", formData.locationCity)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="locationState" class="block text-sm font-medium text-slate-700">State</label> `);
    $$renderer2.select(
      {
        id: "locationState",
        value: formData.locationState,
        class: "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(states);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let state = each_array[$$index];
          $$renderer3.option({ value: state }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(state)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label for="specialty" class="block text-sm font-medium text-slate-700">Specialty</label> `);
    $$renderer2.select(
      {
        id: "specialty",
        value: formData.specialty,
        class: "mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(specialties);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let specialty = each_array_1[$$index_1];
          $$renderer3.option({ value: specialty }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(specialty)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label for="yearsExperience" class="block text-sm font-medium text-slate-700">Years of Experience</label> <input type="number" id="yearsExperience"${attr("value", formData.yearsExperience)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="md:col-span-2"><label for="payRateHourly" class="block text-sm font-medium text-slate-700">Standard Hourly Rate ($)</label> <input type="number" step="0.01" id="payRateHourly"${attr("value", formData.payRateHourly)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <h3 class="md:col-span-2 text-lg font-semibold text-slate-700 mt-4 border-t pt-4">Optional</h3> <div><label for="overtimeRateHourly" class="block text-sm font-medium text-slate-700">Overtime Rate ($/hr)</label> <input type="number" step="0.01" id="overtimeRateHourly"${attr("value", formData.overtimeRateHourly)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div> <div><label for="stipendWeekly" class="block text-sm font-medium text-slate-700">Weekly Stipend ($)</label> <input type="number" step="0.01" id="stipendWeekly"${attr("value", formData.stipendWeekly)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div> <div class="md:col-span-2"><label for="bonusesAnnual" class="block text-sm font-medium text-slate-700">Annual Bonuses ($)</label> <input type="number" step="100" id="bonusesAnnual"${attr("value", formData.bonusesAnnual)} class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/></div> <div class="md:col-span-2 mt-6">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    Button($$renderer2, {
      type: "submit",
      variant: "primary",
      disabled: isLoading,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html("Submit & Unlock Data")}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></form></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let showForm = false;
    function handleShowForm() {
      showForm = true;
    }
    $$renderer2.push(`<div class="bg-slate-50 min-h-screen">`);
    Header($$renderer2);
    $$renderer2.push(`<!----> <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">`);
    if (!showForm) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center bg-white p-12 rounded-lg shadow-md"><h2 class="text-4xl font-extrabold text-slate-800 sm:text-5xl">How much are Registered Nurses <span class="text-blue-600">really</span> making?</h2> <p class="mt-4 text-xl text-slate-600">View thousands of real, anonymous salary data points. Add yours to unlock access.</p> <div class="mt-8 flex justify-center gap-4">`);
      Button($$renderer2, {
        variant: "primary",
        onClick: handleShowForm,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->Anonymously Add My Salary`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div> <p class="mt-4 text-sm text-slate-500">To keep our data fresh and free, we ask for a quick contribution.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showForm && true) {
      $$renderer2.push("<!--[-->");
      SalaryForm($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></main></div>`);
  });
}
export {
  _page as default
};
