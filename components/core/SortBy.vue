<template>
  <v-select
    v-model="sortby"
    flat
    hide-details
    solo
    outlined
    dense
    :items="sortingVariants"
    item-text="label"
    item-value="id"
    label="Sortierung"
    class="producttoolbar__sort float-right"
    prepend-inner-icon="sort"
    :return-object="true"
    @change="changeOrder"
  />
</template>

<script>
import SortBy from '@vue-storefront/core/compatibility/components/SortBy'
import { products } from 'config'
export default {
  mixins: [SortBy],
  props: {
    hasLabel: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sortby: null
    }
  },
  watch: {
    value: {
      handler () {
        const defaultVariant = this.value && this.value.length ? this.value : products.defaultSortBy.attribute
        this.sortby = this.sortingVariants.find(variant => variant.id.includes(defaultVariant))
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '~theme/css/base/text';
    @import '~theme/css/variables/colors';
    @import '~theme/css/helpers/functions/color';
    $color-tertiary: color(tertiary);
    .sort-by {
        display: inline-flex;
        position: relative;
        border-bottom: 1px solid $color-tertiary;
        select {
            @extend .h4;
            font-size: 14px;
            border: none;
            width: 100%;
            border-radius: 0;
            background-color: transparent;
            margin-right: 0;
            &:focus {
                outline: none;
            }
        }
        &__icon {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
    @media (max-width: 770px) {
      .sort-by {
        width: 100%;
      }
    }
</style>
