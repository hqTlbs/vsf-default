<template>
  <v-btn
    @click="$emit('click')"
    dense
    icon
    depressed
    @click.stop="$emit('click')"
  >
    <v-icon color="error">
      cancel
    </v-icon>
  </v-btn>
</template>
