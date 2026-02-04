<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' = 'primary';
  export let onClick: (() => void) | undefined = undefined;

  const baseClasses = 'px-8 py-4 text-lg font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'text-slate-700 bg-slate-200 hover:bg-slate-300 focus:ring-slate-400',
  };
</script>

<button {type} on:click={onClick} class="{baseClasses} {variantClasses[variant]}">
  <slot />
</button>
