<template>
  <div class="kirby-multiselect-wrapper">
    <div class="kirby-multiselect-input"
      @click="toggle">
      <kirby-tag
        v-for="entry in selection"
        :key="entry"
        @remove="remove(selection.indexOf(entry))"
        :removable="true">
          {{ text(entry) }}
      </kirby-tag>
    </div>

    <kirby-multiselect-list
      ref="list"
      :open="open"
      :options="options"
      :selection="selection"
      :search="search"
      @select="select" />
  </div>
</template>

<script>

import Tag  from 'Buttons/Tag/Tag.vue';
import List from 'Plugins/Multiselect/MultiselectList.vue';

export default {
  components: {
    'kirby-tag': Tag,
    'kirby-multiselect-list': List
  },
  props: {
    id: {},
    value: {},
    options: {},
    display: {
      default: 'text'
    },
    search: {
      default: true
    }
  },
  data: function() {
    var selection = this.value || [];

    // in case values as saved as imploded string
    if(typeof selection === 'string') {
      selection = selection.split(',').map(el => el.trim());
    }

    return {
      open:      false,
      selection: selection
    };
  },
  mounted: function() {
    this.$el.addEventListener('blur', (e) => {
      console.log(e.target);
      console.log(e.target.parentNode);
      console.log(this.$refs.list);
      if(e.target !== this.$refs.list && e.target.parentNode !== this.$refs.list) {
        this.toggle()
      }
    }, true);
  },
  methods: {
    toggle: function() {
      this.open = !this.open
      this.$emit(this.open ? 'focus' : 'blur')

      if(this.open && this.search) {
        this.$nextTick(() => {
          this.$refs.list.query = ''
          this.$refs.list.$refs.input.focus()
        })
      }
    },
    select: function (option) {
      var index = this.selection.findIndex(x => x === option.value)
      if(index === -1) this.add(option)
      else             this.remove(index)
    },
    add: function(option) {
      this.selection.push(option.value)
      this.selection.sort((a, b) => this.index(a) - this.index(b))
    },
    remove: function(index) {
      this.selection.splice(index, 1)
    },
    text: function (value) {
      return this.options.filter(x => x.value === value)[0][this.display]
    },
    index: function(value) {
      return this.options.findIndex(x => x.value === value);
    }
  }
}

</script>

<style lang="scss">

.kirby-multiselect-wrapper { position: relative; }

.kirby-multiselect-input {
  display:     flex;
  flex-wrap:   wrap;
  padding:     4px 0 0 4px;
  cursor:      pointer;

    .kirby-tag {
      margin-right:  4px;
      margin-bottom: 4px;
    }
}

</style>
