<template>
  <kirby-field ref="field" v-bind="$props">
    <kirby-multiselect-input ref="input" v-bind="$props" @focus="focus" />
  </kirby-field>
</template>

<script>

import Field from 'Forms/Field/Field.vue';
import Props from 'Forms/Fields/TextField/TextField.props.js';
import MultiselectInput from 'Plugins/Multiselect/MultiselectInput.vue';

export default {
  mixins: [Props],
  components: {
    'kirby-field': Field,
    'kirby-multiselect-input': MultiselectInput
  },
  props: {
    label: {
      default: 'Multiselect'
    },
    name: {
      default: 'multiselect'
    },
    icon: {
      default: 'angle-down'
    },
    value: {},
    options: {},
    display: {},
    search: {}
  },
  methods: {
    focus() {
      this.$refs.field.$refs.input.isFocused = true
    }
  }
}

</script>

<style lang="scss">
.kirby-input {
  .kirby-multiselect-input { min-height: 2.5rem; }

  .kirby-multiselect-list {
    width:            calc(100% + 3rem + 4px);
    top:              calc(100% + 2px);
    left:             -2px;
    background-color: $color-white;
    border:           solid $color-border;
    border-width:     0 2px 2px 2px;

    .kirby-multiselect-search {
      margin-top: -2px;
      padding:     .4rem 1.1rem;
      background:  $color-dark;
      color:       $color-light;
      font-family: $font-family-mono;
    }

    .kirby-multiselect-option {
      padding: .55rem;

      &:not(:last-child) { border-bottom: 1px solid $color-border; }

      input {
        + span::before {
          display:        inline-block;
          width:          1.25rem;
          font-family:    FontAwesome;
          content:        '\f1db';
        }

        &:checked + span {
          color: $color-positive;

          &:before {
            content: '\f00c';
          }
        }
      }
    }
  }

  &[data-focus] {
    .kirby-multiselect-list { border-color: $color-positive; }
  }
}

</style>
