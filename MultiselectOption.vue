<template>
  <label class="kirby-multiselect-option" @click.prevent="$emit('select')">
    <input type="checkbox" :checked="selected">
    <span v-html="option.text"></span>
  </label>
</template>

<script>

export default {
  props: ['option', 'selected'],
}

</script>

<style lang="scss">

.kirby-multiselect-option {
  display:  block;
  cursor:   pointer;

  input { display: none; }
}

</style>
