<template>
  <div class="kirby-multiselect-list"
    v-if="open"
    tabindex="-1">
    <kirby-multiselect-search ref="input" v-model="query" v-if="search" />

    <kirby-multiselect-option
      v-for="option in filtered"
      ref="entry"
      key="option.value"
      :option="option"
      :selected="selection.indexOf(option.value) !== -1"
      @select="$emit('select', option)" />
  </div>
</template>

<script>

import Search from 'Plugins/Multiselect/MultiselectSearch.vue';
import Option from 'Plugins/Multiselect/MultiselectOption.vue';

export default {
  components: {
    'kirby-multiselect-search': Search,
    'kirby-multiselect-option': Option
  },
  props: ['open', 'options', 'selection', 'search'],
  data: function() {
    return {
      query:   '',
      current: null
    };
  },
  computed: {
    regex: function () {
      return new RegExp("(" + this.query + ")", "ig")
    },
    filtered: function() {
      return this.options.filter(item => item.text.match(this.regex)).map(x => ({value: x.value, text:  x.text.replace(this.regex, "<b>$1</b>")}))
    }
  },
  methods: {
    navigate: function(step) {
      if(current === null) {
        this.$refs.entry[0];
      }
    }
  }
}

</script>

<style lang="scss">

.kirby-multiselect-list {
  position:  absolute;
  top:       100%;
  left:      0;
  width:     100%;
  font:      inherit;
  font-size: .8em;

  &:focus { outline: none; }
}

</style>
