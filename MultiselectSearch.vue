<template>
  <input
    type="search"
    class="kirby-multiselect-search"
    :value="value"
    @input="$emit('input', $event.target.value)"
    placeholder="Type to filter…">
</template>

<script>

export default {
  props: ['value'],
  methods: {
    focus() {
      this.$el.focus()
    }
  }
}

</script>

<style lang="scss">

.kirby-multiselect-search {
  width:              100%;
  background:         transparent;
  border:             none;
  -webkit-appearance: none;

  &:focus { outline: none; }
}

::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

</style>
